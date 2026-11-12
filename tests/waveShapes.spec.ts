import { describe, it, expect } from 'vitest'
import {
  mixPath,
  patternEnvelope,
  patternSegments,
  waveValue,
  wavePath,
  type WaveShape,
} from '@/lib/waveShapes'
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

describe('mixPath / wavePath', () => {
  it('erzeugt einen Pfad mit einem Punkt je Stützstelle innerhalb der Fläche', () => {
    const d = wavePath('sine', 2, { width: 100, height: 40, samples: 50 })
    const points = d.split(' ')
    expect(points).toHaveLength(50)
    expect(points[0].startsWith('M0.0,')).toBe(true)
    expect(points.at(-1)?.startsWith('L100.0,')).toBe(true)
    for (const p of points) {
      const y = Number(p.slice(1).split(',')[1])
      expect(y).toBeGreaterThanOrEqual(0)
      expect(y).toBeLessThanOrEqual(40)
    }
  })

  it('bleibt bei leerer Mischung eine Nulllinie statt NaN', () => {
    const d = mixPath([], { width: 10, height: 20, samples: 3 })
    expect(d).toBe('M0.0,10.0 L5.0,10.0 L10.0,10.0')
  })

  it('Hüllkurve 0 ergibt eine Nulllinie', () => {
    const d = mixPath([{ shape: 'square', cycles: 1, gain: 1 }], {
      width: 10,
      height: 20,
      samples: 3,
      envelope: () => 0,
    })
    expect(d).toBe('M0.0,10.0 L5.0,10.0 L10.0,10.0')
  })
})

describe('patternEnvelope / patternSegments', () => {
  it('ist in An-Abschnitten 1, in Aus-Abschnitten 0, mit Flanken', () => {
    const env = patternEnvelope([300, 150], 900, 30)
    expect(env(150 / 900)).toBe(1)
    expect(env(375 / 900)).toBe(0)
    expect(env(15 / 900)).toBeCloseTo(0.5)
  })

  it('ignoriert ungültige Muster', () => {
    expect(patternEnvelope([], 900, 30)(0.5)).toBe(1)
    expect(patternSegments([0, -1], 900)).toEqual([{ start: 0, end: 1 }])
  })

  it('liefert die An-Abschnitte als Anteile der Breite', () => {
    expect(patternSegments([300, 150], 900)).toEqual([
      { start: 0, end: 1 / 3 },
      { start: 0.5, end: 5 / 6 },
    ])
  })
})
