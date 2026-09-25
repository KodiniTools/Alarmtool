// Single source of truth for oscillator/filter defaults and the set of
// per-oscillator sound parameters (shared by store, presets, undo, clipboard,
// settings export/import).

export const OSCILLATOR_COUNT = 12

/** Oscillators enabled after a fresh start / reset. */
export const DEFAULT_ENABLED_COUNT = 3

export const DEFAULT_OSCILLATOR = Object.freeze({
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

export const DEFAULT_FILTER = Object.freeze({ type: 'none', frequency: 1000, Q: 1 })

/** Sound parameters of an oscillator (everything except `id` / `enabled`). */
export const OSC_PARAMS = Object.keys(DEFAULT_OSCILLATOR)

/**
 * Copies only the sound parameters of an oscillator, in OSC_PARAMS order.
 * @param {object} osc
 * @returns {object}
 */
export function pickOscParams(osc) {
  return Object.fromEntries(OSC_PARAMS.map((p) => [p, osc[p]]))
}

/**
 * Like pickOscParams, but fills in decay/sustain for settings that predate the
 * ADSR envelope (older exports and preset definitions omit them).
 * @param {object} settings
 * @returns {object}
 */
export function normalizeOscSettings(settings) {
  return {
    ...pickOscParams(settings),
    decay: settings.decay ?? DEFAULT_OSCILLATOR.decay,
    sustain: settings.sustain ?? DEFAULT_OSCILLATOR.sustain,
  }
}
