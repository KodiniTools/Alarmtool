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
  </div>
</template>

<script setup>
import { useAlarmStore } from '@/stores/alarmStore'

const store = useAlarmStore()
</script>
