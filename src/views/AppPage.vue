<template>
  <div class="main-container">
    <!-- App Header -->
    <div class="app-header">
      <h1 class="app-title">{{ t('app_title') }}</h1>
      <p class="app-subtitle">{{ t('app_subtitle') }}</p>
    </div>

    <!-- Tabs -->
    <div ref="tabsEl" class="tabs">
      <!-- Back to the landing page (router, no reload) -->
      <RouterLink
        class="tab-btn tab-btn--home"
        :to="PAGE_PATHS.landing"
        :title="t('tab_home_title')"
      >
        <i class="fas fa-house" aria-hidden="true"></i>
        <span>{{ t('tab_home') }}</span>
      </RouterLink>
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
      <!-- External blog article — styled like a tab, opens in a new window -->
      <a
        class="tab-btn tab-btn--link"
        :href="BLOG_URL"
        target="_blank"
        rel="noopener noreferrer"
        :title="t('tab_blog_title')"
      >
        <i class="fas fa-blog"></i>
        <span>{{ t('tab_blog') }}</span>
      </a>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- Filter Tab -->
      <div v-show="activeTab === 'filter'" class="section section-narrow">
        <FilterControl />
        <!-- Save options: same menu as in the oscillator sidebar -->
        <CollapsibleSection
          class="filter-save-options"
          :title="t('settings_menu_title')"
          icon="fas fa-save"
        >
          <SettingsPanel />
        </CollapsibleSection>
      </div>

      <!-- Oscillators Tab -->
      <div v-show="activeTab === 'oscillators'" class="section">
        <OscillatorScope />
        <OscillatorGrid />
      </div>

      <!-- Recording Tab -->
      <div v-show="activeTab === 'recording'" class="section section-narrow">
        <RecorderControl />
      </div>

      <!-- Presets Tab -->
      <div v-show="activeTab === 'presets'" class="section section-narrow">
        <PresetsSection @navigate="openTab" />
      </div>

      <!-- FAQ Tab -->
      <div v-show="activeTab === 'faq'" class="section section-narrow">
        <FAQSection />
      </div>
    </div>

    <ToastContainer />

    <!-- Hearing-safety warning — sits just above the sticky player bar -->
    <HearingWarning />

    <!-- Sticky player bar — always visible, independent of the active tab -->
    <div ref="playerBar" class="player-bar">
      <div class="player-bar__inner">
        <PlayerControl />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import { RouterLink } from 'vue-router'
  import { useI18n } from '@/i18n'
  import { PAGE_PATHS } from '@/lib/pageMeta'
  import { usePlayer } from '@/composables/usePlayer'

  import FilterControl from '@/components/FilterControl.vue'
  import OscillatorGrid from '@/components/OscillatorGrid.vue'
  import OscillatorScope from '@/components/oscillator/OscillatorScope.vue'
  import RecorderControl from '@/components/RecorderControl.vue'
  import PresetsSection from '@/components/PresetsSection.vue'
  import FAQSection from '@/components/FAQSection.vue'
  import PlayerControl from '@/components/PlayerControl.vue'
  import ToastContainer from '@/components/ToastContainer.vue'
  import HearingWarning from '@/components/HearingWarning.vue'
  import SettingsPanel from '@/components/SettingsPanel.vue'
  import CollapsibleSection from '@/components/ui/CollapsibleSection.vue'

  const { handleKeyboard, stopAlarm } = usePlayer()

  // Sticky player bar: reserve exactly its height at the bottom so it never
  // covers page content, regardless of locale/wrapping.
  const playerBar = ref<HTMLElement | null>(null)
  let barResizeObserver: ResizeObserver | null = null

  const updatePlayerBarHeight = () => {
    const h = playerBar.value?.offsetHeight ?? 0
    document.documentElement.style.setProperty('--player-bar-height', `${h}px`)
  }

  const activeTab = ref('filter')
  const tabsEl = ref<HTMLElement | null>(null)

  // Switch tabs from inside a section (e.g. preset "Edit"/"Record") and bring
  // the tab bar back into view, since the user may have scrolled down the list.
  const openTab = (id: string) => {
    activeTab.value = id
    tabsEl.value?.scrollIntoView?.({ block: 'start', behavior: 'smooth' })
  }
  const tabs = [
    { id: 'filter', label: 'tab_filter', icon: 'fas fa-filter' },
    { id: 'oscillators', label: 'tab_oscillators', icon: 'fas fa-wave-square' },
    { id: 'recording', label: 'tab_recording', icon: 'fas fa-microphone' },
    { id: 'presets', label: 'tab_presets', icon: 'fas fa-music' },
    { id: 'faq', label: 'tab_faq', icon: 'fas fa-question-circle' },
  ]

  const BLOG_URL = 'https://kodinitools.com/blog/alarmtool-eigener-alarmton/'

  const { t } = useI18n()

  onMounted(() => {
    // Add keyboard event listener
    document.addEventListener('keydown', handleKeyboard)

    // Keep the reserved space in sync with the sticky player bar's height
    updatePlayerBarHeight()
    if (window.ResizeObserver && playerBar.value) {
      barResizeObserver = new ResizeObserver(updatePlayerBarHeight)
      barResizeObserver.observe(playerBar.value)
    }
    window.addEventListener('resize', updatePlayerBarHeight)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyboard)
    // Leaving for the landing page (router): no sound without a visible player bar
    stopAlarm()

    if (barResizeObserver) barResizeObserver.disconnect()
    window.removeEventListener('resize', updatePlayerBarHeight)
    document.documentElement.style.removeProperty('--player-bar-height')
  })
</script>
