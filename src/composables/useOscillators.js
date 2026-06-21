import { useAlarmStore } from '@/stores/alarmStore'
import { useUndoRedo } from './useUndoRedo'
import { useOscillatorPattern } from './useOscillatorPattern'
import { useOscillatorLifecycle } from './useOscillatorLifecycle'
import { getOscRuntime } from './useOscillatorRuntime'

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
      } else if (!value && getOscRuntime(oscId)?.osc) {
        stopSingleOscillator(oscId)
      }
      return
    }

    if (param === 'pattern') {
      store.updateOscillator(oscId, { pattern: value })
      parsePattern(oscId)
      return
    }

    const rt = getOscRuntime(oscId)
    if (rt?.osc && store.audioCtx) {
      const now = store.audioCtx.currentTime
      switch (param) {
        case 'frequency':
          rt.osc.frequency.setValueAtTime(value, now)
          break
        case 'waveType':
          rt.osc.type = value
          break
        case 'pan':
          if (rt.panNode) rt.panNode.pan.setValueAtTime(value, now)
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
