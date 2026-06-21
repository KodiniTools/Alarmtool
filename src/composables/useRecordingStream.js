// Pure functions — no Vue state, no composable lifecycle.
// Handles MediaRecorder format negotiation and audio stream routing.

const FORMAT_OPTIONS = {
  'webm-opus': { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 320000 },
  'ogg-opus': { mimeType: 'audio/ogg;codecs=opus', audioBitsPerSecond: 320000 },
  wav: { mimeType: 'audio/wav', audioBitsPerSecond: 1411200 },
}

const AUTO_PRIORITY = [
  { mimeType: 'audio/wav', audioBitsPerSecond: 1411200 },
  { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 320000 },
  { mimeType: 'audio/ogg;codecs=opus', audioBitsPerSecond: 320000 },
  { mimeType: 'audio/webm', audioBitsPerSecond: 256000 },
  { mimeType: 'audio/mp4', audioBitsPerSecond: 256000 },
]

export function getRecordingOptions(format) {
  if (format && format !== 'auto' && FORMAT_OPTIONS[format]) {
    const requested = FORMAT_OPTIONS[format]
    if (MediaRecorder.isTypeSupported(requested.mimeType)) return requested
    console.warn(`Format ${format} not supported, falling back to auto`)
  }
  return AUTO_PRIORITY.find((o) => MediaRecorder.isTypeSupported(o.mimeType)) ?? {}
}

export function connectStream(audioCtx, finalOutputNode, mono) {
  const dest = audioCtx.createMediaStreamDestination()
  let monoMixNode = null

  if (mono) {
    const mixDown = audioCtx.createGain()
    mixDown.channelCount = 1
    mixDown.channelCountMode = 'explicit'
    mixDown.channelInterpretation = 'speakers'
    mixDown.gain.value = 1
    finalOutputNode.connect(mixDown)
    mixDown.connect(dest)
    monoMixNode = mixDown
  } else {
    finalOutputNode.connect(dest)
  }

  return { dest, monoMixNode }
}

export function disconnectStream(finalOutputNode, streamDest, monoMixNode) {
  if (monoMixNode) {
    try {
      finalOutputNode.disconnect(monoMixNode)
    } catch {
      /* ignore */
    }
    try {
      monoMixNode.disconnect()
    } catch {
      /* ignore */
    }
  } else if (streamDest && finalOutputNode) {
    try {
      finalOutputNode.disconnect(streamDest)
    } catch {
      /* ignore */
    }
  }
}
