// shallowRef tracks reference changes (null → AudioContext) without
// deep-proxying Web Audio API internals. No component reads these —
// only composables do — but the facade store needs reactive refs so
// that computed setters don't cache stale null values.
import { shallowRef } from 'vue'

export const audioNodeRefs = {
  audioCtx: shallowRef(null),
  masterGainNode: shallowRef(null),
  filterNode: shallowRef(null),
  delayNode: shallowRef(null),
  convolverNode: shallowRef(null),
  reverbGain: shallowRef(null),
  effectsOut: shallowRef(null),
  finalOutputNode: shallowRef(null),
}

export function useAudioNodes() {
  return audioNodeRefs
}
