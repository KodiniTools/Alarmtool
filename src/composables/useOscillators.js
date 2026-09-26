import { useAlarmStore } from '@/stores/alarmStore'
import { useUndoRedo } from './useUndoRedo'
import { useOscillatorPattern } from './useOscillatorPattern'
import { useOscillatorLifecycle } from './useOscillatorLifecycle'
import { getOscRuntime } from './useOscillatorRuntime'
import { applyWaveType } from '@/lib/waveforms'

/** Translation key used to describe a parameter change in the undo history. */
const PARAM_LABEL_KEYS = {
  enabled: 'history_toggle',
  waveType: 'osc_waveform',
  frequency: 'osc_frequency',
  volume: 'osc_volume',
  pan: 'osc_pan',
  attack: 'osc_attack',
  decay: 'osc_decay',
  sustain: 'osc_sustain',
  release: 'osc_release',
  pattern: 'osc_pattern',
}

export function useOscillators() {
  const store = useAlarmStore()
  const { recordChange } = useUndoRedo()
  const { parsePattern, runOscPattern } = useOscillatorPattern()
  const { createOscillators, startSingleOscillator, stopSingleOscillator, stopOscillators } =
    useOscillatorLifecycle()

  function updateOscillatorParameter(oscId, param, value) {
    const oscData = store.oscillators[oscId]
    if (!oscData || oscData[param] === value) return

    recordChange({ labelKey: PARAM_LABEL_KEYS[param], oscId })

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
          applyWaveType(rt.osc, store.audioCtx, value)
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
    runOscPattern,
    // Lifecycle
    createOscillators,
    stopOscillators,
    // Coordinator
    updateOscillatorParameter,
  }
}
