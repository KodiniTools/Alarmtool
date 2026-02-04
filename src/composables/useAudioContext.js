import { ref } from 'vue'
import { useAlarmStore } from '@/stores/alarmStore'

export function useAudioContext() {
  const store = useAlarmStore()

  function initAudioContext() {
    if (!store.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      store.audioCtx = new AudioContext()
      
      // Master Gain Node
      store.masterGainNode = store.audioCtx.createGain()
      store.masterGainNode.gain.value = store.volume
      
      // Setup Filter and Effects
      setupGlobalFilter()
      setupEffects()
      
      // Connect chain: Master -> Filter -> Delay -> Reverb -> Destination
      store.masterGainNode
        .connect(store.filterNode)
        .connect(store.delayNode)
        .connect(store.effectsOut)
        .connect(store.audioCtx.destination)
    }
    
    if (store.audioCtx.state === 'suspended') {
      store.audioCtx.resume()
    }
  }

  function setupGlobalFilter() {
    if (!store.audioCtx) return
    
    store.filterNode = store.audioCtx.createBiquadFilter()
    store.filterNode.type = 'allpass' // 'none' -> allpass
    store.filterNode.frequency.setValueAtTime(
      store.filterSettings.frequency,
      store.audioCtx.currentTime
    )
    store.filterNode.Q.setValueAtTime(
      store.filterSettings.Q,
      store.audioCtx.currentTime
    )
  }

  function setupEffects() {
    if (!store.audioCtx) return
    
    // Delay
    store.delayNode = store.audioCtx.createDelay()
    store.delayNode.delayTime.value = 0.3

    const feedbackGain = store.audioCtx.createGain()
    feedbackGain.gain.value = 0.5
    store.delayNode.connect(feedbackGain).connect(store.delayNode)
    
    // Reverb (Convolver)
    store.convolverNode = store.audioCtx.createConvolver()
    loadReverbImpulseResponse()
    
    store.reverbGain = store.audioCtx.createGain()
    store.reverbGain.gain.value = 0.5
    
    store.delayNode.connect(store.convolverNode)
    store.convolverNode.connect(store.reverbGain)
    
    store.effectsOut = store.reverbGain
  }

  function loadReverbImpulseResponse() {
    if (!store.audioCtx || !store.convolverNode) return

    try {
      const rate = store.audioCtx.sampleRate
      const length = rate * 3 // 3 seconds
      const impulse = store.audioCtx.createBuffer(2, length, rate)

      for (let channel = 0; channel < 2; channel++) {
        const channelData = impulse.getChannelData(channel)
        for (let i = 0; i < length; i++) {
          const t = i / rate
          // Exponential decay for natural room feel
          const decay = Math.exp(-2.5 * t)
          // Early reflections in first 80ms add spatial depth
          const early = t < 0.08 ? 0.4 * Math.exp(-30 * t) : 0
          channelData[i] = (Math.random() * 2 - 1) * (decay + early)
        }
      }

      store.convolverNode.buffer = impulse
    } catch (error) {
      console.error('Error loading reverb impulse response:', error)
    }
  }

  function updateFilter(settings) {
    if (!store.filterNode || !store.audioCtx) return
    
    const { type, frequency, Q } = settings
    const now = store.audioCtx.currentTime
    
    if (type !== undefined) {
      store.filterNode.type = type === 'none' ? 'allpass' : type
    }
    
    if (frequency !== undefined) {
      store.filterNode.frequency.setValueAtTime(frequency, now)
    }
    
    if (Q !== undefined) {
      store.filterNode.Q.setValueAtTime(Q, now)
    }
    
    store.updateFilterSettings(settings)
  }

  function closeAudioContext() {
    if (store.audioCtx) {
      store.audioCtx.close().catch(() => {})
      store.audioCtx = null
      store.masterGainNode = null
      store.filterNode = null
      store.delayNode = null
      store.convolverNode = null
      store.reverbGain = null
      store.effectsOut = null
    }
  }

  return {
    initAudioContext,
    setupGlobalFilter,
    setupEffects,
    updateFilter,
    closeAudioContext
  }
}
