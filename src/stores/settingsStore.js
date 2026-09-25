import { defineStore } from 'pinia'
import { ref } from 'vue'
import { DEFAULT_FILTER } from '@/lib/oscillatorDefaults'
import { DEFAULT_LANG, normalizeLang } from '@/i18n/locale'

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
  // Stored values may be stale or tampered with — fall back to defaults.
  const currentLang = ref(normalizeLang(readStorage(STORAGE_KEYS.lang)) ?? DEFAULT_LANG)
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

  function updateFilterSettings(patch) {
    filterSettings.value = { ...filterSettings.value, ...patch }
  }

  return { currentLang, currentTheme, filterSettings, setLanguage, setTheme, updateFilterSettings }
})
