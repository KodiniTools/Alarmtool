import { defineStore } from 'pinia'
import { ref } from 'vue'
import { DEFAULT_FILTER } from '@/lib/oscillatorDefaults'

export const useSettingsStore = defineStore('settings', () => {
  const currentLang = ref(localStorage.getItem('locale') || 'de')
  const currentTheme = ref(localStorage.getItem('theme') || 'dark')
  const filterSettings = ref({ ...DEFAULT_FILTER })

  function setLanguage(lang) {
    currentLang.value = lang
    localStorage.setItem('locale', lang)
  }

  function setTheme(theme) {
    currentTheme.value = theme
    localStorage.setItem('theme', theme)
  }

  function updateFilterSettings(patch) {
    filterSettings.value = { ...filterSettings.value, ...patch }
  }

  return { currentLang, currentTheme, filterSettings, setLanguage, setTheme, updateFilterSettings }
})
