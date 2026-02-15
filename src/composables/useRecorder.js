import { ref } from 'vue'
import { useAlarmStore } from '@/stores/alarmStore'
import { usePlayer } from './usePlayer'
import { useToast } from './useToast'

const WAV_CHUNK_INTERVAL_MS = 2000
const DEFAULT_CHUNK_INTERVAL_MS = 1000
const TIMER_INTERVAL_MS = 100

export function useRecorder() {
  const store = useAlarmStore()
  const { stopAlarm } = usePlayer()
  const toast = useToast()
  
  const mediaRecorder = ref(null)
  const recordedChunks = ref([])
  const recordingTimerInterval = ref(null)
  const recordingTimeout = ref(null)
  const downloadUrl = ref('')
  const downloadFilename = ref('')
  const showDownload = ref(false)
  const recordedBlob = ref(null)
  const streamDest = ref(null)

  function getRecordingOptions(format) {
    // Format-specific options
    const formatOptions = {
      'webm-opus': {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 320000
      },
      'ogg-opus': {
        mimeType: 'audio/ogg;codecs=opus',
        audioBitsPerSecond: 320000
      },
      'wav': {
        mimeType: 'audio/wav',
        audioBitsPerSecond: 1411200
      }
    }

    // If specific format requested, check if supported
    if (format && format !== 'auto' && formatOptions[format]) {
      const requested = formatOptions[format]
      if (MediaRecorder.isTypeSupported(requested.mimeType)) {
        return requested
      }
      console.warn(`Format ${format} not supported, falling back to auto`)
    }

    // Auto: find best supported format
    if (MediaRecorder.isTypeSupported('audio/wav')) {
      return { mimeType: 'audio/wav', audioBitsPerSecond: 1411200 }
    } else if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
      return { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 320000 }
    } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
      return { mimeType: 'audio/ogg;codecs=opus', audioBitsPerSecond: 320000 }
    } else if (MediaRecorder.isTypeSupported('audio/webm')) {
      return { mimeType: 'audio/webm', audioBitsPerSecond: 256000 }
    } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
      return { mimeType: 'audio/mp4', audioBitsPerSecond: 256000 }
    }
    return {}
  }

  function startRecording(durationMs, format = 'auto') {
    if (!store.audioCtx || !store.finalOutputNode) {
      toast.warning('toast_rec_no_alarm')
      return false
    }

    if (!durationMs || durationMs <= 0) {
      toast.warning('toast_rec_no_duration')
      return false
    }

    try {
      // Reset
      recordedChunks.value = []
      showDownload.value = false
      store.isRecording = true
      store.remainingTime = durationMs

      // Disconnect previous stream destination if still connected
      if (streamDest.value) {
        try { store.finalOutputNode.disconnect(streamDest.value) } catch {}
      }

      // Create MediaStream from final output (after filter, delay, reverb)
      const dest = store.audioCtx.createMediaStreamDestination()
      store.finalOutputNode.connect(dest)
      streamDest.value = dest

      // Get recording options based on selected format
      const options = getRecordingOptions(format)

      // Create MediaRecorder
      mediaRecorder.value = new MediaRecorder(dest.stream, options)

      // Event handlers
      mediaRecorder.value.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunks.value.push(e.data)
        }
      }

      mediaRecorder.value.onstop = () => {
        createDownloadURL()
        store.isRecording = false
        toast.success('toast_rec_complete')

        // Auto-stop player when recording finishes
        stopAlarm()
      }

      mediaRecorder.value.onerror = (event) => {
        handleRecordingError(event.error || new Error('MediaRecorder error'))
      }

      // Start recording
      const chunkInterval = mediaRecorder.value.mimeType === 'audio/wav'
        ? WAV_CHUNK_INTERVAL_MS
        : DEFAULT_CHUNK_INTERVAL_MS
      mediaRecorder.value.start(chunkInterval)

      // Start timer
      startRecordingTimer(durationMs)

      return true
    } catch (error) {
      toast.error('toast_rec_start_error')
      store.isRecording = false
      return false
    }
  }

  function stopRecording() {
    if (mediaRecorder.value && mediaRecorder.value.state === 'recording') {
      mediaRecorder.value.stop()
    }

    // Disconnect the stream destination from the output node
    if (streamDest.value && store.finalOutputNode) {
      try { store.finalOutputNode.disconnect(streamDest.value) } catch {}
      streamDest.value = null
    }

    clearRecordingTimers()
    store.isRecording = false
    store.remainingTime = 0
  }

  function startRecordingTimer(durationMs) {
    const startTime = Date.now()
    const endTime = startTime + durationMs

    recordingTimerInterval.value = setInterval(() => {
      const now = Date.now()
      const remainingMs = endTime - now

      if (remainingMs <= 0) {
        store.remainingTime = 0
        // Interval stoppen
        if (recordingTimerInterval.value) {
          clearInterval(recordingTimerInterval.value)
          recordingTimerInterval.value = null
        }
        return
      }

      store.remainingTime = remainingMs
    }, TIMER_INTERVAL_MS)

    recordingTimeout.value = setTimeout(() => {
      // Aufnahme stoppen
      if (mediaRecorder.value && mediaRecorder.value.state === 'recording') {
        mediaRecorder.value.stop()
      }
      
      // Alle Timer clearen
      clearRecordingTimers()
      
      // State aktualisieren
      store.isRecording = false
      store.remainingTime = 0
    }, durationMs)
  }

  function clearRecordingTimers() {
    if (recordingTimeout.value) {
      clearTimeout(recordingTimeout.value)
      recordingTimeout.value = null
    }

    if (recordingTimerInterval.value) {
      clearInterval(recordingTimerInterval.value)
      recordingTimerInterval.value = null
    }
  }

  function createDownloadURL() {
    try {
      if (!mediaRecorder.value || recordedChunks.value.length === 0) {
        return
      }

      // Revoke previous blob URL to prevent memory leak
      if (downloadUrl.value) {
        URL.revokeObjectURL(downloadUrl.value)
        downloadUrl.value = ''
      }

      const blob = new Blob(recordedChunks.value, { type: mediaRecorder.value.mimeType })
      recordedBlob.value = blob
      recordedChunks.value = []

      // Determine file extension and quality info
      let extension = 'webm'
      let qualityInfo = ''

      if (mediaRecorder.value.mimeType.includes('opus')) {
        extension = mediaRecorder.value.mimeType.includes('ogg') ? 'ogg' : 'webm'
        qualityInfo = ' (Opus HQ)'
      } else if (mediaRecorder.value.mimeType.includes('ogg')) {
        extension = 'ogg'
        qualityInfo = ' (OGG)'
      } else if (mediaRecorder.value.mimeType.includes('mp4')) {
        extension = 'mp4'
        qualityInfo = ' (MP4)'
      } else if (mediaRecorder.value.mimeType.includes('wav')) {
        extension = 'wav'
        qualityInfo = ' (WAV)'
      }

      // Create filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
      downloadFilename.value = `alarm_recording_${timestamp}_HQ.${extension}`
      downloadUrl.value = URL.createObjectURL(blob)
      showDownload.value = true

    } catch (error) {
      toast.error('toast_rec_file_error')
    }
  }

  function handleRecordingError(error) {
    stopRecording()

    if (error.name === 'NotSupportedError') {
      toast.error('toast_rec_error_not_supported')
    } else if (error.name === 'SecurityError') {
      toast.error('toast_rec_error_security')
    } else if (error.name === 'InvalidStateError') {
      toast.error('toast_rec_error_invalid_state')
    } else {
      toast.error('toast_rec_error_generic')
    }
  }

  function formatTime(ms) {
    const seconds = Math.floor((ms / 1000) % 60)
    const minutes = Math.floor((ms / (1000 * 60)) % 60)
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  function resetDownload() {
    if (downloadUrl.value) {
      URL.revokeObjectURL(downloadUrl.value)
    }
    downloadUrl.value = ''
    downloadFilename.value = ''
    showDownload.value = false
    recordedBlob.value = null
  }

  function cleanup() {
    stopRecording()
    if (mediaRecorder.value) {
      mediaRecorder.value = null
    }
    recordedChunks.value = []
    resetDownload()
  }

  return {
    startRecording,
    stopRecording,
    formatTime,
    resetDownload,
    cleanup,
    downloadUrl,
    downloadFilename,
    showDownload,
    recordedBlob
  }
}
