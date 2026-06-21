import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

function makeOscillator(i) {
  return {
    id: i,
    enabled: i < 3,
    oscillator: null,
    gainNode: null,
    panNode: null,
    patternTimeoutId: null,
    patternSteps: [1500, 300],
    patternIndex: 0,
    toneIsOn: false,
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

  const activeOscillators = computed(() => oscillators.value.filter((o) => o.oscillator !== null))
  const enabledOscillators = computed(() => oscillators.value.filter((o) => o.enabled))

  function updateOscillator(id, patch) {
    const osc = oscillators.value[id]
    if (osc) Object.assign(osc, patch)
  }

  function resetOscillators() {
    oscillators.value.forEach((osc) => {
      if (osc.oscillator) {
        try {
          osc.oscillator.stop()
          osc.oscillator.disconnect()
        } catch (_e) {
          /* ignore — node may already be disconnected */
        }
        osc.oscillator = null
        osc.gainNode = null
        osc.panNode = null
      }
      if (osc.patternTimeoutId) {
        clearTimeout(osc.patternTimeoutId)
        osc.patternTimeoutId = null
      }
    })
  }

  return {
    oscillators,
    oscClipboard,
    activeOscillators,
    enabledOscillators,
    updateOscillator,
    resetOscillators,
  }
})
