import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAlarmStore = defineStore('alarm', () => {
  // Audio Context & Nodes
  const audioCtx = ref(null)
  const masterGainNode = ref(null)
  const filterNode = ref(null)
  const delayNode = ref(null)
  const convolverNode = ref(null)
  const reverbGain = ref(null)
  const effectsOut = ref(null)

  // Alarm State
  const isAlarmRunning = ref(false)
  
  // Player State
  const isPlaying = ref(false)
  const isPaused = ref(false)
  const currentTime = ref(0)
  const volume = ref(0.8)
  const isMuted = ref(false)
  const isLooping = ref(false)
  
  // Recording State
  const isRecording = ref(false)
  const recordingDuration = ref(60000)
  const remainingTime = ref(0)
  
  // Language & Theme
  const currentLang = ref(localStorage.getItem('alarmToolLang') || 'de')
  const currentTheme = ref(localStorage.getItem('alarmToolTheme') || 'dark')
  const backgroundColor = ref(localStorage.getItem('alarmToolBgColor') || '')
  
  // Filter Settings
  const filterSettings = ref({
    type: 'none',
    frequency: 1000,
    Q: 1
  })

  // Oscillator Data (12 oscillators)
  const oscillators = ref(Array.from({ length: 12 }, (_, i) => ({
    id: i,
    oscillator: null,
    gainNode: null,
    panNode: null,
    patternTimeoutId: null,
    patternSteps: [300, 200, 500, 100],
    patternIndex: 0,
    toneIsOn: false,
    // Settings
    waveType: 'sine',
    frequency: 440,
    volume: 0.5,
    pan: 0,
    attack: 100,
    release: 100,
    pattern: '300,200,500,100'
  })))

  // Computed
  const activeOscillators = computed(() => 
    oscillators.value.filter(osc => osc.oscillator !== null)
  )

  // Actions
  function setLanguage(lang) {
    currentLang.value = lang
    localStorage.setItem('alarmToolLang', lang)
  }

  function setTheme(theme) {
    currentTheme.value = theme
    localStorage.setItem('alarmToolTheme', theme)
    document.body.setAttribute('data-theme', theme)
  }

  function setBackgroundColor(color) {
    backgroundColor.value = color
    localStorage.setItem('alarmToolBgColor', color)
    if (color) {
      document.body.style.background = color
    } else {
      // Reset to default gradient
      document.body.style.background = ''
    }
  }

  function updateFilterSettings(settings) {
    filterSettings.value = { ...filterSettings.value, ...settings }
  }

  function updateOscillator(id, settings) {
    const osc = oscillators.value[id]
    if (osc) {
      Object.assign(osc, settings)
    }
  }

  function resetOscillators() {
    oscillators.value.forEach(osc => {
      if (osc.oscillator) {
        try {
          osc.oscillator.stop()
          osc.oscillator.disconnect()
        } catch (e) {}
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
    // State
    audioCtx,
    masterGainNode,
    filterNode,
    delayNode,
    convolverNode,
    reverbGain,
    effectsOut,
    isAlarmRunning,
    isPlaying,
    isPaused,
    currentTime,
    volume,
    isMuted,
    isLooping,
    isRecording,
    recordingDuration,
    remainingTime,
    currentLang,
    currentTheme,
    backgroundColor,
    filterSettings,
    oscillators,

    // Computed
    activeOscillators,

    // Actions
    setLanguage,
    setTheme,
    setBackgroundColor,
    updateFilterSettings,
    updateOscillator,
    resetOscillators
  }
})
