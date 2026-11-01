import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { DEFAULT_FILTER } from '@/lib/oscillatorDefaults'
import { DEFAULT_LANG, normalizeLang } from '@/i18n/locale'
import { applyLocaleHead } from '@/utils/localeSeo'

export const SITE_URL = 'https://kodinitools.com/alarmtool/'

/** Title and description per language (German is also static in index.html). */
export const PAGE_META = {
  de: {
    title: 'Online Alarmton Generator – Töne erzeugen, gestalten & exportieren | KodiniTools',
    description:
      'Erstelle und gestalte individuelle Alarmtöne direkt im Browser. Mehrere Oszillatoren, Filter, ADSR-Hüllkurve und Aufnahmefunktion – kostenlos, ohne Installation.',
  },
  en: {
    title: 'Online Alarm Sound Generator – Create, Shape & Export Tones | KodiniTools',
    description:
      'Create and shape custom alarm sounds right in your browser. Multiple oscillators, filters, ADSR envelope and recording – free, no installation.',
  },
}

const STORAGE_KEYS = { lang: 'locale', theme: 'theme' }

export const DEFAULT_THEME = 'dark'
export const SUPPORTED_THEMES = ['dark', 'light']

/** @returns {string | null} the theme if supported, otherwise null */
export function normalizeTheme(theme) {
  return SUPPORTED_THEMES.includes(theme) ? theme : null
}

// localStorage can throw (private mode, blocked storage) — never let that
// break the app; the preference then simply isn't read/persisted.
function readStorage(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function persist(key, value) {
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
  const currentLang = ref(urlLang ?? normalizeLang(readStorage(STORAGE_KEYS.lang)) ?? DEFAULT_LANG)
  // Persist so the SSI navigation shows the same language
  if (urlLang) persist(STORAGE_KEYS.lang, urlLang)
  const currentTheme = ref(normalizeTheme(readStorage(STORAGE_KEYS.theme)) ?? DEFAULT_THEME)
  const filterSettings = ref({ ...DEFAULT_FILTER })

  /** Sets the UI language ('en-US' → 'en'); unsupported values are ignored. */
  function setLanguage(locale) {
    const lang = normalizeLang(locale)
    if (!lang) return
    currentLang.value = lang
    persist(STORAGE_KEYS.lang, lang)
  }

  /** Sets the theme; unsupported values are ignored. */
  function setTheme(value) {
    const theme = normalizeTheme(value)
    if (!theme) return
    currentTheme.value = theme
    persist(STORAGE_KEYS.theme, theme)
  }

  // <html lang>, title, canonical (EN = ?lang=en) and hreflang follow the language.
  // Without ?lang the static German head stays until the language changes, so
  // App.vue can still adopt the lang attribute set by the SSI nav.
  const applyHead = (lang) => applyLocaleHead(SITE_URL, lang, PAGE_META[lang])
  watch(currentLang, applyHead)
  if (urlLang) applyHead(urlLang)

  function updateFilterSettings(patch) {
    filterSettings.value = { ...filterSettings.value, ...patch }
  }

  return { currentLang, currentTheme, filterSettings, setLanguage, setTheme, updateFilterSettings }
})
