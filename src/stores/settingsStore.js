import { defineStore } from 'pinia'
import { ref } from 'vue'
import { DEFAULT_FILTER } from '@/lib/oscillatorDefaults'

// localStorage can throw (private mode, blocked storage) — never let that
// break the app; the preference then simply isn't persisted.
function persist(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* storage unavailable */
  }
}

export const useSettingsStore = defineStore('settings', () => {
  const currentLang = ref(localStorage.getItem('locale') || 'de')
  const currentTheme = ref(localStorage.getItem('theme') || 'dark')
  const filterSettings = ref({ ...DEFAULT_FILTER })

  function setLanguage(lang) {
    currentLang.value = lang
    persist('locale', lang)
  }

  function setTheme(theme) {
    currentTheme.value = theme
    persist('theme', theme)
  }

  function updateFilterSettings(patch) {
    filterSettings.value = { ...filterSettings.value, ...patch }
  }

  return { currentLang, currentTheme, filterSettings, setLanguage, setTheme, updateFilterSettings }
})
