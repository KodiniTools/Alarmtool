// Wellenformen als Zahlenwerte für den Visualizer (GlowScope), ohne Web Audio.
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
