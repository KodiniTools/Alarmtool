import { useAlarmStore } from '@/stores/alarmStore'
import { useUndoRedo } from './useUndoRedo'

export function useOscillators() {
  const store = useAlarmStore()
  const { recordChange } = useUndoRedo()

  function createOscillators() {
    if (!store.audioCtx || !store.masterGainNode) {
      return
    }

    store.oscillators.forEach((oscData, index) => {
      // Skip disabled oscillators
      if (!oscData.enabled) {
        return
      }

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
          panNode: panNode,
        })
      } catch (_error) {
        // Oscillator creation failed — skip this one
      }
    })
  }

  function parsePattern(oscId) {
    const oscData = store.oscillators[oscId]
    if (!oscData) return

    try {
      const patternStr = oscData.pattern
      const values = patternStr.split(',').map((x) => x.trim())
      const numbers = values.map((x) => parseFloat(x)).filter((num) => !isNaN(num) && num > 0)

      if (numbers.length >= 2 && numbers.length % 2 === 0) {
        store.updateOscillator(oscId, {
          patternSteps: numbers,
          patternIndex: 0,
          toneIsOn: false,
        })
      } else {
        store.updateOscillator(oscId, {
          patternSteps: [1500, 300],
          patternIndex: 0,
          toneIsOn: false,
        })
      }
    } catch (_error) {
      store.updateOscillator(oscId, {
        patternSteps: [1500, 300],
        patternIndex: 0,
        toneIsOn: false,
      })
    }
  }

  function runOscPattern(oscId) {
    const oscData = store.oscillators[oscId]

    // Skip disabled oscillators
    if (!oscData.enabled || !store.isAlarmRunning || !oscData.patternSteps.length) {
      return
    }

    const newToneState = !oscData.toneIsOn
    setOscTone(oscId, newToneState)

    const stepDuration = oscData.patternSteps[oscData.patternIndex]
    const nextIndex = (oscData.patternIndex + 1) % oscData.patternSteps.length

    store.updateOscillator(oscId, {
      toneIsOn: newToneState,
      patternIndex: nextIndex,
    })

    const timeoutId = setTimeout(() => {
      runOscPattern(oscId)
    }, stepDuration)

    store.updateOscillator(oscId, {
      patternTimeoutId: timeoutId,
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
        // ADSR: Attack -> Decay -> Sustain (hold until release)
        const attackSec = (oscData.attack || 20) / 1000
        const decaySec = (oscData.decay ?? 50) / 1000
        const sustainLevel = oscData.sustain ?? 0.8
        const peakVol = oscData.volume
        const sustainVol = sustainLevel * peakVol

        gain.setValueAtTime(gain.value, now)
        gain.linearRampToValueAtTime(peakVol, now + attackSec)
        gain.linearRampToValueAtTime(sustainVol, now + attackSec + decaySec)
      } else {
        const releaseSec = (oscData.release || 80) / 1000
        gain.setValueAtTime(gain.value, now)
        gain.linearRampToValueAtTime(0, now + releaseSec)
      }
    } catch (_error) {
      // Audio parameter update failed — non-critical
    }
  }

  function updateOscillatorParameter(oscId, param, value) {
    const oscData = store.oscillators[oscId]
    if (!oscData) return

    recordChange()

    const update = { [param]: value }

    // Handle enabled toggle - dynamic start/stop during playback
    if (param === 'enabled') {
      store.updateOscillator(oscId, update)

      if (value && store.isAlarmRunning) {
        // Oscillator was enabled while alarm is running - start it
        startSingleOscillator(oscId)
      } else if (!value && oscData.oscillator) {
        // Oscillator was disabled - stop it
        stopSingleOscillator(oscId)
      }
      return
    }

    // For pattern changes, update store FIRST, then parse
    if (param === 'pattern') {
      store.updateOscillator(oscId, update)
      parsePattern(oscId)
      return
    }

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
      }
    }

    store.updateOscillator(oscId, update)
  }

  // Start a single oscillator (used when enabling during playback)
  function startSingleOscillator(oscId) {
    if (!store.audioCtx || !store.masterGainNode) {
      return
    }

    const oscData = store.oscillators[oscId]
    if (!oscData || !oscData.enabled || oscData.oscillator) {
      return
    }

    try {
      const osc = store.audioCtx.createOscillator()
      const gainNode = store.audioCtx.createGain()
      const panNode = store.audioCtx.createStereoPanner()

      osc.type = oscData.waveType
      osc.frequency.setValueAtTime(oscData.frequency, store.audioCtx.currentTime)
      panNode.pan.setValueAtTime(oscData.pan, store.audioCtx.currentTime)
      gainNode.gain.setValueAtTime(0, store.audioCtx.currentTime)

      osc.connect(gainNode).connect(panNode).connect(store.masterGainNode)

      parsePattern(oscId)
      osc.start()

      store.updateOscillator(oscId, {
        oscillator: osc,
        gainNode: gainNode,
        panNode: panNode,
      })

      // Start the pattern if alarm is running
      if (store.isAlarmRunning) {
        runOscPattern(oscId)
      }
    } catch (_error) {
      // Oscillator start failed — skip
    }
  }

  // Stop a single oscillator (used when disabling during playback)
  function stopSingleOscillator(oscId) {
    const oscData = store.oscillators[oscId]
    if (!oscData) return

    // Clear pattern timeout
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

        // Store references before clearing
        const oscRef = oscData.oscillator
        const gainRef = oscData.gainNode
        const panRef = oscData.panNode

        setTimeout(() => {
          try {
            oscRef.stop()
            oscRef.disconnect()
            gainRef.disconnect()
            panRef.disconnect()
          } catch (_e) {
            // ignore — node already disconnected
          }
        }, releaseSec * 1000)

        store.updateOscillator(oscId, {
          oscillator: null,
          gainNode: null,
          panNode: null,
          patternTimeoutId: null,
          toneIsOn: false,
        })
      } catch (_e) {
        // Stop failed — node may already be disconnected
      }
    }
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
            } catch (_e) {
              // ignore — node already disconnected
            }

            store.updateOscillator(index, {
              oscillator: null,
              gainNode: null,
              panNode: null,
              patternTimeoutId: null,
            })
          }, releaseSec * 1000)
        } catch (_e) {
          // Stop failed — node may already be disconnected
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
    parsePattern,
    startSingleOscillator,
    stopSingleOscillator,
  }
}
