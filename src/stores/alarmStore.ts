// Facade store — composes domain stores so all existing callers work unchanged.
// New code should import domain stores directly instead of this facade.
import { defineStore } from 'pinia'
import { computed, type WritableComputedRef } from 'vue'
import { useAudioNodes } from './audioNodes'
import { useOscillatorStore } from './oscillatorStore'
import { usePlayerStore } from './playerStore'
import { useRecorderStore } from './recorderStore'
import { useSettingsStore } from './settingsStore'

/** Writable computed that forwards `key` to the given domain store. */
function forward<T extends object, K extends keyof T>(
  source: T,
  key: K
): WritableComputedRef<T[K]> {
  return computed<T[K]>({
    get: () => source[key],
    set: (v) => {
      source[key] = v
    },
  })
}

function forwardAll<T extends object, K extends keyof T>(
  source: T,
  keys: K[]
): { [P in K]: WritableComputedRef<T[P]> } {
  return Object.fromEntries(keys.map((key) => [key, forward(source, key)])) as {
    [P in K]: WritableComputedRef<T[P]>
  }
}

export const useAlarmStore = defineStore('alarm', () => {
  const nodes = useAudioNodes()
  const osc = useOscillatorStore()
  const player = usePlayerStore()
  const recorder = useRecorderStore()
  const settings = useSettingsStore()

  return {
    // Audio nodes — shallowRefs from audioNodes.js track reference changes
    // (null ↔ AudioContext) without deep-proxying Web Audio internals. Returned
    // directly so Pinia auto-unwraps them; assignment updates .value.
    ...nodes,
    // Oscillators
    oscillators: computed(() => osc.oscillators),
    ...forwardAll(osc, ['oscClipboard']),
    updateOscillator: osc.updateOscillator,
    // Player
    ...forwardAll(player, [
      'isAlarmRunning',
      'isPlaying',
      'isPaused',
      'currentTime',
      'volume',
      'isMuted',
      'isLooping',
      'activePresetKey',
    ]),
    // Recorder
    ...forwardAll(recorder, ['isRecording', 'remainingTime']),
    // Settings
    currentLang: computed(() => settings.currentLang),
    currentTheme: computed(() => settings.currentTheme),
    filterSettings: computed(() => settings.filterSettings),
    setLanguage: settings.setLanguage,
    setTheme: settings.setTheme,
    updateFilterSettings: settings.updateFilterSettings,
  }
})
