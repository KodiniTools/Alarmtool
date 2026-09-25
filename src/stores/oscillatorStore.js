import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  DEFAULT_ENABLED_COUNT,
  DEFAULT_OSCILLATOR,
  OSCILLATOR_COUNT,
} from '@/lib/oscillatorDefaults'

function makeOscillator(i) {
  return {
    id: i,
    enabled: i < DEFAULT_ENABLED_COUNT,
    ...DEFAULT_OSCILLATOR,
  }
}

export const useOscillatorStore = defineStore('oscillators', () => {
  const oscillators = ref(Array.from({ length: OSCILLATOR_COUNT }, (_, i) => makeOscillator(i)))
  const oscClipboard = ref(null)

  function updateOscillator(id, patch) {
    const osc = oscillators.value[id]
    if (osc) Object.assign(osc, patch)
  }

  return {
    oscillators,
    oscClipboard,
    updateOscillator,
  }
})
