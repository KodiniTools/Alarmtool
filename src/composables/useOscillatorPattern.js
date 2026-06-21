import { useAlarmStore } from '@/stores/alarmStore'

const FALLBACK_PATTERN = [1500, 300]

export function useOscillatorPattern() {
  const store = useAlarmStore()

  function parsePattern(oscId) {
    const oscData = store.oscillators[oscId]
    if (!oscData) return

    try {
      const numbers = oscData.pattern
        .split(',')
        .map((x) => parseFloat(x.trim()))
        .filter((n) => !isNaN(n) && n > 0)

      const steps = numbers.length >= 2 && numbers.length % 2 === 0 ? numbers : FALLBACK_PATTERN

      store.updateOscillator(oscId, { patternSteps: steps, patternIndex: 0, toneIsOn: false })
    } catch (_error) {
      store.updateOscillator(oscId, {
        patternSteps: FALLBACK_PATTERN,
        patternIndex: 0,
        toneIsOn: false,
      })
    }
  }

  function setOscTone(oscId, on) {
    const oscData = store.oscillators[oscId]
    if (!store.audioCtx || !oscData?.gainNode) return

    try {
      const now = store.audioCtx.currentTime
      const gain = oscData.gainNode.gain
      gain.cancelScheduledValues(now)

      if (on) {
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

  function runOscPattern(oscId) {
    const oscData = store.oscillators[oscId]
    if (!oscData?.enabled || !store.isAlarmRunning || !oscData.patternSteps.length) return

    const newToneState = !oscData.toneIsOn
    setOscTone(oscId, newToneState)

    const stepDuration = oscData.patternSteps[oscData.patternIndex]
    const nextIndex = (oscData.patternIndex + 1) % oscData.patternSteps.length

    store.updateOscillator(oscId, { toneIsOn: newToneState, patternIndex: nextIndex })

    const timeoutId = setTimeout(() => runOscPattern(oscId), stepDuration)
    store.updateOscillator(oscId, { patternTimeoutId: timeoutId })
  }

  return { parsePattern, setOscTone, runOscPattern }
}
