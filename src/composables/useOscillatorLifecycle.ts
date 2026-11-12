import { useAlarmStore } from '@/stores/alarmStore'
import { useOscillatorPattern } from './useOscillatorPattern'
import {
  getOscRuntime,
  setOscRuntime,
  clearOscRuntime,
  clearAllOscRuntime,
} from './useOscillatorRuntime'
import { applyWaveType } from '@/lib/waveforms'
import type { Oscillator } from '@/stores/oscillatorStore'

export function useOscillatorLifecycle() {
  const store = useAlarmStore()
  const { parsePattern, runOscPattern } = useOscillatorPattern()

  /** Callers check that audioCtx and masterGainNode exist. */
  function _buildNode(oscData: Oscillator) {
    const ctx = store.audioCtx!
    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()
    const panNode = ctx.createStereoPanner()

    applyWaveType(osc, ctx, oscData.waveType)
    osc.frequency.setValueAtTime(oscData.frequency, ctx.currentTime)
    panNode.pan.setValueAtTime(oscData.pan, ctx.currentTime)
    gainNode.gain.setValueAtTime(0, ctx.currentTime)

    osc.connect(gainNode).connect(panNode).connect(store.masterGainNode!)

    return { osc, gainNode, panNode }
  }

  function _releaseNode(oscId: number) {
    const rt = getOscRuntime(oscId)
    if (!rt?.osc || !rt?.gainNode) return

    const oscData = store.oscillators[oscId]

    try {
      // Without a context this throws and is ignored below, as before
      const now = store.audioCtx!.currentTime
      const releaseSec = (oscData?.release ?? 80) / 1000 + 0.05
      const currentVal = rt.gainNode.gain.value

      rt.gainNode.gain.cancelScheduledValues(now)
      rt.gainNode.gain.setValueAtTime(currentVal, now)
      rt.gainNode.gain.linearRampToValueAtTime(0, now + releaseSec)

      const oscRef = rt.osc
      const gainRef = rt.gainNode
      const panRef = rt.panNode

      setTimeout(() => {
        try {
          oscRef.stop()
          oscRef.disconnect()
          gainRef.disconnect()
          panRef?.disconnect()
        } catch {
          // ignore — node already disconnected
        }
      }, releaseSec * 1000)
    } catch {
      // Stop failed — node may already be disconnected
    }
  }

  function createOscillators() {
    if (!store.audioCtx || !store.masterGainNode) return

    store.oscillators.forEach((oscData, index) => {
      if (!oscData.enabled) return

      try {
        const { osc, gainNode, panNode } = _buildNode(oscData)
        parsePattern(index)
        // Store nodes in non-reactive runtime map — keeps Web Audio objects out of Vue proxy
        setOscRuntime(index, { osc, gainNode, panNode })
        osc.start()
      } catch {
        // Oscillator creation failed — skip this one
      }
    })
  }

  function startSingleOscillator(oscId: number) {
    if (!store.audioCtx || !store.masterGainNode) return

    const oscData = store.oscillators[oscId]
    const rt = getOscRuntime(oscId)
    if (!oscData || !oscData.enabled || rt?.osc) return

    try {
      const { osc, gainNode, panNode } = _buildNode(oscData)
      parsePattern(oscId)
      setOscRuntime(oscId, { osc, gainNode, panNode })
      osc.start()

      if (store.isAlarmRunning) {
        runOscPattern(oscId)
      }
    } catch {
      // Oscillator start failed — skip
    }
  }

  function stopSingleOscillator(oscId: number) {
    const rt = getOscRuntime(oscId)
    if (!rt) return

    if (rt.patternTimeoutId) {
      clearTimeout(rt.patternTimeoutId)
    }

    _releaseNode(oscId)
    clearOscRuntime(oscId)
  }

  function stopOscillators() {
    store.oscillators.forEach((_oscData, index) => {
      const rt = getOscRuntime(index)
      if (!rt) return

      if (rt.patternTimeoutId) {
        clearTimeout(rt.patternTimeoutId)
      }

      if (rt.osc && rt.gainNode) {
        _releaseNode(index)

        const releaseSec = (store.oscillators[index]?.release ?? 80) / 1000 + 0.05
        setTimeout(() => {
          clearOscRuntime(index)
        }, releaseSec * 1000)
      }
    })

    // Clear any orphaned entries
    setTimeout(() => clearAllOscRuntime(), 2000)
  }

  return { createOscillators, startSingleOscillator, stopSingleOscillator, stopOscillators }
}
