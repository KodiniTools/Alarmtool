// Typen zu waveforms.js. Die Datei bleibt JavaScript, weil design-system/build.mjs
// sie direkt in Node importiert (ohne TypeScript-Übersetzung).

/** UI metadata of a selectable waveform; `svgPath` draws the icon in a 40x20 viewBox. */
export interface WaveTypeInfo {
  value: string
  labelKey: string
  abbr: string
  svgPath: string
}

export const WAVE_TYPES: WaveTypeInfo[]

/** waveType -> short badge label, e.g. { sine: 'SIN', ... } */
export const WAVE_ABBR: Record<string, string>

/** Returns the (cached) PeriodicWave for a custom waveform, or null for native/unknown types. */
export function getPeriodicWave(
  audioCtx: BaseAudioContext | null | undefined,
  waveType: string
): PeriodicWave | null

/**
 * Applies a waveType to an OscillatorNode — native types via `osc.type`,
 * custom types via `setPeriodicWave`. Unknown values fall back to sine.
 */
export function applyWaveType(
  osc: OscillatorNode | null | undefined,
  audioCtx: BaseAudioContext | null | undefined,
  waveType: string
): void
