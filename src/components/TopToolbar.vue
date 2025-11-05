<template>
  <div class="top-toolbar">
    <!-- Language Switcher -->
    <div class="switcher-group language-switcher">
      <button
        class="switcher-btn"
        :class="{ active: store.currentLang === 'de' }"
        @click="store.setLanguage('de')"
      >
        <i class="fas fa-globe"></i>
        <span>DE</span>
      </button>
      <button
        class="switcher-btn"
        :class="{ active: store.currentLang === 'en' }"
        @click="store.setLanguage('en')"
      >
        <i class="fas fa-globe"></i>
        <span>EN</span>
      </button>
    </div>

    <div class="switcher-divider"></div>

    <!-- Theme Switcher -->
    <div class="switcher-group theme-switcher">
      <button
        class="switcher-btn"
        :class="{ active: store.currentTheme === 'dark' }"
        @click="store.setTheme('dark')"
        title="Dark Mode"
      >
        <i class="fas fa-moon"></i>
      </button>
      <button
        class="switcher-btn"
        :class="{ active: store.currentTheme === 'light' }"
        @click="store.setTheme('light')"
        title="Light Mode"
      >
        <i class="fas fa-sun"></i>
      </button>
    </div>

    <div class="switcher-divider"></div>

    <!-- Background Color Picker -->
    <div class="color-picker-group">
      <label for="bgColorPicker" class="color-picker-label" :title="t('bg_color_tooltip')">
        <i class="fas fa-palette"></i>
      </label>
      <input
        type="color"
        id="bgColorPicker"
        class="color-picker-input"
        :value="store.backgroundColor || '#0b1020'"
        @input="handleColorChange"
        :title="t('bg_color_tooltip')"
      />
      <button
        v-if="store.backgroundColor"
        class="color-reset-btn"
        @click="resetColor"
        :title="t('bg_color_reset')"
      >
        <i class="fas fa-undo"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useAlarmStore } from '@/stores/alarmStore'
import { translations } from '@/i18n/translations'

const store = useAlarmStore()

// Translation helper
const t = (key) => {
  return translations[store.currentLang]?.[key] || key
}

// Color picker handlers
const handleColorChange = (event) => {
  store.setBackgroundColor(event.target.value)
}

const resetColor = () => {
  store.setBackgroundColor('')
}
</script>

<style scoped>
.color-picker-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-picker-label {
  color: var(--titaniumgraphite-5);
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  transition: color 0.3s ease;
}

.color-picker-label:hover {
  color: var(--titaniumgraphite-3);
}

.color-picker-input {
  width: 40px;
  height: 32px;
  border: 2px solid rgba(184, 184, 184, 0.3);
  border-radius: 8px;
  cursor: pointer;
  background: transparent;
  transition: all 0.3s ease;
}

.color-picker-input:hover {
  border-color: var(--titaniumgraphite-1);
  transform: scale(1.05);
}

.color-reset-btn {
  background: transparent;
  border: 1px solid rgba(184, 184, 184, 0.3);
  color: var(--titaniumgraphite-5);
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.color-reset-btn:hover {
  background: rgba(184, 184, 184, 0.1);
  color: var(--titaniumgraphite-3);
  border-color: var(--titaniumgraphite-1);
}
</style>
