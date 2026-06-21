import { useAlarmStore } from '@/stores/alarmStore'
import { useUndoRedo } from './useUndoRedo'
import { useOscillatorPattern } from './useOscillatorPattern'
import { useOscillatorLifecycle } from './useOscillatorLifecycle'

export function useOscillators() {
  const store = useAlarmStore()
  const { recordChange } = useUndoRedo()
  const { parsePattern, setOscTone, runOscPattern } = useOscillatorPattern()
  const { createOscillators, startSingleOscillator, stopSingleOscillator, stopOscillators } =
    useOscillatorLifecycle()

  function updateOscillatorParameter(oscId, param, value) {
    const oscData = store.oscillators[oscId]
    if (!oscData) return

    recordChange()

    if (param === 'enabled') {
      store.updateOscillator(oscId, { enabled: value })
      if (value && store.isAlarmRunning) {
        startSingleOscillator(oscId)
      } else if (!value && oscData.oscillator) {
        stopSingleOscillator(oscId)
      }
      return
    }

    if (param === 'pattern') {
      store.updateOscillator(oscId, { pattern: value })
      parsePattern(oscId)
      return
    }

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
          if (oscData.panNode) oscData.panNode.pan.setValueAtTime(value, now)
          break
      }
    }

    store.updateOscillator(oscId, { [param]: value })
  }

  return {
    // Pattern
    parsePattern,
    setOscTone,
    runOscPattern,
    // Lifecycle
    createOscillators,
    startSingleOscillator,
    stopSingleOscillator,
    stopOscillators,
    // Coordinator
    updateOscillatorParameter,
  }
}
