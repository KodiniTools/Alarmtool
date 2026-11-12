// Wellenformen als Zahlenwerte für Illustrationen (Landing-Page), ohne Web Audio.
// Gleiche Formen wie in waveforms.js: Puls mit 25 % Tastgrad, Orgel als additive
// Mischung derselben Teiltöne.

export type WaveShape = 'sine' | 'square' | 'sawtooth' | 'triangle' | 'pulse' | 'organ'

const ORGAN_PARTIALS: ReadonlyArray<[number, number]> = [
  [1, 1],
  [2, 0.6],
  [3, 0.35],
  [4, 0.25],
  [6, 0.15],
  [8, 0.1],
]
// Höchster Betrag der ungeteilten Orgel-Summe, damit sie wie die anderen in [-1, 1] liegt
const ORGAN_PEAK = (() => {
  let peak = 0
  for (let i = 0; i < 2048; i++) peak = Math.max(peak, Math.abs(organRaw(i / 2048)))
  return peak
})()

function organRaw(phase: number): number {
  return ORGAN_PARTIALS.reduce((sum, [k, a]) => sum + a * Math.sin(2 * Math.PI * k * phase), 0)
}

/** Wert einer Wellenform bei `phase` (Perioden, beliebig) im Bereich [-1, 1]. */
export function waveValue(shape: WaveShape, phase: number): number {
  const p = phase - Math.floor(phase)
  switch (shape) {
    case 'sine':
      return Math.sin(2 * Math.PI * p)
    case 'square':
      return p < 0.5 ? 1 : -1
    case 'sawtooth':
      return 2 * p - 1
    case 'triangle':
      return p < 0.25 ? 4 * p : p < 0.75 ? 2 - 4 * p : 4 * p - 4
    case 'pulse':
      return p < 0.25 ? 1 : -1
    case 'organ':
      return organRaw(p) / ORGAN_PEAK
    default: {
      const unknown: never = shape
      throw new Error(`Unbekannte Wellenform: ${String(unknown)}`)
    }
  }
}

export interface WaveLayer {
  shape: WaveShape
  /** Perioden über die ganze Breite */
  cycles: number
  /** Anteil an der Summe (0–1) */
  gain: number
}

export interface PathOptions {
  width: number
  height: number
  /** Stützstellen über die Breite (mehr = steilere Flanken) */
  samples?: number
  /** Ausschlag als Anteil der halben Höhe */
  amplitude?: number
  /** Hüllkurve 0–1 über die Breite (x = 0–1), Standard konstant 1 */
  envelope?: (x: number) => number
}

function toPath(values: number[], width: number, height: number, amplitude: number): string {
  const mid = height / 2
  const last = Math.max(values.length - 1, 1)
  return values
    .map((v, i) => {
      const x = (i / last) * width
      const y = mid - v * mid * amplitude
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

/** SVG-Pfad (Attribut d) einer Mischung aus Wellenformen, auf [-1, 1] normiert. */
export function mixPath(layers: readonly WaveLayer[], options: PathOptions): string {
  const { width, height, samples = 480, amplitude = 0.8, envelope = () => 1 } = options
  const n = Math.max(2, Math.round(samples))
  const raw: number[] = []
  for (let i = 0; i < n; i++) {
    const x = i / (n - 1)
    raw.push(layers.reduce((sum, l) => sum + l.gain * waveValue(l.shape, x * l.cycles), 0))
  }
  const peak = Math.max(...raw.map(Math.abs)) || 1
  return toPath(
    raw.map((v, i) => (v / peak) * Math.min(1, Math.max(0, envelope(i / (n - 1))))),
    width,
    height,
    amplitude
  )
}

/** SVG-Pfad einer einzelnen Wellenform. */
export function wavePath(shape: WaveShape, cycles: number, options: PathOptions): string {
  return mixPath([{ shape, cycles, gain: 1 }], options)
}

/**
 * Hüllkurve eines An/Aus-Musters über die Breite (x = 0–1): Muster in ms wie in der App
 * („an, aus, an, aus …“), lineare Flanken von `rampMs` am Anfang und Ende jedes An-Abschnitts.
 */
export function patternEnvelope(
  pattern: readonly number[],
  totalMs: number,
  rampMs: number
): (x: number) => number {
  const steps = pattern.filter((ms) => Number.isFinite(ms) && ms > 0)
  const cycle = steps.reduce((a, b) => a + b, 0)
  if (!cycle || totalMs <= 0) return () => 1
  return (x: number) => {
    let t = (x * totalMs) % cycle
    for (let i = 0; i < steps.length; i++) {
      const len = steps[i]
      if (t < len) {
        if (i % 2 === 1) return 0
        const ramp = Math.min(rampMs, len / 2)
        if (ramp <= 0) return 1
        return Math.min(1, t / ramp, (len - t) / ramp)
      }
      t -= len
    }
    return 0
  }
}

/** An-Abschnitte eines Musters als Anteile der Breite, z. B. für Markierungen. */
export function patternSegments(
  pattern: readonly number[],
  totalMs: number
): { start: number; end: number }[] {
  const steps = pattern.filter((ms) => Number.isFinite(ms) && ms > 0)
  const cycle = steps.reduce((a, b) => a + b, 0)
  if (!cycle || totalMs <= 0) return [{ start: 0, end: 1 }]
  const out: { start: number; end: number }[] = []
  let t = 0
  let i = 0
  while (t < totalMs) {
    const k = i % steps.length
    const len = steps[k]
    if (k % 2 === 0) out.push({ start: t / totalMs, end: Math.min(t + len, totalMs) / totalMs })
    t += len
    i++
  }
  return out
}
