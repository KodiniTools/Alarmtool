import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  const isAlarmRunning = ref(false)
  const isPlaying = ref(false)
  const isPaused = ref(false)
  const currentTime = ref(0)
  const volume = ref(0.8)
  const isMuted = ref(false)
  const isLooping = ref(false)
  // Translation key of the preset currently driving playback, or null for a
  // hand-tuned ("custom") sound. Shown in the sticky player's status bar.
  const activePresetKey = ref(null)

  return {
    isAlarmRunning,
    isPlaying,
    isPaused,
    currentTime,
    volume,
    isMuted,
    isLooping,
    activePresetKey,
  }
})
