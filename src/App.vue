<template>
  <div class="main-container">
    <!-- Top Toolbar -->
    <TopToolbar />

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
      <div v-show="activeTab === 'filter'" class="section">
        <FilterControl />
      </div>

      <!-- Oscillators Tab -->
      <div v-show="activeTab === 'oscillators'" class="section">
        <OscillatorGrid />
      </div>

      <!-- Recording Tab -->
      <div v-show="activeTab === 'recording'" class="section">
        <RecorderControl />
      </div>

      <!-- FAQ Tab -->
      <div v-show="activeTab === 'faq'" class="section">
        <FAQSection />
      </div>
    </div>

    <!-- Settings Management -->
    <div class="section">
      <SettingsPanel />
    </div>

    <!-- Media Player -->
    <div class="section">
      <PlayerControl />
    </div>

    <!-- Donate Button -->
    <DonateButton />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAlarmStore } from '@/stores/alarmStore'
import { translations } from '@/i18n/translations'
import { usePlayer } from '@/composables/usePlayer'

import TopToolbar from '@/components/TopToolbar.vue'
import FilterControl from '@/components/FilterControl.vue'
import OscillatorGrid from '@/components/OscillatorGrid.vue'
import RecorderControl from '@/components/RecorderControl.vue'
import FAQSection from '@/components/FAQSection.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'
import PlayerControl from '@/components/PlayerControl.vue'
import DonateButton from '@/components/DonateButton.vue'

const store = useAlarmStore()
const { handleKeyboard } = usePlayer()

const activeTab = ref('filter')

const tabs = [
  { id: 'filter', label: 'tab_filter', icon: 'fas fa-filter' },
  { id: 'oscillators', label: 'tab_oscillators', icon: 'fas fa-wave-square' },
  { id: 'recording', label: 'tab_recording', icon: 'fas fa-microphone' },
  { id: 'faq', label: 'tab_faq', icon: 'fas fa-question-circle' }
]

// Translation helper
const t = (key) => {
  return translations[store.currentLang]?.[key] || key
}

onMounted(() => {
  // Set theme on mount
  document.body.setAttribute('data-theme', store.currentTheme)

  // Apply saved background color
  if (store.backgroundColor) {
    document.body.style.background = store.backgroundColor
  }

  // Add keyboard event listener
  document.addEventListener('keydown', handleKeyboard)

  console.log('Alarm Tool Vue initialized')
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyboard)
})
</script>
