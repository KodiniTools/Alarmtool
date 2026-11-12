import { useAlarmStore } from '@/stores/alarmStore'
import { translations } from './translations'

export type { Lang } from './translations'

export { DEFAULT_LANG, SUPPORTED_LANGS, normalizeLang } from './locale'

/** Looks up `key` for `lang`; falls back to the key itself. */
export function translate(lang: string, key: string): string {
  const dict = translations[lang as keyof typeof translations] as Record<string, string> | undefined
  return dict?.[key] || key
}

/**
 * Translation helper bound to the current UI language. Reading
 * `store.currentLang` inside `t` keeps templates reactive to language changes.
 */
export function useI18n() {
  const store = useAlarmStore()
  const t = (key: string): string => translate(store.currentLang, key)
  return { t }
}
