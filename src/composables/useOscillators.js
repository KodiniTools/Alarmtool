import { useAlarmStore } from '@/stores/alarmStore'

export function useOscillators() {
  const store = useAlarmStore()

  function createOscillators() {
    if (!store.audioCtx || !store.masterGainNode) {
      console.error('Audio context not initialized')
      return
    }

    store.oscillators.forEach((oscData, index) => {
      try {
        const osc = store.audioCtx.createOscillator()
        const gainNode = store.audioCtx.createGain()
        const panNode = store.audioCtx.createStereoPanner()

        osc.type = oscData.waveType
        osc.frequency.setValueAtTime(oscData.frequency, store.audioCtx.currentTime)
        panNode.pan.setValueAtTime(oscData.pan, store.audioCtx.currentTime)
        gainNode.gain.setValueAtTime(0, store.audioCtx.currentTime)

        osc.connect(gainNode).connect(panNode).connect(store.masterGainNode)

        parsePattern(index)
        osc.start()

        store.updateOscillator(index, {
          oscillator: osc,
          gainNode: gainNode,
          panNode: panNode
        })
      } catch (error) {
        console.error(`Error creating oscillator ${index + 1}:`, error)
      }
    })
  }

  function parsePattern(oscId) {
    const oscData = store.oscillators[oscId]
    if (!oscData) return

    try {
      const patternStr = oscData.pattern
      const values = patternStr.split(',').map(x => x.trim())
      const numbers = values.map(x => parseFloat(x)).filter(num => !isNaN(num) && num > 0)
      
      if (numbers.length >= 2 && numbers.length % 2 === 0) {
        store.updateOscillator(oscId, {
          patternSteps: numbers,
          patternIndex: 0,
          toneIsOn: false
        })
      } else {
        store.updateOscillator(oscId, {
          patternSteps: [300, 200, 500, 100],
          patternIndex: 0,
          toneIsOn: false
        })
      }
    } catch (error) {
      console.error('Pattern parse error:', error)
      store.updateOscillator(oscId, {
        patternSteps: [300, 200, 500, 100],
        patternIndex: 0,
        toneIsOn: false
      })
    }
  }

  function runOscPattern(oscId) {
    const oscData = store.oscillators[oscId]
    
    if (!store.isAlarmRunning || !oscData.patternSteps.length) {
      return
    }
    
    const newToneState = !oscData.toneIsOn
    setOscTone(oscId, newToneState)
    
    const stepDuration = oscData.patternSteps[oscData.patternIndex]
    const nextIndex = (oscData.patternIndex + 1) % oscData.patternSteps.length
    
    store.updateOscillator(oscId, {
      toneIsOn: newToneState,
      patternIndex: nextIndex
    })
    
    const timeoutId = setTimeout(() => {
      runOscPattern(oscId)
    }, stepDuration)
    
    store.updateOscillator(oscId, {
      patternTimeoutId: timeoutId
    })
  }

  function setOscTone(oscId, on) {
    const oscData = store.oscillators[oscId]
    
    if (!store.audioCtx || !oscData.gainNode) {
      return
    }
    
    try {
      const now = store.audioCtx.currentTime
      const gain = oscData.gainNode.gain
      gain.cancelScheduledValues(now)
      
      if (on) {
        const attackSec = oscData.attack / 1000
        const targetVol = oscData.volume
        gain.setValueAtTime(gain.value, now)
        gain.linearRampToValueAtTime(targetVol, now + attackSec)
      } else {
        const releaseSec = oscData.release / 1000
        gain.setValueAtTime(gain.value, now)
        gain.linearRampToValueAtTime(0, now + releaseSec)
      }
    } catch (error) {
      console.error('setOscTone error:', error)
    }
  }

  function updateOscillatorParameter(oscId, param, value) {
    const oscData = store.oscillators[oscId]
    if (!oscData) return

    const update = { [param]: value }

    // Update audio nodes if oscillator is running
    if (oscData.oscillator && store.audioCtx) {
      const now = store.audioCtx.currentTime
      
      switch (param) {
        case 'frequency':
          oscData.oscillator.frequency.setValueAtTime(value, now)
          break
        case 'waveType':
          oscData.oscillator.type = value
          break
        case 'pan':
          if (oscData.panNode) {
            oscData.panNode.pan.setValueAtTime(value, now)
          }
          break
        case 'pattern':
          update.pattern = value
          parsePattern(oscId)
          break
      }
    }

    store.updateOscillator(oscId, update)
  }

  function stopOscillators() {
    store.oscillators.forEach((oscData, index) => {
      if (oscData.patternTimeoutId) {
        clearTimeout(oscData.patternTimeoutId)
      }
      
      if (oscData.oscillator && oscData.gainNode) {
        try {
          const now = store.audioCtx.currentTime
          const releaseSec = oscData.release / 1000 + 0.05
          const currentVal = oscData.gainNode.gain.value

          oscData.gainNode.gain.cancelScheduledValues(now)
          oscData.gainNode.gain.setValueAtTime(currentVal, now)
          oscData.gainNode.gain.linearRampToValueAtTime(0, now + releaseSec)

          setTimeout(() => {
            try {
              oscData.oscillator.stop()
              oscData.oscillator.disconnect()
              oscData.gainNode.disconnect()
              oscData.panNode.disconnect()
            } catch (e) {}
            
            store.updateOscillator(index, {
              oscillator: null,
              gainNode: null,
              panNode: null,
              patternTimeoutId: null
            })
          }, releaseSec * 1000)
        } catch (e) {
          console.error('Error stopping oscillator:', e)
        }
      }
    })
  }

  return {
    createOscillators,
    runOscPattern,
    setOscTone,
    updateOscillatorParameter,
    stopOscillators,
    parsePattern
  }
}
