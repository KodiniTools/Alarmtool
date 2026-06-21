import { useAlarmStore } from '@/stores/alarmStore'
import { useOscillatorPattern } from './useOscillatorPattern'

export function useOscillatorLifecycle() {
  const store = useAlarmStore()
  const { parsePattern, runOscPattern } = useOscillatorPattern()

  function _buildNode(oscData) {
    const osc = store.audioCtx.createOscillator()
    const gainNode = store.audioCtx.createGain()
    const panNode = store.audioCtx.createStereoPanner()

    osc.type = oscData.waveType
    osc.frequency.setValueAtTime(oscData.frequency, store.audioCtx.currentTime)
    panNode.pan.setValueAtTime(oscData.pan, store.audioCtx.currentTime)
    gainNode.gain.setValueAtTime(0, store.audioCtx.currentTime)

    osc.connect(gainNode).connect(panNode).connect(store.masterGainNode)

    return { osc, gainNode, panNode }
  }

  function _releaseNode(oscData, oscId) {
    if (!oscData.oscillator || !oscData.gainNode) return

    try {
      const now = store.audioCtx.currentTime
      const releaseSec = oscData.release / 1000 + 0.05
      const currentVal = oscData.gainNode.gain.value

      oscData.gainNode.gain.cancelScheduledValues(now)
      oscData.gainNode.gain.setValueAtTime(currentVal, now)
      oscData.gainNode.gain.linearRampToValueAtTime(0, now + releaseSec)

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
    } catch (_e) {
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
        osc.start()
        store.updateOscillator(index, { oscillator: osc, gainNode, panNode })
      } catch (_error) {
        // Oscillator creation failed — skip this one
      }
    })
  }

  function startSingleOscillator(oscId) {
    if (!store.audioCtx || !store.masterGainNode) return

    const oscData = store.oscillators[oscId]
    if (!oscData || !oscData.enabled || oscData.oscillator) return

    try {
      const { osc, gainNode, panNode } = _buildNode(oscData)
      parsePattern(oscId)
      osc.start()
      store.updateOscillator(oscId, { oscillator: osc, gainNode, panNode })

      if (store.isAlarmRunning) {
        runOscPattern(oscId)
      }
    } catch (_error) {
      // Oscillator start failed — skip
    }
  }

  function stopSingleOscillator(oscId) {
    const oscData = store.oscillators[oscId]
    if (!oscData) return

    if (oscData.patternTimeoutId) {
      clearTimeout(oscData.patternTimeoutId)
    }

    _releaseNode(oscData, oscId)

    store.updateOscillator(oscId, {
      oscillator: null,
      gainNode: null,
      panNode: null,
      patternTimeoutId: null,
      toneIsOn: false,
    })
  }

  function stopOscillators() {
    store.oscillators.forEach((oscData, index) => {
      if (oscData.patternTimeoutId) {
        clearTimeout(oscData.patternTimeoutId)
      }

      if (oscData.oscillator && oscData.gainNode) {
        _releaseNode(oscData, index)

        setTimeout(
          () => {
            store.updateOscillator(index, {
              oscillator: null,
              gainNode: null,
              panNode: null,
              patternTimeoutId: null,
            })
          },
          (oscData.release / 1000 + 0.05) * 1000
        )
      }
    })
  }

  return { createOscillators, startSingleOscillator, stopSingleOscillator, stopOscillators }
}
