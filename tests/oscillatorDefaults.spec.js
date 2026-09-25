import { describe, it, expect } from 'vitest'
import {
  DEFAULT_OSCILLATOR,
  OSC_PARAMS,
  OSCILLATOR_COUNT,
  normalizeOscSettings,
  pickOscParams,
} from '@/lib/oscillatorDefaults'
import { PRESETS } from '@/data/presets'
import { formatTime } from '@/lib/formatTime'

describe('oscillatorDefaults', () => {
  it('lists the sound parameters in export order', () => {
    expect(OSC_PARAMS).toEqual([
      'waveType',
      'frequency',
      'volume',
      'pan',
      'attack',
      'decay',
      'sustain',
      'release',
      'pattern',
    ])
  })

  it('pickOscParams drops id/enabled and unknown keys', () => {
    const osc = { id: 3, enabled: true, extra: 1, ...DEFAULT_OSCILLATOR }
    expect(pickOscParams(osc)).toEqual({ ...DEFAULT_OSCILLATOR })
  })

  it('normalizeOscSettings fills missing decay/sustain only', () => {
    const legacy = { ...DEFAULT_OSCILLATOR, decay: undefined, sustain: undefined, attack: 5 }
    expect(normalizeOscSettings(legacy)).toMatchObject({ attack: 5, decay: 50, sustain: 0.8 })
    expect(normalizeOscSettings({ ...legacy, decay: 0, sustain: 0 })).toMatchObject({
      decay: 0,
      sustain: 0,
    })
  })
})

describe('PRESETS', () => {
  it('every preset covers all oscillator slots', () => {
    for (const preset of PRESETS) {
      expect(preset.data.oscillators).toHaveLength(OSCILLATOR_COUNT)
      expect(preset.data.globalFilter).toBeDefined()
    }
  })

  it('pads unused slots with the default oscillator after the defined ones', () => {
    const emergency = PRESETS.find((p) => p.id === 'emergency')
    expect(emergency.data.oscillators[2].frequency).toBe(1320)
    expect(emergency.data.oscillators.slice(3)).toEqual(Array(9).fill(DEFAULT_OSCILLATOR))
  })

  it('has unique ids', () => {
    const ids = PRESETS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('formatTime', () => {
  it('formats milliseconds as MM:SS', () => {
    expect(formatTime(0)).toBe('00:00')
    expect(formatTime(61_999)).toBe('01:01')
    expect(formatTime(600_000)).toBe('10:00')
  })
})
