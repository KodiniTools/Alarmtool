import { ref } from 'vue'
import { useToast } from './useToast'

const EXTENSION_MAP = [
  { test: (m) => m.includes('wav'), ext: 'wav' },
  { test: (m) => m.includes('opus') && m.includes('ogg'), ext: 'ogg' },
  { test: (m) => m.includes('opus'), ext: 'webm' },
  { test: (m) => m.includes('ogg'), ext: 'ogg' },
  { test: (m) => m.includes('mp4'), ext: 'mp4' },
]

function mimeToExtension(mimeType) {
  return EXTENSION_MAP.find((e) => e.test(mimeType))?.ext ?? 'webm'
}

export function useRecordingDownload() {
  const toast = useToast()
  const downloadUrl = ref('')
  const downloadFilename = ref('')
  const showDownload = ref(false)
  const recordedBlob = ref(null)

  function create(mimeType, chunks) {
    try {
      if (!chunks.length) return

      if (downloadUrl.value) {
        URL.revokeObjectURL(downloadUrl.value)
        downloadUrl.value = ''
      }

      const blob = new Blob(chunks, { type: mimeType })
      recordedBlob.value = blob

      const ext = mimeToExtension(mimeType)
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
      downloadFilename.value = `alarm_recording_${timestamp}_HQ.${ext}`
      downloadUrl.value = URL.createObjectURL(blob)
      showDownload.value = true
    } catch (_error) {
      toast.error('toast_rec_file_error')
    }
  }

  function reset() {
    if (downloadUrl.value) URL.revokeObjectURL(downloadUrl.value)
    downloadUrl.value = ''
    downloadFilename.value = ''
    showDownload.value = false
    recordedBlob.value = null
  }

  function formatTime(ms) {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  return { downloadUrl, downloadFilename, showDownload, recordedBlob, create, reset, formatTime }
}
