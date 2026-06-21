import { ref } from 'vue'
import { useToast } from './useToast'
import { decodeBlob, downmixToMono, encodeWav, encodeMp3 } from './audioEncoding'

export function useFormatConverter() {
  const toast = useToast()
  const isConverting = ref(false)
  const conversionProgress = ref(0)
  const convertedUrl = ref('')
  const convertedFilename = ref('')

  async function convertBlob(sourceBlob, targetFormat, baseFilename, mono = false) {
    isConverting.value = true
    conversionProgress.value = 10

    try {
      let audioBuffer = await decodeBlob(sourceBlob)
      if (mono) audioBuffer = downmixToMono(audioBuffer)

      let resultBlob
      let extension

      if (targetFormat === 'wav') {
        conversionProgress.value = 30
        resultBlob = encodeWav(audioBuffer)
        conversionProgress.value = 100
        extension = 'wav'
      } else if (targetFormat === 'mp3') {
        conversionProgress.value = 20
        resultBlob = await encodeMp3(audioBuffer, (p) => {
          conversionProgress.value = 20 + Math.round(p * 0.8)
        })
        extension = 'mp3'
      } else {
        throw new Error(`Unsupported target format: ${targetFormat}`)
      }

      const filename = baseFilename.replace(/\.[^.]+$/, '') + '.' + extension
      const url = URL.createObjectURL(resultBlob)
      convertedUrl.value = url
      convertedFilename.value = filename

      toast.success('toast_convert_complete')
      return { url, filename }
    } catch (error) {
      toast.error('toast_convert_error')
      throw error
    } finally {
      isConverting.value = false
    }
  }

  function resetConversion() {
    if (convertedUrl.value) URL.revokeObjectURL(convertedUrl.value)
    convertedUrl.value = ''
    convertedFilename.value = ''
    conversionProgress.value = 0
  }

  return {
    isConverting,
    conversionProgress,
    convertedUrl,
    convertedFilename,
    convertBlob,
    resetConversion,
  }
}
