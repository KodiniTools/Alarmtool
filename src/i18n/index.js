import { useAlarmStore } from '@/stores/alarmStore'
import { translations } from './translations'

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

/** Looks up `key` for `lang`; falls back to the key itself. */
export function translate(lang, key) {
  return translations[lang]?.[key] || key
}

/**
 * Translation helper bound to the current UI language. Reading
 * `store.currentLang` inside `t` keeps templates reactive to language changes.
 */
export function useI18n() {
  const store = useAlarmStore()
  const t = (key) => translate(store.currentLang, key)
  return { t }
}
