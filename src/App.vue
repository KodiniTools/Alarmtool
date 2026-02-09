<template>
  <div class="main-container">
    <!-- App Header -->
    <div class="app-header">
      <h1 class="app-title">{{ t('app_title') }}</h1>
      <p class="app-subtitle">{{ t('app_subtitle') }}</p>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-btn"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        <i :class="tab.icon"></i>
        <span>{{ t(tab.label) }}</span>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- Filter Tab -->
      <div v-show="activeTab === 'filter'" class="section section-narrow">
        <FilterControl />
      </div>

      <!-- Oscillators Tab -->
      <div v-show="activeTab === 'oscillators'" class="section">
        <OscillatorGrid />
      </div>

      <!-- Recording Tab -->
      <div v-show="activeTab === 'recording'" class="section section-narrow">
        <RecorderControl />
      </div>

      <!-- Presets Tab -->
      <div v-show="activeTab === 'presets'" class="section section-narrow">
        <PresetsSection />
      </div>

      <!-- FAQ Tab -->
      <div v-show="activeTab === 'faq'" class="section section-narrow">
        <FAQSection />
      </div>
    </div>

    <!-- Settings Management -->
    <div class="section section-narrow">
      <SettingsPanel />
    </div>

    <!-- Media Player -->
    <div class="section section-narrow">
      <PlayerControl />
    </div>

    <!-- Donate Button -->
    <DonateButton />

    <!-- Footer -->
    <AppFooter @openCookieSettings="openCookieSettings" />
    <CookieBanner ref="cookieBannerRef" />
    <ToastContainer />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAlarmStore } from '@/stores/alarmStore'
import { translations } from '@/i18n/translations'
import { usePlayer } from '@/composables/usePlayer'

import FilterControl from '@/components/FilterControl.vue'
import OscillatorGrid from '@/components/OscillatorGrid.vue'
import RecorderControl from '@/components/RecorderControl.vue'
import PresetsSection from '@/components/PresetsSection.vue'
import FAQSection from '@/components/FAQSection.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'
import PlayerControl from '@/components/PlayerControl.vue'
import DonateButton from '@/components/DonateButton.vue'
import AppFooter from '@/components/AppFooter.vue'
import CookieBanner from '@/components/CookieBanner.vue'
import ToastContainer from '@/components/ToastContainer.vue'

const store = useAlarmStore()
const { handleKeyboard } = usePlayer()

const activeTab = ref('filter')
const cookieBannerRef = ref(null)

const openCookieSettings = () => {
  cookieBannerRef.value?.openSettings()
}

const tabs = [
  { id: 'filter', label: 'tab_filter', icon: 'fas fa-filter' },
  { id: 'oscillators', label: 'tab_oscillators', icon: 'fas fa-wave-square' },
  { id: 'recording', label: 'tab_recording', icon: 'fas fa-microphone' },
  { id: 'presets', label: 'tab_presets', icon: 'fas fa-music' },
  { id: 'faq', label: 'tab_faq', icon: 'fas fa-question-circle' }
]

// Translation helper
const t = (key) => {
  return translations[store.currentLang]?.[key] || key
}

// SSI nav event handlers
const onLanguageChanged = (e) => {
  if (e.detail?.lang) {
    store.setLanguage(e.detail.lang)
  }
}

const onThemeChanged = (e) => {
  if (e.detail?.theme) {
    store.setTheme(e.detail.theme)
  }
}

onMounted(() => {
  // Sync with SSI nav's current state (it may have initialized before Vue)
  const ssiTheme = document.documentElement.getAttribute('data-theme')
  if (ssiTheme) {
    store.currentTheme = ssiTheme
  }
  const ssiLang = document.documentElement.getAttribute('lang')
  if (ssiLang && (ssiLang === 'de' || ssiLang === 'en')) {
    store.currentLang = ssiLang
  }

  // Listen for SSI nav language/theme changes
  window.addEventListener('language-changed', onLanguageChanged)
  window.addEventListener('theme-changed', onThemeChanged)

  // Add keyboard event listener
  document.addEventListener('keydown', handleKeyboard)

  console.log('Alarm Tool Vue initialized')
})

onUnmounted(() => {
  window.removeEventListener('language-changed', onLanguageChanged)
  window.removeEventListener('theme-changed', onThemeChanged)
  document.removeEventListener('keydown', handleKeyboard)
})
</script>
