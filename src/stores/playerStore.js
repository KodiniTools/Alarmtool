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

  return { isAlarmRunning, isPlaying, isPaused, currentTime, volume, isMuted, isLooping }
})
