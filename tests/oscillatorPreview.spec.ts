import { describe, it, expect } from 'vitest'
import {
  envelopeAt,
  envelopeSamples,
  mixSamples,
  parsePatternSteps,
  rhythmWindowMs,
  sampleCount,
  toShape,
  valuesToPath,
  waveSamples,
  waveWindowMs,
  type PreviewOscillator,
} from '@/lib/oscillatorPreview'

const osc = (patch: Partial<PreviewOscillator> = {}): PreviewOscillator => ({
  enabled: true,
  waveType: 'sine',
  frequency: 440,
  volume: 0.5,
  attack: 20,
  decay: 50,
  sustain: 0.8,
  release: 80,
  pattern: '1500,300',
  ...patch,
})

describe('parsePatternSteps', () => {
  it('übernimmt gültige Muster und fällt sonst auf 1500,300 zurück (wie die Wiedergabe)', () => {
    expect(parsePatternSteps('200, 100,50,25')).toEqual([200, 100, 50, 25])
    expect(parsePatternSteps('200,100,50')).toEqual([1500, 300])
    expect(parsePatternSteps('abc')).toEqual([1500, 300])
    expect(parsePatternSteps(undefined)).toEqual([1500, 300])
    expect(parsePatternSteps('200,-5,100,0,80')).toEqual([1500, 300])
  })
})

describe('envelopeSamples', () => {
  it('folgt Attack, Decay, Sustain und Release eines Musters', () => {
    // 1 Stützstelle je ms über 600 ms: an 300, aus 300
    const v = envelopeSamples(
      osc({ attack: 100, decay: 100, sustain: 0.5, volume: 1, release: 100, pattern: '300,300' }),
      600,
      601
    )
    expect(v[0]).toBe(0)
    expect(v[50]).toBeCloseTo(0.5)
    expect(v[100]).toBeCloseTo(1)
    expect(v[150]).toBeCloseTo(0.75)
    expect(v[250]).toBeCloseTo(0.5)
    expect(v[350]).toBeCloseTo(0.25)
    expect(v[450]).toBe(0)
  })

  it('ist für ausgeschaltete Oszillatoren 0', () => {
    expect(envelopeSamples(osc({ enabled: false }), 1000, 10).every((x) => x === 0)).toBe(true)
  })

  it('geht nie über die Lautstärke', () => {
    const v = envelopeSamples(osc({ volume: 0.3, sustain: 2 }), 4000, 400)
    expect(Math.max(...v)).toBeLessThanOrEqual(0.3 + 1e-9)
  })
})

describe('Zeitfenster und Summe', () => {
  it('zeigt vier Perioden des tiefsten aktiven Oszillators', () => {
    expect(waveWindowMs([osc({ frequency: 200 }), osc({ frequency: 800 })])).toBeCloseTo(20)
    expect(waveWindowMs([osc({ frequency: 50, enabled: false })])).toBe(10)
  })

  it('begrenzt das Rhythmusfenster auf 1–8 s', () => {
    expect(rhythmWindowMs([osc({ pattern: '100,100' })])).toBe(1000)
    expect(rhythmWindowMs([osc({ pattern: '3000,500' })])).toBe(3500)
    expect(rhythmWindowMs([osc({ pattern: '9000,500' })])).toBe(8000)
  })

  it('addiert nur aktive Oszillatoren mit ihrer Lautstärke', () => {
    const a = osc({ waveType: 'square', frequency: 100, volume: 0.5 })
    const b = osc({ waveType: 'square', frequency: 100, volume: 0.25 })
    const off = osc({ enabled: false, volume: 1 })
    const mix = mixSamples([a, b, off], 10, 11)
    expect(mix[1]).toBeCloseTo(0.75)
  })

  it('reagiert auf die Wellenform', () => {
    const sine = waveSamples(osc({ frequency: 100 }), 10, 9)
    const saw = waveSamples(osc({ frequency: 100, waveType: 'sawtooth' }), 10, 9)
    expect(sine).not.toEqual(saw)
    expect(toShape('unbekannt')).toBe('sine')
  })

  it('wählt genug Stützstellen für hohe Frequenzen, begrenzt', () => {
    expect(sampleCount([osc({ frequency: 2000 })], 80)).toBe(3840)
    expect(sampleCount([osc({ frequency: 2000 })], 1000)).toBe(4000)
    expect(sampleCount([], 10)).toBe(600)
  })

  it('valuesToPath skaliert mittig oder vom Boden aus', () => {
    expect(valuesToPath([0, 1], 10, 20)).toBe('M0.0,10.0 L10.0,1.0')
    expect(valuesToPath([0, 1], 10, 20, 1, 'bottom')).toBe('M0.0,20.0 L10.0,2.0')
  })
})

describe('envelopeAt', () => {
  const o = osc({
    attack: 100,
    decay: 100,
    sustain: 0.5,
    volume: 1,
    release: 100,
    pattern: '300,300',
  })

  it('entspricht envelopeSamples im ersten Durchlauf', () => {
    expect(envelopeAt(o, 50)).toBeCloseTo(0.5)
    expect(envelopeAt(o, 250)).toBeCloseTo(0.5)
    expect(envelopeAt(o, 450)).toBe(0)
  })

  it('wiederholt sich mit dem Muster und ist ausgeschaltet 0', () => {
    expect(envelopeAt(o, 600 * 7 + 50)).toBeCloseTo(envelopeAt(o, 650))
    expect(envelopeAt(osc({ enabled: false }), 100)).toBe(0)
    expect(envelopeAt(o, -1)).toBe(0)
  })
})
