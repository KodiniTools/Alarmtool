import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const currentLang = ref(localStorage.getItem('locale') || 'de')
  const currentTheme = ref(localStorage.getItem('theme') || 'dark')
  const filterSettings = ref({ type: 'none', frequency: 1000, Q: 1 })

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
