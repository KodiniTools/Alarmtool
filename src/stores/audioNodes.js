// Plain module — Web Audio API objects are not reactive.
// Components never read these directly; only composables do.
const nodes = {
  audioCtx: null,
  masterGainNode: null,
  filterNode: null,
  delayNode: null,
  convolverNode: null,
  reverbGain: null,
  effectsOut: null,
  finalOutputNode: null,
}

export function useAudioNodes() {
  return nodes
}
