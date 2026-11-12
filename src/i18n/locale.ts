// Locale helpers without store dependencies (safe to import from stores).
import { translations, type Lang } from './translations'

export type { Lang }

export const DEFAULT_LANG: Lang = 'de'

/** Languages with a translation table, e.g. ['de', 'en']. */
export const SUPPORTED_LANGS = Object.keys(translations) as Lang[]

/**
 * Maps a locale such as 'en', 'EN' or 'en-US' to a supported language code;
 * null if unsupported.
 */
export function normalizeLang(locale: unknown): Lang | null {
  if (typeof locale !== 'string') return null
  const lang = locale.trim().toLowerCase().split('-')[0]
  return (SUPPORTED_LANGS as string[]).includes(lang) ? (lang as Lang) : null
}
