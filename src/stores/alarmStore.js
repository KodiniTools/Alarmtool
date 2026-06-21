// Facade store — composes domain stores so all existing callers work unchanged.
// New code should import domain stores directly instead of this facade.
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useAudioNodes } from './audioNodes'
import { useOscillatorStore } from './oscillatorStore'
import { usePlayerStore } from './playerStore'
import { useRecorderStore } from './recorderStore'
import { useSettingsStore } from './settingsStore'

function rw(get, set) {
  return computed({ get, set })
}

export const useAlarmStore = defineStore('alarm', () => {
  const nodes = useAudioNodes()
  const osc = useOscillatorStore()
  const player = usePlayerStore()
  const recorder = useRecorderStore()
  const settings = useSettingsStore()

  // ── Audio nodes ──
  // shallowRef in audioNodes.js tracks reference changes (null ↔ AudioContext)
  // without deep-proxying Web Audio internals. Returned directly so Pinia
  // auto-unwraps them — store.audioCtx reads/writes the shallowRef value.
  const {
    audioCtx,
    masterGainNode,
    filterNode,
    delayNode,
    convolverNode,
    reverbGain,
    effectsOut,
    finalOutputNode,
  } = nodes

  // ── Oscillator store ──
  const oscillators = computed(() => osc.oscillators)
  const oscClipboard = rw(
    () => osc.oscClipboard,
    (v) => {
      osc.oscClipboard = v
    }
  )
  const activeOscillators = computed(() => osc.activeOscillators)
  const enabledOscillators = computed(() => osc.enabledOscillators)

  // ── Player store ──
  const isAlarmRunning = rw(
    () => player.isAlarmRunning,
    (v) => {
      player.isAlarmRunning = v
    }
  )
  const isPlaying = rw(
    () => player.isPlaying,
    (v) => {
      player.isPlaying = v
    }
  )
  const isPaused = rw(
    () => player.isPaused,
    (v) => {
      player.isPaused = v
    }
  )
  const currentTime = rw(
    () => player.currentTime,
    (v) => {
      player.currentTime = v
    }
  )
  const volume = rw(
    () => player.volume,
    (v) => {
      player.volume = v
    }
  )
  const isMuted = rw(
    () => player.isMuted,
    (v) => {
      player.isMuted = v
    }
  )
  const isLooping = rw(
    () => player.isLooping,
    (v) => {
      player.isLooping = v
    }
  )

  // ── Recorder store ──
  const isRecording = rw(
    () => recorder.isRecording,
    (v) => {
      recorder.isRecording = v
    }
  )
  const recordingDuration = rw(
    () => recorder.recordingDuration,
    (v) => {
      recorder.recordingDuration = v
    }
  )
  const remainingTime = rw(
    () => recorder.remainingTime,
    (v) => {
      recorder.remainingTime = v
    }
  )

  // ── Settings store ──
  const currentLang = computed(() => settings.currentLang)
  const currentTheme = computed(() => settings.currentTheme)
  const filterSettings = computed(() => settings.filterSettings)

  return {
    // Audio nodes (shallowRefs — Pinia auto-unwraps, assignment updates .value)
    audioCtx,
    masterGainNode,
    filterNode,
    delayNode,
    convolverNode,
    reverbGain,
    effectsOut,
    finalOutputNode,
    // Oscillators
    oscillators,
    oscClipboard,
    activeOscillators,
    enabledOscillators,
    updateOscillator: osc.updateOscillator,
    resetOscillators: osc.resetOscillators,
    // Player
    isAlarmRunning,
    isPlaying,
    isPaused,
    currentTime,
    volume,
    isMuted,
    isLooping,
    // Recorder
    isRecording,
    recordingDuration,
    remainingTime,
    // Settings
    currentLang,
    currentTheme,
    filterSettings,
    setLanguage: settings.setLanguage,
    setTheme: settings.setTheme,
    updateFilterSettings: settings.updateFilterSettings,
  }
})
