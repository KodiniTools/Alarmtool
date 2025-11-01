import { ref } from 'vue'
import { useAlarmStore } from '@/stores/alarmStore'

export function useRecorder() {
  const store = useAlarmStore()
  
  const mediaRecorder = ref(null)
  const recordedChunks = ref([])
  const recordingTimerInterval = ref(null)
  const recordingTimeout = ref(null)
  const downloadUrl = ref('')
  const downloadFilename = ref('')
  const showDownload = ref(false)

  function startRecording(durationMs) {
    if (!store.audioCtx || !store.masterGainNode) {
      alert('Bitte starte zuerst den Alarm!')
      return false
    }

    if (!durationMs || durationMs <= 0) {
      alert('Bitte wähle eine gültige Aufnahmedauer.')
      return false
    }

    try {
      // Reset
      recordedChunks.value = []
      showDownload.value = false
      store.isRecording = true
      store.remainingTime = durationMs

      // Create MediaStream from audio context
      const dest = store.audioCtx.createMediaStreamDestination()
      store.masterGainNode.connect(dest)

      // Determine best codec
      let options = {}
      if (MediaRecorder.isTypeSupported('audio/wav')) {
        options = {
          mimeType: 'audio/wav',
          audioBitsPerSecond: 1411200 // CD quality
        }
      } else if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        options = {
          mimeType: 'audio/webm;codecs=opus',
          audioBitsPerSecond: 320000
        }
      } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
        options = {
          mimeType: 'audio/ogg;codecs=opus',
          audioBitsPerSecond: 320000
        }
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        options = {
          mimeType: 'audio/webm',
          audioBitsPerSecond: 256000
        }
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        options = {
          mimeType: 'audio/mp4',
          audioBitsPerSecond: 256000
        }
      }

      // Create MediaRecorder
      mediaRecorder.value = new MediaRecorder(dest.stream, options)

      console.log(`Recording with: ${mediaRecorder.value.mimeType}, Bitrate: ${options.audioBitsPerSecond || 'Standard'}`)

      // Event handlers
      mediaRecorder.value.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunks.value.push(e.data)
          console.log(`Data chunk received: ${e.data.size} bytes`)
        }
      }

      mediaRecorder.value.onstop = () => {
        console.log('MediaRecorder onstop event fired')
        console.log(`Recorded chunks: ${recordedChunks.value.length}`)
        createDownloadURL()
        store.isRecording = false
        console.log('Recording stopped and download URL created')
      }

      mediaRecorder.value.onerror = (event) => {
        handleRecordingError(event.error || new Error('MediaRecorder error'))
      }

      // Start recording
      const chunkSize = mediaRecorder.value.mimeType === 'audio/wav' ? 2000 : 1000
      mediaRecorder.value.start(chunkSize)

      // Start timer
      startRecordingTimer(durationMs)

      return true
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Fehler beim Starten der Aufnahme: ' + error.message)
      store.isRecording = false
      return false
    }
  }

  function stopRecording() {
    if (mediaRecorder.value && mediaRecorder.value.state === 'recording') {
      mediaRecorder.value.stop()
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
    }, 100)

    recordingTimeout.value = setTimeout(() => {
      console.log('Recording timeout reached - stopping recording')
      
      // Aufnahme stoppen
      if (mediaRecorder.value && mediaRecorder.value.state === 'recording') {
        mediaRecorder.value.stop()
        console.log('MediaRecorder stopped')
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
      console.log('createDownloadURL called')
      console.log('mediaRecorder:', mediaRecorder.value)
      console.log('recordedChunks length:', recordedChunks.value.length)
      
      if (!mediaRecorder.value || recordedChunks.value.length === 0) {
        console.warn('No mediaRecorder or no recorded chunks!')
        return
      }

      const blob = new Blob(recordedChunks.value, { type: mediaRecorder.value.mimeType })
      console.log('Blob created:', blob.size, 'bytes, type:', blob.type)
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

      const fileSizeMB = (blob.size / (1024 * 1024)).toFixed(1)
      console.log(`✅ Recording created: ${downloadFilename.value}, Size: ${fileSizeMB} MB`)
      console.log('showDownload set to:', showDownload.value)
    } catch (error) {
      console.error('Error creating download URL:', error)
      alert('Fehler beim Erstellen der Aufnahme-Datei.')
    }
  }

  function handleRecordingError(error) {
    console.error('Recording error:', error)
    stopRecording()

    let errorMessage = 'Unbekannter Fehler beim Aufnehmen.'

    if (error.name === 'NotSupportedError') {
      errorMessage = 'Ihr Browser unterstützt diese Aufnahmefunktion nicht.'
    } else if (error.name === 'SecurityError') {
      errorMessage = 'Sicherheitsfehler: Aufnahme nicht erlaubt.'
    } else if (error.name === 'InvalidStateError') {
      errorMessage = 'Aufnahme ist in einem ungültigen Zustand.'
    } else if (error.message) {
      errorMessage = error.message
    }

    alert(`Aufnahme-Fehler: ${errorMessage}`)
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
    showDownload
  }
}
