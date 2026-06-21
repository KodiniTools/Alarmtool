import { useAlarmStore } from '@/stores/alarmStore'
import { getOscRuntime, setOscRuntime } from './useOscillatorRuntime'

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
      setOscRuntime(oscId, { patternSteps: steps, patternIndex: 0, toneIsOn: false })
    } catch (_error) {
      setOscRuntime(oscId, { patternSteps: FALLBACK_PATTERN, patternIndex: 0, toneIsOn: false })
    }
  }

  function setOscTone(oscId, on) {
    const rt = getOscRuntime(oscId)
    if (!store.audioCtx || !rt?.gainNode) return

    const oscData = store.oscillators[oscId]
    if (!oscData) return

    try {
      const now = store.audioCtx.currentTime
      const gain = rt.gainNode.gain
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
    const rt = getOscRuntime(oscId)
    if (!oscData?.enabled || !store.isAlarmRunning || !rt?.patternSteps?.length) return

    const newToneState = !rt.toneIsOn
    setOscTone(oscId, newToneState)

    const stepDuration = rt.patternSteps[rt.patternIndex]
    const nextIndex = (rt.patternIndex + 1) % rt.patternSteps.length

    // Update runtime state without touching Vue reactive system
    setOscRuntime(oscId, { toneIsOn: newToneState, patternIndex: nextIndex })

    const timeoutId = setTimeout(() => runOscPattern(oscId), stepDuration)
    setOscRuntime(oscId, { patternTimeoutId: timeoutId })
  }

  return { parsePattern, setOscTone, runOscPattern }
}
