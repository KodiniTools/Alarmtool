// shallowRef tracks reference changes (null → AudioContext) without
// deep-proxying Web Audio API internals. No component reads these —
// only composables do — but the facade store needs reactive refs so
// that computed setters don't cache stale null values.
import { shallowRef, type ShallowRef } from 'vue'

export const audioNodeRefs = {
  audioCtx: shallowRef<AudioContext | null>(null),
  masterGainNode: shallowRef<GainNode | null>(null),
  filterNode: shallowRef<BiquadFilterNode | null>(null),
  delayNode: shallowRef<DelayNode | null>(null),
  convolverNode: shallowRef<ConvolverNode | null>(null),
  reverbGain: shallowRef<GainNode | null>(null),
  effectsOut: shallowRef<GainNode | null>(null),
  finalOutputNode: shallowRef<GainNode | null>(null),
} satisfies Record<string, ShallowRef<unknown>>

export function useAudioNodes() {
  return audioNodeRefs
}
