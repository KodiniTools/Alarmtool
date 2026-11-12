import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { DEFAULT_FILTER, type FilterSettings } from '@/lib/oscillatorDefaults'
import { DEFAULT_LANG, normalizeLang, type Lang } from '@/i18n/locale'
import { applyLocaleHead, type PageMeta } from '@/utils/localeSeo'
import { PAGE_META as ALL_PAGE_META, pageUrl, type Page } from '@/lib/pageMeta'

export { SITE_URL } from '@/lib/pageMeta'
export type { Page } from '@/lib/pageMeta'

/** Title and description of the landing page per language (German is also static in index.html). */
export const PAGE_META: Record<Lang, PageMeta> = ALL_PAGE_META.landing

const STORAGE_KEYS = { lang: 'locale', theme: 'theme' }

export type Theme = 'dark' | 'light'

export const DEFAULT_THEME: Theme = 'dark'
export const SUPPORTED_THEMES: Theme[] = ['dark', 'light']

/** The theme if supported, otherwise null. */
export function normalizeTheme(theme: unknown): Theme | null {
  return (SUPPORTED_THEMES as unknown[]).includes(theme) ? (theme as Theme) : null
}

// localStorage can throw (private mode, blocked storage) — never let that
// break the app; the preference then simply isn't read/persisted.
function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function persist(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* storage unavailable */
  }
}

export const useSettingsStore = defineStore('settings', () => {
  // ?lang=de|en (hreflang target) wins over the stored value; stored values may
  // be stale or tampered with — fall back to defaults.
  const urlLang = normalizeLang(new URLSearchParams(globalThis.location?.search ?? '').get('lang'))
  const currentLang = ref<Lang>(
    urlLang ?? normalizeLang(readStorage(STORAGE_KEYS.lang)) ?? DEFAULT_LANG
  )
  // Persist so the SSI navigation shows the same language
  if (urlLang) persist(STORAGE_KEYS.lang, urlLang)
  const currentTheme = ref<Theme>(normalizeTheme(readStorage(STORAGE_KEYS.theme)) ?? DEFAULT_THEME)
  const filterSettings = ref<FilterSettings>({ ...DEFAULT_FILTER })
  /** Current router page; set by the router (main.ts), drives canonical, title and description. */
  const currentPage = ref<Page>('landing')

  /** Sets the UI language ('en-US' → 'en'); unsupported values are ignored. */
  function setLanguage(locale: unknown) {
    const lang = normalizeLang(locale)
    if (!lang) return
    currentLang.value = lang
    persist(STORAGE_KEYS.lang, lang)
  }

  /** Sets the theme; unsupported values are ignored. */
  function setTheme(value: unknown) {
    const theme = normalizeTheme(value)
    if (!theme) return
    currentTheme.value = theme
    persist(STORAGE_KEYS.theme, theme)
  }

  /** Sets the current page; unknown values are ignored. */
  function setPage(page: unknown) {
    if (page === 'landing' || page === 'app') currentPage.value = page
  }

  // <html lang>, title, canonical (EN = ?lang=en) and hreflang follow language and page.
  // Without ?lang the static German head stays until language or page change, so
  // App.vue can still adopt the lang attribute set by the SSI nav.
  const applyHead = () =>
    applyLocaleHead(
      pageUrl(currentPage.value),
      currentLang.value,
      ALL_PAGE_META[currentPage.value][currentLang.value]
    )
  watch([currentLang, currentPage], applyHead)
  if (urlLang) applyHead()

  function updateFilterSettings(patch: Partial<FilterSettings>) {
    filterSettings.value = { ...filterSettings.value, ...patch }
  }

  return {
    currentLang,
    currentTheme,
    currentPage,
    filterSettings,
    setLanguage,
    setTheme,
    setPage,
    updateFilterSettings,
  }
})
