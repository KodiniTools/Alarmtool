import { describe, it, expect } from 'vitest'
import { waveValue, type WaveShape } from '@/lib/waveShapes'
import { WAVE_TYPES } from '@/lib/waveforms'

const SHAPES: WaveShape[] = ['sine', 'square', 'sawtooth', 'triangle', 'pulse', 'organ']

describe('waveValue', () => {
  it('kennt jede Wellenform der App', () => {
    expect(WAVE_TYPES.map((w) => w.value).sort()).toEqual([...SHAPES].sort())
  })

  it.each(SHAPES)('%s bleibt in [-1, 1] und ist periodisch', (shape) => {
    for (let i = 0; i < 200; i++) {
      const p = i / 200
      const v = waveValue(shape, p)
      expect(Math.abs(v)).toBeLessThanOrEqual(1 + 1e-9)
      expect(waveValue(shape, p + 3)).toBeCloseTo(v, 9)
    }
  })

  it('liefert die Eckwerte der Grundformen', () => {
    expect(waveValue('sine', 0.25)).toBeCloseTo(1)
    expect(waveValue('square', 0.75)).toBe(-1)
    expect(waveValue('sawtooth', 0)).toBe(-1)
    expect(waveValue('triangle', 0.25)).toBe(1)
    expect(waveValue('pulse', 0.3)).toBe(-1)
  })
})
