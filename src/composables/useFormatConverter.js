import { ref } from 'vue'
import { Mp3Encoder } from '@/lib/lamejs.js'
import { useToast } from './useToast'

export function useFormatConverter() {
  const toast = useToast()

  const isConverting = ref(false)
  const conversionProgress = ref(0)
  const convertedUrl = ref('')
  const convertedFilename = ref('')

  /**
   * Decode an audio Blob to an AudioBuffer using OfflineAudioContext
   */
  async function decodeBlob(blob) {
    const arrayBuffer = await blob.arrayBuffer()
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    try {
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)
      return audioBuffer
    } finally {
      await audioCtx.close()
    }
  }

  /**
   * Encode AudioBuffer to WAV format (PCM 16-bit)
   */
  function encodeWav(audioBuffer) {
    const numChannels = audioBuffer.numberOfChannels
    const sampleRate = audioBuffer.sampleRate
    const format = 1 // PCM
    const bitsPerSample = 16

    // Interleave channels
    const channels = []
    for (let i = 0; i < numChannels; i++) {
      channels.push(audioBuffer.getChannelData(i))
    }

    const length = channels[0].length
    const interleaved = new Float32Array(length * numChannels)

    for (let i = 0; i < length; i++) {
      for (let ch = 0; ch < numChannels; ch++) {
        interleaved[i * numChannels + ch] = channels[ch][i]
      }
    }

    // Create WAV file
    const dataLength = interleaved.length * (bitsPerSample / 8)
    const buffer = new ArrayBuffer(44 + dataLength)
    const view = new DataView(buffer)

    // RIFF header
    writeString(view, 0, 'RIFF')
    view.setUint32(4, 36 + dataLength, true)
    writeString(view, 8, 'WAVE')

    // fmt chunk
    writeString(view, 12, 'fmt ')
    view.setUint32(16, 16, true) // chunk size
    view.setUint16(20, format, true)
    view.setUint16(22, numChannels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true)
    view.setUint16(32, numChannels * (bitsPerSample / 8), true)
    view.setUint16(34, bitsPerSample, true)

    // data chunk
    writeString(view, 36, 'data')
    view.setUint32(40, dataLength, true)

    // Write PCM samples
    let offset = 44
    for (let i = 0; i < interleaved.length; i++) {
      const sample = Math.max(-1, Math.min(1, interleaved[i]))
      const val = sample < 0 ? sample * 0x8000 : sample * 0x7FFF
      view.setInt16(offset, val, true)
      offset += 2
    }

    return new Blob([buffer], { type: 'audio/wav' })
  }

  function writeString(view, offset, str) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i))
    }
  }

  /**
   * Encode AudioBuffer to MP3 format using lamejs
   */
  async function encodeMp3(audioBuffer) {
    const numChannels = audioBuffer.numberOfChannels
    const sampleRate = audioBuffer.sampleRate
    const kbps = 192

    const encoder = new Mp3Encoder(numChannels, sampleRate, kbps)

    // Get channel data as Int16
    const left = floatTo16BitPCM(audioBuffer.getChannelData(0))
    const right = numChannels > 1
      ? floatTo16BitPCM(audioBuffer.getChannelData(1))
      : left

    const mp3Data = []
    const blockSize = 1152

    const totalBlocks = Math.ceil(left.length / blockSize)
    let processedBlocks = 0

    for (let i = 0; i < left.length; i += blockSize) {
      const leftChunk = left.subarray(i, i + blockSize)
      const rightChunk = right.subarray(i, i + blockSize)

      let mp3buf
      if (numChannels === 1) {
        mp3buf = encoder.encodeBuffer(leftChunk)
      } else {
        mp3buf = encoder.encodeBuffer(leftChunk, rightChunk)
      }

      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf)
      }

      processedBlocks++
      conversionProgress.value = Math.round((processedBlocks / totalBlocks) * 100)

      // Yield to UI thread every 100 blocks
      if (processedBlocks % 100 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0))
      }
    }

    const end = encoder.flush()
    if (end.length > 0) {
      mp3Data.push(end)
    }

    return new Blob(mp3Data, { type: 'audio/mpeg' })
  }

  function floatTo16BitPCM(float32Array) {
    const int16 = new Int16Array(float32Array.length)
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]))
      int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
    }
    return int16
  }

  /**
   * Convert a recorded audio Blob to the target format
   * @param {Blob} sourceBlob - The original recorded blob
   * @param {string} targetFormat - 'wav' or 'mp3'
   * @param {string} baseFilename - Base filename without extension
   * @returns {Promise<{url: string, filename: string}>}
   */
  async function convertBlob(sourceBlob, targetFormat, baseFilename) {
    isConverting.value = true
    conversionProgress.value = 0

    try {
      // Step 1: Decode source to AudioBuffer
      conversionProgress.value = 10
      const audioBuffer = await decodeBlob(sourceBlob)

      // Step 2: Encode to target format
      let resultBlob
      let extension

      if (targetFormat === 'wav') {
        conversionProgress.value = 30
        resultBlob = encodeWav(audioBuffer)
        conversionProgress.value = 100
        extension = 'wav'
      } else if (targetFormat === 'mp3') {
        conversionProgress.value = 20
        resultBlob = await encodeMp3(audioBuffer)
        extension = 'mp3'
      } else {
        throw new Error(`Unsupported target format: ${targetFormat}`)
      }

      // Step 3: Create download URL
      const filename = baseFilename.replace(/\.[^.]+$/, '') + '.' + extension
      const url = URL.createObjectURL(resultBlob)

      convertedUrl.value = url
      convertedFilename.value = filename

      const sizeMB = (resultBlob.size / (1024 * 1024)).toFixed(1)
      console.log(`Converted to ${targetFormat.toUpperCase()}: ${filename}, Size: ${sizeMB} MB`)

      toast.success('toast_convert_complete')
      return { url, filename }
    } catch (error) {
      console.error('Conversion error:', error)
      toast.error('toast_convert_error')
      throw error
    } finally {
      isConverting.value = false
    }
  }

  function resetConversion() {
    if (convertedUrl.value) {
      URL.revokeObjectURL(convertedUrl.value)
    }
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
    resetConversion
  }
}
