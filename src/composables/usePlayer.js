import { ref } from 'vue'
import { useAlarmStore } from '@/stores/alarmStore'
import { useAudioContext } from './useAudioContext'
import { useOscillators } from './useOscillators'

export function usePlayer() {
  const store = useAlarmStore()
  const { initAudioContext, closeAudioContext } = useAudioContext()
  const { createOscillators, runOscPattern, stopOscillators } = useOscillators()
  
  const playbackTimer = ref(null)

  function startAlarm() {
    if (store.isPlaying) return

    try {
      store.isPlaying = true
      store.isPaused = false
      store.isAlarmRunning = true
      store.currentTime = 0

      // Initialize audio context
      initAudioContext()

      // Set volume
      if (store.masterGainNode && store.audioCtx) {
        const targetVolume = store.isMuted ? 0 : store.volume
        store.masterGainNode.gain.setValueAtTime(
          targetVolume,
          store.audioCtx.currentTime
        )
      }

      // Create and start oscillators
      createOscillators()
      
      // Start patterns
      store.oscillators.forEach((_, index) => {
        runOscPattern(index)
      })

      // Start playback timer
      startPlaybackTimer()

      console.log('Alarm started')
    } catch (error) {
      console.error('Error starting alarm:', error)
      store.isPlaying = false
      store.isAlarmRunning = false
    }
  }

  function pauseAlarm() {
    if (!store.isPlaying || store.isPaused) return

    store.isPaused = true

    // Pause audio by reducing gain
    if (store.masterGainNode && store.audioCtx) {
      store.masterGainNode.gain.setValueAtTime(0, store.audioCtx.currentTime)
    }

    // Pause timer
    if (playbackTimer.value) {
      clearInterval(playbackTimer.value)
      playbackTimer.value = null
    }

    console.log('Alarm paused')
  }

  function resumeAlarm() {
    if (!store.isPlaying || !store.isPaused) return

    store.isPaused = false

    // Resume audio by restoring gain
    if (store.masterGainNode && store.audioCtx) {
      const targetVolume = store.isMuted ? 0 : store.volume
      store.masterGainNode.gain.setValueAtTime(
        targetVolume,
        store.audioCtx.currentTime
      )
    }

    // Resume timer
    startPlaybackTimer()

    console.log('Alarm resumed')
  }

  function stopAlarm() {
    if (!store.isPlaying) return

    store.isPlaying = false
    store.isPaused = false
    store.isAlarmRunning = false
    store.currentTime = 0

    // Stop timer
    if (playbackTimer.value) {
      clearInterval(playbackTimer.value)
      playbackTimer.value = null
    }

    // Stop oscillators
    stopOscillators()

    // Close audio context after delay
    setTimeout(() => {
      closeAudioContext()
    }, 2000)

    console.log('Alarm stopped')
  }

  function startPlaybackTimer() {
    if (playbackTimer.value) {
      clearInterval(playbackTimer.value)
    }

    playbackTimer.value = setInterval(() => {
      if (store.isPlaying && !store.isPaused) {
        store.currentTime += 100

        // Loop functionality (optional, after 5 minutes)
        if (store.isLooping && store.currentTime >= 300000) {
          store.currentTime = 0
        }
      }
    }, 100)
  }

  function updateVolume(value) {
    store.volume = value

    if (store.masterGainNode && store.audioCtx && store.isPlaying && !store.isPaused && !store.isMuted) {
      store.masterGainNode.gain.setValueAtTime(value, store.audioCtx.currentTime)
    }
  }

  function toggleMute() {
    store.isMuted = !store.isMuted

    if (store.masterGainNode && store.audioCtx && store.isPlaying && !store.isPaused) {
      const targetVolume = store.isMuted ? 0 : store.volume
      store.masterGainNode.gain.setValueAtTime(targetVolume, store.audioCtx.currentTime)
    }
  }

  function toggleLoop() {
    store.isLooping = !store.isLooping
  }

  function formatTime(ms) {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  // Keyboard shortcuts
  function handleKeyboard(event) {
    // Only if no input element is focused
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      return
    }

    switch (event.code) {
      case 'Space':
        event.preventDefault()
        if (store.isPlaying && !store.isPaused) {
          pauseAlarm()
        } else {
          store.isPaused ? resumeAlarm() : startAlarm()
        }
        break
      case 'Escape':
        event.preventDefault()
        stopAlarm()
        break
      case 'KeyM':
        event.preventDefault()
        toggleMute()
        break
      case 'KeyL':
        event.preventDefault()
        toggleLoop()
        break
    }
  }

  return {
    startAlarm,
    pauseAlarm,
    resumeAlarm,
    stopAlarm,
    updateVolume,
    toggleMute,
    toggleLoop,
    formatTime,
    handleKeyboard
  }
}
