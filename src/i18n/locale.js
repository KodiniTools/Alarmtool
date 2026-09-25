// Locale helpers without store dependencies (safe to import from stores).
import { translations } from './translations'

export const DEFAULT_LANG = 'de'

/** Languages with a translation table, e.g. ['de', 'en']. */
export const SUPPORTED_LANGS = Object.keys(translations)

/**
 * Maps a locale such as 'en', 'EN' or 'en-US' to a supported language code.
 * @param {unknown} locale
 * @returns {string | null} the language code, or null if unsupported
 */
export function normalizeLang(locale) {
  if (typeof locale !== 'string') return null
  const lang = locale.trim().toLowerCase().split('-')[0]
  return SUPPORTED_LANGS.includes(lang) ? lang : null
}
