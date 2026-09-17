// Single source of truth for oscillator waveforms.
//
// Web Audio's OscillatorNode natively supports only sine / square / sawtooth / triangle.
// Additional waveforms are synthesised as PeriodicWave (Fourier coefficients) and applied
// via osc.setPeriodicWave(). PeriodicWave objects are cached per AudioContext.

/** Waveforms that OscillatorNode accepts directly via `osc.type`. */
const NATIVE_WAVE_TYPES = new Set(['sine', 'square', 'sawtooth', 'triangle'])

const DEFAULT_WAVE_TYPE = 'sine'

/** Number of harmonics used for the custom pulse wave (band-limited, no aliasing). */
const PULSE_HARMONICS = 64
/** Duty cycle of the pulse wave (0.25 = 25 % high, 75 % low). */
const PULSE_DUTY = 0.25

/** Additive "drawbar" mix for the organ wave: harmonic index -> relative amplitude. */
const ORGAN_PARTIALS = { 1: 1, 2: 0.6, 3: 0.35, 4: 0.25, 6: 0.15, 8: 0.1 }

/**
 * UI metadata for every selectable waveform (order = display order).
 * `svgPath` draws the icon in a 40x20 viewBox.
 */
export const WAVE_TYPES = [
  {
    value: 'sine',
    labelKey: 'osc_wave_sine',
    abbr: 'SIN',
    svgPath: 'M2,10 C8,10 8,2 14,2 C20,2 20,18 26,18 C32,18 32,10 38,10',
  },
  {
    value: 'square',
    labelKey: 'osc_wave_square',
    abbr: 'SQR',
    svgPath: 'M2,10 L2,3 L14,3 L14,17 L26,17 L26,3 L38,3 L38,10',
  },
  {
    value: 'sawtooth',
    labelKey: 'osc_wave_sawtooth',
    abbr: 'SAW',
    svgPath: 'M2,17 L14,3 L14,17 L26,3 L26,17 L38,3',
  },
  {
    value: 'triangle',
    labelKey: 'osc_wave_triangle',
    abbr: 'TRI',
    svgPath: 'M2,10 L8,3 L20,17 L32,3 L38,10',
  },
  {
    value: 'pulse',
    labelKey: 'osc_wave_pulse',
    abbr: 'PLS',
    svgPath: 'M2,17 L2,3 L8,3 L8,17 L26,17 L26,3 L32,3 L32,17 L38,17',
  },
  {
    value: 'organ',
    labelKey: 'osc_wave_organ',
    abbr: 'ORG',
    svgPath:
      'M2,10 C5,4 7,4 10,10 C12,14 14,14 16,10 C19,3 21,3 24,10 C26,15 28,15 30,10 C33,5 35,5 38,10',
  },
]

/** Map waveType -> short badge label, e.g. { sine: 'SIN', ... } */
export const WAVE_ABBR = Object.fromEntries(WAVE_TYPES.map((w) => [w.value, w.abbr]))

/** All valid waveType values. */
export const WAVE_TYPE_VALUES = WAVE_TYPES.map((w) => w.value)

export function isValidWaveType(type) {
  return WAVE_TYPE_VALUES.includes(type)
}

// Fourier series of a pulse wave with duty cycle d (DC component removed):
//   a_n = 2 / (n·π) · sin(n·π·d)   (cosine terms)
function _pulseCoefficients() {
  const real = new Float32Array(PULSE_HARMONICS + 1)
  const imag = new Float32Array(PULSE_HARMONICS + 1)
  for (let n = 1; n <= PULSE_HARMONICS; n++) {
    real[n] = (2 / (n * Math.PI)) * Math.sin(n * Math.PI * PULSE_DUTY)
  }
  return { real, imag }
}

function _organCoefficients() {
  const maxHarmonic = Math.max(...Object.keys(ORGAN_PARTIALS).map(Number))
  const real = new Float32Array(maxHarmonic + 1)
  const imag = new Float32Array(maxHarmonic + 1)
  for (const [harmonic, amplitude] of Object.entries(ORGAN_PARTIALS)) {
    imag[Number(harmonic)] = amplitude
  }
  return { real, imag }
}

const CUSTOM_WAVE_BUILDERS = {
  pulse: _pulseCoefficients,
  organ: _organCoefficients,
}

// WeakMap<AudioContext, Map<waveType, PeriodicWave>> — PeriodicWave is bound to its context.
const _periodicWaveCache = new WeakMap()

/**
 * Returns the (cached) PeriodicWave for a custom waveform, or null for native/unknown types.
 * @param {BaseAudioContext} audioCtx
 * @param {string} waveType
 * @returns {PeriodicWave | null}
 */
export function getPeriodicWave(audioCtx, waveType) {
  const build = CUSTOM_WAVE_BUILDERS[waveType]
  if (!build || !audioCtx) return null

  let ctxCache = _periodicWaveCache.get(audioCtx)
  if (!ctxCache) {
    ctxCache = new Map()
    _periodicWaveCache.set(audioCtx, ctxCache)
  }

  let wave = ctxCache.get(waveType)
  if (!wave) {
    const { real, imag } = build()
    wave = audioCtx.createPeriodicWave(real, imag)
    ctxCache.set(waveType, wave)
  }
  return wave
}

/**
 * Applies a waveType to an OscillatorNode — native types via `osc.type`,
 * custom types via `setPeriodicWave`. Unknown values fall back to sine.
 * @param {OscillatorNode} osc
 * @param {BaseAudioContext} audioCtx
 * @param {string} waveType
 */
export function applyWaveType(osc, audioCtx, waveType) {
  if (!osc) return

  if (NATIVE_WAVE_TYPES.has(waveType)) {
    osc.type = waveType
    return
  }

  const wave = getPeriodicWave(audioCtx, waveType)
  if (wave) {
    osc.setPeriodicWave(wave)
  } else {
    osc.type = DEFAULT_WAVE_TYPE
  }
}
