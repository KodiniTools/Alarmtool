import { ref } from 'vue'
import { useAlarmStore } from '@/stores/alarmStore'
import { usePlayer } from './usePlayer'
import { useToast } from './useToast'
import { useRecordingTimer } from './useRecordingTimer'
import { useRecordingDownload } from './useRecordingDownload'
import { getRecordingOptions, connectStream, disconnectStream } from './useRecordingStream'

export function useRecorder() {
  const store = useAlarmStore()
  const { stopAlarm } = usePlayer()
  const toast = useToast()
  const timer = useRecordingTimer()
  const download = useRecordingDownload()

  const mediaRecorder = ref(null)
  const recordedChunks = ref([])
  const streamDest = ref(null)
  const monoMixNode = ref(null)

  function startRecording(durationMs, format = 'auto', mono = false) {
    if (!store.audioCtx || !store.finalOutputNode) {
      toast.warning('toast_rec_no_alarm')
      return false
    }
    if (!durationMs || durationMs <= 0) {
      toast.warning('toast_rec_no_duration')
      return false
    }

    try {
      recordedChunks.value = []
      download.showDownload.value = false
      store.isRecording = true
      store.remainingTime = durationMs

      // Disconnect any previous stream
      disconnectStream(store.finalOutputNode, streamDest.value, monoMixNode.value)

      const { dest, monoMixNode: mixNode } = connectStream(
        store.audioCtx,
        store.finalOutputNode,
        mono
      )
      streamDest.value = dest
      monoMixNode.value = mixNode

      const options = getRecordingOptions(format)
      mediaRecorder.value = new MediaRecorder(dest.stream, options)

      mediaRecorder.value.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.value.push(e.data)
      }

      mediaRecorder.value.onstop = () => {
        download.create(mediaRecorder.value.mimeType, recordedChunks.value)
        recordedChunks.value = []
        store.isRecording = false
        toast.success('toast_rec_complete')
        stopAlarm()
      }

      mediaRecorder.value.onerror = (event) => {
        handleError(event.error || new Error('MediaRecorder error'))
      }

      const chunkInterval = mediaRecorder.value.mimeType === 'audio/wav' ? 2000 : 1000
      mediaRecorder.value.start(chunkInterval)

      timer.start(durationMs, () => {
        if (mediaRecorder.value?.state === 'recording') mediaRecorder.value.stop()
      })

      return true
    } catch (_error) {
      toast.error('toast_rec_start_error')
      store.isRecording = false
      return false
    }
  }

  function stopRecording() {
    if (mediaRecorder.value?.state === 'recording') mediaRecorder.value.stop()
    disconnectStream(store.finalOutputNode, streamDest.value, monoMixNode.value)
    streamDest.value = null
    monoMixNode.value = null
    timer.clear()
    store.isRecording = false
    store.remainingTime = 0
  }

  function handleError(error) {
    stopRecording()
    const key =
      error.name === 'NotSupportedError'
        ? 'toast_rec_error_not_supported'
        : error.name === 'SecurityError'
          ? 'toast_rec_error_security'
          : error.name === 'InvalidStateError'
            ? 'toast_rec_error_invalid_state'
            : 'toast_rec_error_generic'
    toast.error(key)
  }

  function cleanup() {
    stopRecording()
    mediaRecorder.value = null
    recordedChunks.value = []
    download.reset()
  }

  return {
    startRecording,
    stopRecording,
    cleanup,
    formatTime: download.formatTime,
    resetDownload: download.reset,
    downloadUrl: download.downloadUrl,
    downloadFilename: download.downloadFilename,
    showDownload: download.showDownload,
    recordedBlob: download.recordedBlob,
  }
}
