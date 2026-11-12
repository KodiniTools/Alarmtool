// Rechnet aus den Oszillator-Einstellungen, was die Live-Vorschau zeichnet:
// die Wellenform der Summe (kurzes Zeitfenster) und die Lautstärke-Hüllkurven
// über den Rhythmus (langes Zeitfenster). Gleiche Regeln wie die Wiedergabe
// (useOscillatorPattern): Muster „an, aus, …“ mit gerader Anzahl Werte, sonst
// 1500,300; beim Einschalten Attack auf volume, Decay auf sustain·volume,
// beim Ausschalten Release auf 0.

import { waveValue, type WaveShape } from './waveShapes'
import type { OscParams } from './oscillatorDefaults'

export const FALLBACK_PATTERN: readonly number[] = [1500, 300]

const SHAPES: readonly WaveShape[] = ['sine', 'square', 'sawtooth', 'triangle', 'pulse', 'organ']

/** Wellenform der Vorschau; unbekannte Werte wie in applyWaveType als Sinus. */
export function toShape(waveType: string): WaveShape {
  return (SHAPES as readonly string[]).includes(waveType) ? (waveType as WaveShape) : 'sine'
}

/** Musterschritte in ms wie bei der Wiedergabe; ungültige Muster ergeben 1500,300. */
export function parsePatternSteps(pattern: string | null | undefined): number[] {
  const numbers = String(pattern ?? '')
    .split(',')
    .map((x) => parseFloat(x.trim()))
    .filter((n) => !isNaN(n) && n > 0)
  return numbers.length >= 2 && numbers.length % 2 === 0 ? numbers : [...FALLBACK_PATTERN]
}

export type PreviewOscillator = Pick<
  OscParams,
  'waveType' | 'frequency' | 'volume' | 'attack' | 'decay' | 'sustain' | 'release' | 'pattern'
> & { enabled: boolean }

/** Dauer eines Musterdurchlaufs in ms. */
export function patternCycleMs(osc: Pick<OscParams, 'pattern'>): number {
  return parsePatternSteps(osc.pattern).reduce((a, b) => a + b, 0)
}

/**
 * Lautstärke (0 … volume) eines Oszillators über `totalMs`, an `samples` gleichmäßig
 * verteilten Zeitpunkten. Rampen sind linear wie linearRampToValueAtTime und starten
 * beim Umschalten vom aktuellen Wert.
 */
export function envelopeSamples(
  osc: PreviewOscillator,
  totalMs: number,
  samples: number
): number[] {
  const n = Math.max(2, Math.round(samples))
  if (!osc.enabled || totalMs <= 0) return new Array<number>(n).fill(0)

  const steps = parsePatternSteps(osc.pattern)
  const attack = Math.max(0, osc.attack || 20)
  const decay = Math.max(0, osc.decay ?? 50)
  const release = Math.max(0, osc.release || 80)
  const peak = Math.max(0, osc.volume)
  const sustain = Math.max(0, Math.min(1, osc.sustain ?? 0.8)) * peak

  // Abschnitte: [Start, Ende, an?] über das ganze Fenster
  const segments: { start: number; on: boolean }[] = []
  for (let t = 0, i = 0; t < totalMs; i++) {
    segments.push({ start: t, on: i % 2 === 0 })
    t += steps[i % steps.length]
  }

  const out: number[] = []
  let seg = -1
  let from = 0 // Pegel beim Umschalten
  let level = 0
  for (let i = 0; i < n; i++) {
    const t = (i / (n - 1)) * totalMs
    while (seg + 1 < segments.length && segments[seg + 1].start <= t) {
      seg++
      from = level
    }
    const { start, on } = segments[seg]
    const dt = t - start
    if (on) {
      if (dt < attack) level = from + (peak - from) * (attack ? dt / attack : 1)
      else if (dt < attack + decay) level = peak + (sustain - peak) * ((dt - attack) / decay)
      else level = sustain
    } else {
      level = dt < release ? from * (1 - dt / release) : 0
    }
    out.push(level)
  }
  return out
}

/** Zeitfenster der Wellenform: vier Perioden des tiefsten aktiven Oszillators (ms). */
export function waveWindowMs(oscillators: readonly PreviewOscillator[]): number {
  const freqs = oscillators.filter((o) => o.enabled && o.frequency > 0).map((o) => o.frequency)
  if (!freqs.length) return 10
  return (4 / Math.min(...freqs)) * 1000
}

/** Zeitfenster des Rhythmus: längster Musterdurchlauf, mindestens 1 s, höchstens 8 s. */
export function rhythmWindowMs(oscillators: readonly PreviewOscillator[]): number {
  const cycles = oscillators.filter((o) => o.enabled).map(patternCycleMs)
  return Math.min(8000, Math.max(1000, ...cycles))
}

/** Werte einer einzelnen Wellenform (volle Lautstärke) im Zeitfenster. */
export function waveSamples(
  osc: Pick<PreviewOscillator, 'waveType' | 'frequency'>,
  windowMs: number,
  samples: number
): number[] {
  const n = Math.max(2, Math.round(samples))
  const shape = toShape(osc.waveType)
  const periods = (osc.frequency * windowMs) / 1000
  return Array.from({ length: n }, (_, i) => waveValue(shape, (i / (n - 1)) * periods))
}

/** Summe aller aktiven Oszillatoren mit ihrer Lautstärke im Zeitfenster. */
export function mixSamples(
  oscillators: readonly PreviewOscillator[],
  windowMs: number,
  samples: number
): number[] {
  const n = Math.max(2, Math.round(samples))
  const out = new Array<number>(n).fill(0)
  for (const osc of oscillators) {
    if (!osc.enabled || osc.volume <= 0) continue
    const values = waveSamples(osc, windowMs, n)
    for (let i = 0; i < n; i++) out[i] += values[i] * osc.volume
  }
  return out
}

/** Stützstellen für ein Fenster: genug für die höchste Frequenz, begrenzt. */
export function sampleCount(
  oscillators: readonly PreviewOscillator[],
  windowMs: number,
  min = 600,
  max = 4000
): number {
  const freqs = oscillators.filter((o) => o.enabled).map((o) => o.frequency)
  const periods = freqs.length ? (Math.max(...freqs) * windowMs) / 1000 : 0
  return Math.round(Math.min(max, Math.max(min, periods * 24)))
}

/**
 * SVG-Pfad aus Werten. `scale` ist der Wert, der die halbe Höhe füllt
 * (für die Summe die Summe der Lautstärken, mindestens 1).
 */
export function valuesToPath(
  values: readonly number[],
  width: number,
  height: number,
  scale = 1,
  baseline: 'middle' | 'bottom' = 'middle'
): string {
  const last = Math.max(values.length - 1, 1)
  const s = scale > 0 ? scale : 1
  return values
    .map((v, i) => {
      const x = (i / last) * width
      const y =
        baseline === 'middle'
          ? height / 2 - (v / s) * (height / 2) * 0.9
          : height - (v / s) * height * 0.9
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}
