import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  DEFAULT_ENABLED_COUNT,
  DEFAULT_OSCILLATOR,
  OSCILLATOR_COUNT,
  type OscParams,
} from '@/lib/oscillatorDefaults'

/** One oscillator slot: its index, on/off state and sound parameters. */
export interface Oscillator extends OscParams {
  id: number
  enabled: boolean
}

function makeOscillator(i: number): Oscillator {
  return {
    id: i,
    enabled: i < DEFAULT_ENABLED_COUNT,
    ...DEFAULT_OSCILLATOR,
  }
}

export const useOscillatorStore = defineStore('oscillators', () => {
  const oscillators = ref<Oscillator[]>(
    Array.from({ length: OSCILLATOR_COUNT }, (_, i) => makeOscillator(i))
  )
  const oscClipboard = ref<OscParams | null>(null)

  function updateOscillator(id: number, patch: Partial<Oscillator>) {
    const osc = oscillators.value[id]
    if (osc) Object.assign(osc, patch)
  }

  return {
    oscillators,
    oscClipboard,
    updateOscillator,
  }
})
