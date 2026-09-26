<template>
  <div class="osc-master-detail">
    <!-- Left: sidebar -->
    <aside class="osc-sidebar" :aria-label="t('osc_sidebar_title')">
      <header class="osc-sidebar-header">
        <h2 class="osc-sidebar-title">
          <i class="fas fa-wave-square" aria-hidden="true"></i>
          {{ t('osc_sidebar_title') }}
        </h2>
        <span class="osc-active-badge">
          {{ activeCount }}/{{ store.oscillators.length }} {{ t('osc_active_suffix') }}
        </span>
      </header>

      <HistoryControls />

      <CollapsibleSection
        :title="t('osc_select_title')"
        icon="fas fa-list-ul"
        :summary="selectedLabel"
        default-open
      >
        <nav class="osc-list">
          <OscillatorListRow
            v-for="(osc, index) in store.oscillators"
            :key="index"
            :oscillator-id="index"
            :oscillator="osc"
            :selected="selectedId === index"
            @select="selectedId = index"
            @toggle-enabled="handleToggleEnabled(index, $event)"
          />
        </nav>
      </CollapsibleSection>

      <CollapsibleSection :title="t('settings_menu_title')" icon="fas fa-save">
        <SettingsPanel />
      </CollapsibleSection>
    </aside>

    <!-- Right: Editor panel -->
    <div class="osc-editor-panel">
      <OscillatorItem
        v-if="selectedOscillator"
        :key="selectedId"
        :oscillator-id="selectedId"
        :oscillator="selectedOscillator"
      />
      <div v-else class="osc-editor-placeholder">
        <i class="fas fa-wave-square"></i>
        <p>{{ t('osc_editor_placeholder') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { useAlarmStore } from '@/stores/alarmStore'
  import { useOscillators } from '@/composables/useOscillators'
  import { useI18n } from '@/i18n'
  import OscillatorItem from './OscillatorItem.vue'
  import OscillatorListRow from './oscillator/OscillatorListRow.vue'
  import HistoryControls from './oscillator/HistoryControls.vue'
  import CollapsibleSection from './ui/CollapsibleSection.vue'
  import SettingsPanel from './SettingsPanel.vue'

  const store = useAlarmStore()
  const { updateOscillatorParameter } = useOscillators()
  const { t } = useI18n()

  const selectedId = ref(0)
  const selectedOscillator = computed(() => store.oscillators[selectedId.value] ?? null)
  const selectedLabel = computed(() => `${t('osc_title_prefix')} ${selectedId.value + 1}`)
  const activeCount = computed(() => store.oscillators.filter((o) => o.enabled).length)

  function handleToggleEnabled(index, value) {
    updateOscillatorParameter(index, 'enabled', value)
  }
</script>
