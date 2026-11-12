/**
 * Bereiche, Startwerte und Text-Schlüssel des globalen Audio-Filters je Filtertyp.
 */

/** Startwerte und Grenzen eines Filtertyps (Frequenz in Hz, Q dimensionslos). */
export interface FilterTypeConfig {
  frequency: number
  Q: number
  freqMin: number
  freqMax: number
  qMin: number
  qMax: number
  qStep: number
}

export type FilterType = 'lowpass' | 'highpass' | 'bandpass' | 'notch'

/** Startwerte und Grenzen je Filtertyp. */
export const FILTER_DEFAULTS: Readonly<Record<FilterType, FilterTypeConfig>> = Object.freeze({
  lowpass: { frequency: 2000, Q: 1, freqMin: 20, freqMax: 20000, qMin: 0.1, qMax: 20, qStep: 0.1 },
  highpass: { frequency: 200, Q: 1, freqMin: 20, freqMax: 20000, qMin: 0.1, qMax: 20, qStep: 0.1 },
  bandpass: { frequency: 1000, Q: 5, freqMin: 20, freqMax: 20000, qMin: 0.5, qMax: 30, qStep: 0.5 },
  notch: { frequency: 1000, Q: 10, freqMin: 20, freqMax: 20000, qMin: 1, qMax: 50, qStep: 1 },
})

/** Grenzen des Typs; unbekannte Typen (auch 'none') bekommen die Tiefpass-Grenzen. */
export function filterLimits(type: string): FilterTypeConfig {
  return FILTER_DEFAULTS[type as FilterType] || FILTER_DEFAULTS.lowpass
}

/** Texte, die je Filtertyp wechseln. */
export type FilterText = 'frequencyLabel' | 'frequencyHelp' | 'qLabel' | 'qHelp'

/** i18n-Schlüssel je Filtertyp; `fallback` gilt für unbekannte Typen. */
export const FILTER_TEXT_KEYS: Readonly<
  Record<FilterText, Readonly<Record<FilterType | 'fallback', string>>>
> = Object.freeze({
  frequencyLabel: {
    lowpass: 'filter_freq_cutoff',
    highpass: 'filter_freq_cutoff',
    bandpass: 'filter_freq_center',
    notch: 'filter_freq_notch',
    fallback: 'filter_frequency',
  },
  frequencyHelp: {
    lowpass: 'filter_freq_help_lowpass',
    highpass: 'filter_freq_help_highpass',
    bandpass: 'filter_freq_help_bandpass',
    notch: 'filter_freq_help_notch',
    fallback: 'filter_freq_help',
  },
  qLabel: {
    lowpass: 'filter_q_resonance',
    highpass: 'filter_q_resonance',
    bandpass: 'filter_q_bandwidth',
    notch: 'filter_q_width',
    fallback: 'filter_q',
  },
  qHelp: {
    lowpass: 'filter_q_help_lowpass',
    highpass: 'filter_q_help_highpass',
    bandpass: 'filter_q_help_bandpass',
    notch: 'filter_q_help_notch',
    fallback: 'filter_q_help',
  },
})

/** i18n-Schlüssel eines Textes für einen Filtertyp; unbekannte Typen bekommen `fallback`. */
export function filterTextKey(text: FilterText, type: string): string {
  const keys = FILTER_TEXT_KEYS[text]
  return Object.hasOwn(keys, type) && type !== 'fallback' ? keys[type as FilterType] : keys.fallback
}
