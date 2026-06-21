// Pure audio encoding utilities — no Vue state, no composable lifecycle.

export async function decodeBlob(blob) {
  const arrayBuffer = await blob.arrayBuffer()
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  try {
    return await audioCtx.decodeAudioData(arrayBuffer)
  } finally {
    await audioCtx.close()
  }
}

export function downmixToMono(audioBuffer) {
  if (audioBuffer.numberOfChannels === 1) return audioBuffer

  const { sampleRate, length } = audioBuffer
  const monoBuffer = new OfflineAudioContext(1, length, sampleRate).createBuffer(
    1,
    length,
    sampleRate
  )
  const monoData = monoBuffer.getChannelData(0)
  const left = audioBuffer.getChannelData(0)
  const right = audioBuffer.getChannelData(1)

  for (let i = 0; i < length; i++) {
    monoData[i] = (left[i] + right[i]) * 0.5
  }
  return monoBuffer
}

export function floatTo16BitPCM(float32Array) {
  const int16 = new Int16Array(float32Array.length)
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]))
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff
  }
  return int16
}

export function encodeWav(audioBuffer) {
  const numChannels = audioBuffer.numberOfChannels
  const sampleRate = audioBuffer.sampleRate
  const bitsPerSample = 16

  const channels = Array.from({ length: numChannels }, (_, i) => audioBuffer.getChannelData(i))
  const length = channels[0].length
  const interleaved = new Float32Array(length * numChannels)

  for (let i = 0; i < length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      interleaved[i * numChannels + ch] = channels[ch][i]
    }
  }

  const dataLength = interleaved.length * 2 // 16-bit = 2 bytes
  const buffer = new ArrayBuffer(44 + dataLength)
  const view = new DataView(buffer)

  function writeStr(offset, str) {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
  }

  writeStr(0, 'RIFF')
  view.setUint32(4, 36 + dataLength, true)
  writeStr(8, 'WAVE')
  writeStr(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true) // PCM
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * numChannels * 2, true)
  view.setUint16(32, numChannels * 2, true)
  view.setUint16(34, bitsPerSample, true)
  writeStr(36, 'data')
  view.setUint32(40, dataLength, true)

  let offset = 44
  for (let i = 0; i < interleaved.length; i++) {
    const s = Math.max(-1, Math.min(1, interleaved[i]))
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
    offset += 2
  }

  return new Blob([buffer], { type: 'audio/wav' })
}

export async function encodeMp3(audioBuffer, onProgress) {
  const { Mp3Encoder } = await import('@/lib/lamejs.js')

  const numChannels = audioBuffer.numberOfChannels
  const sampleRate = audioBuffer.sampleRate
  const encoder = new Mp3Encoder(numChannels, sampleRate, 192)

  const left = floatTo16BitPCM(audioBuffer.getChannelData(0))
  const right = numChannels > 1 ? floatTo16BitPCM(audioBuffer.getChannelData(1)) : left
  const mp3Data = []
  const blockSize = 1152
  const totalBlocks = Math.ceil(left.length / blockSize)

  for (let i = 0; i < left.length; i += blockSize) {
    const lChunk = left.subarray(i, i + blockSize)
    const rChunk = right.subarray(i, i + blockSize)
    const buf =
      numChannels === 1 ? encoder.encodeBuffer(lChunk) : encoder.encodeBuffer(lChunk, rChunk)
    if (buf.length > 0) mp3Data.push(buf)

    const progress = Math.round(((i / blockSize + 1) / totalBlocks) * 100)
    onProgress?.(progress)

    if ((i / blockSize + 1) % 100 === 0) {
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
  }

  const end = encoder.flush()
  if (end.length > 0) mp3Data.push(end)

  return new Blob(mp3Data, { type: 'audio/mpeg' })
}
