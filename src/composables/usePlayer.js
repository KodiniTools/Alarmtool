import { ref } from 'vue'
import { useAlarmStore } from '@/stores/alarmStore'
import { useAudioContext } from './useAudioContext'
import { useOscillators } from './useOscillators'
import { useToast } from './useToast'
import { getOscRuntime, clearAllOscRuntime } from './useOscillatorRuntime'

const TIMER_INTERVAL_MS = 100
const LOOP_DURATION_MS = 300000 // 5 minutes
const AUDIO_CONTEXT_CLOSE_DELAY_MS = 2000

// Shared across every usePlayer() instance (sticky player, keyboard shortcuts,
// presets) so playback bookkeeping stays consistent no matter which component
// drives the transport.
const playbackTimer = ref(null)
const closeTimer = ref(null)

export function usePlayer() {
  const store = useAlarmStore()
  const { initAudioContext, closeAudioContext } = useAudioContext()
  const { createOscillators, runOscPattern, stopOscillators } = useOscillators()
  const toast = useToast()

  function startAlarm() {
    if (store.isPlaying) return

    // Cancel a pending context close scheduled by a recent stop, so a quick
    // restart isn't torn down mid-playback.
    if (closeTimer.value) {
      clearTimeout(closeTimer.value)
      closeTimer.value = null
    }

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
        store.masterGainNode.gain.setValueAtTime(targetVolume, store.audioCtx.currentTime)
      }

      // Create and start oscillators
      createOscillators()

      // Start patterns
      store.oscillators.forEach((_, index) => {
        runOscPattern(index)
      })

      // Start playback timer
      startPlaybackTimer()

      toast.success('toast_alarm_started')
    } catch (_error) {
      toast.error('toast_alarm_start_error')
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

    toast.info('toast_alarm_paused')
  }

  function resumeAlarm() {
    if (!store.isPlaying || !store.isPaused) return

    store.isPaused = false

    // Resume audio by restoring gain
    if (store.masterGainNode && store.audioCtx) {
      const targetVolume = store.isMuted ? 0 : store.volume
      store.masterGainNode.gain.setValueAtTime(targetVolume, store.audioCtx.currentTime)
    }

    // Resume timer
    startPlaybackTimer()

    toast.info('toast_alarm_resumed')
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

    // Close audio context after delay (allow release envelopes to finish).
    // Tracked so a quick restart (e.g. playing a preset) can cancel it.
    if (closeTimer.value) clearTimeout(closeTimer.value)
    closeTimer.value = setTimeout(() => {
      closeAudioContext()
      closeTimer.value = null
    }, AUDIO_CONTEXT_CLOSE_DELAY_MS)

    toast.info('toast_alarm_stopped')
  }

  // (Re)start playback with the current oscillator/filter config. When the
  // player is already running (e.g. switching presets) the oscillators are
  // swapped in place without tearing down the audio context, avoiding the
  // delayed cleanups that a full stop/start would leave running.
  function restartAlarm() {
    if (!store.isPlaying) {
      startAlarm()
      return
    }

    // Hard-stop the current oscillators immediately: no release tail and no
    // delayed runtime cleanup that would later wipe the nodes we recreate.
    store.oscillators.forEach((_osc, index) => {
      const rt = getOscRuntime(index)
      if (!rt) return
      if (rt.patternTimeoutId) clearTimeout(rt.patternTimeoutId)
      try {
        rt.osc?.stop()
        rt.osc?.disconnect()
        rt.gainNode?.disconnect()
        rt.panNode?.disconnect()
      } catch (_e) {
        // ignore — node already stopped/disconnected
      }
    })
    clearAllOscRuntime()

    store.currentTime = 0
    store.isPaused = false

    // Restore master gain in case we were paused (gain ramped to 0).
    if (store.masterGainNode && store.audioCtx) {
      const targetVolume = store.isMuted ? 0 : store.volume
      store.masterGainNode.gain.setValueAtTime(targetVolume, store.audioCtx.currentTime)
    }

    createOscillators()
    store.oscillators.forEach((_osc, index) => runOscPattern(index))
    startPlaybackTimer()
  }

  function startPlaybackTimer() {
    if (playbackTimer.value) {
      clearInterval(playbackTimer.value)
    }

    playbackTimer.value = setInterval(() => {
      if (store.isPlaying && !store.isPaused) {
        store.currentTime += TIMER_INTERVAL_MS

        if (store.isLooping && store.currentTime >= LOOP_DURATION_MS) {
          store.currentTime = 0
        }
      }
    }, TIMER_INTERVAL_MS)
  }

  function updateVolume(value) {
    store.volume = value

    if (
      store.masterGainNode &&
      store.audioCtx &&
      store.isPlaying &&
      !store.isPaused &&
      !store.isMuted
    ) {
      store.masterGainNode.gain.setValueAtTime(value, store.audioCtx.currentTime)
    }
  }

  function toggleMute() {
    store.isMuted = !store.isMuted

    if (store.masterGainNode && store.audioCtx && store.isPlaying && !store.isPaused) {
      const targetVolume = store.isMuted ? 0 : store.volume
      store.masterGainNode.gain.setValueAtTime(targetVolume, store.audioCtx.currentTime)
    }

    toast.info(store.isMuted ? 'toast_mute_on' : 'toast_mute_off')
  }

  function toggleLoop() {
    store.isLooping = !store.isLooping
    toast.info(store.isLooping ? 'toast_loop_on' : 'toast_loop_off')
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
    restartAlarm,
    pauseAlarm,
    resumeAlarm,
    stopAlarm,
    updateVolume,
    toggleMute,
    toggleLoop,
    formatTime,
    handleKeyboard,
  }
}
