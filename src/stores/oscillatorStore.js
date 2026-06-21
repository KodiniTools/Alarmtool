import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

function makeOscillator(i) {
  return {
    id: i,
    enabled: i < 3,
    waveType: 'sine',
    frequency: 440,
    volume: 0.5,
    pan: 0,
    attack: 20,
    decay: 50,
    sustain: 0.8,
    release: 80,
    pattern: '1500,300',
  }
}

export const useOscillatorStore = defineStore('oscillators', () => {
  const oscillators = ref(Array.from({ length: 12 }, (_, i) => makeOscillator(i)))
  const oscClipboard = ref(null)

  const enabledOscillators = computed(() => oscillators.value.filter((o) => o.enabled))

  function updateOscillator(id, patch) {
    const osc = oscillators.value[id]
    if (osc) Object.assign(osc, patch)
  }

  function resetOscillators() {
    // Audio node cleanup is handled by useOscillatorLifecycle / useOscillatorRuntime
  }

  return {
    oscillators,
    oscClipboard,
    enabledOscillators,
    updateOscillator,
    resetOscillators,
  }
})
