// Single source of truth for oscillator/filter defaults and the set of
// per-oscillator sound parameters (shared by store, presets, undo, clipboard,
// settings export/import).

export const OSCILLATOR_COUNT = 12

/** Oscillators enabled after a fresh start / reset. */
export const DEFAULT_ENABLED_COUNT = 3

/** Sound parameters of one oscillator. */
export interface OscParams {
  waveType: string
  frequency: number
  volume: number
  pan: number
  attack: number
  decay: number
  sustain: number
  release: number
  pattern: string
}

export type OscParam = keyof OscParams

export interface FilterSettings {
  type: string
  frequency: number
  Q: number
}

export const DEFAULT_OSCILLATOR: Readonly<OscParams> = Object.freeze({
  waveType: 'sine',
  frequency: 440,
  volume: 0.5,
  pan: 0,
  attack: 20,
  decay: 50,
  sustain: 0.8,
  release: 80,
  pattern: '1500,300',
})

export const DEFAULT_FILTER: Readonly<FilterSettings> = Object.freeze({
  type: 'none',
  frequency: 1000,
  Q: 1,
})

/**
 * Saved or imported sound (localStorage, JSON export, preset data). Comes from
 * outside, so every part is optional; older files lack decay/sustain.
 */
export interface SoundSettings {
  globalFilter?: Partial<FilterSettings>
  oscillators?: Partial<OscParams>[]
}

/** Sound parameters of an oscillator (everything except `id` / `enabled`). */
export const OSC_PARAMS = Object.keys(DEFAULT_OSCILLATOR) as OscParam[]

/** Copies only the sound parameters of an oscillator, in OSC_PARAMS order. */
export function pickOscParams(osc: Partial<OscParams>): OscParams {
  return Object.fromEntries(OSC_PARAMS.map((p) => [p, osc[p]])) as unknown as OscParams
}

/**
 * Like pickOscParams, but fills in decay/sustain for settings that predate the
 * ADSR envelope (older exports and preset definitions omit them).
 */
export function normalizeOscSettings(settings: Partial<OscParams>): OscParams {
  return {
    ...pickOscParams(settings),
    decay: settings.decay ?? DEFAULT_OSCILLATOR.decay,
    sustain: settings.sustain ?? DEFAULT_OSCILLATOR.sustain,
  }
}
