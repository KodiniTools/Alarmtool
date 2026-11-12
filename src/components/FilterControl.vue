<template>
  <div>
    <h2>{{ t('filter_title') }}</h2>
    <div class="control-group">
      <!-- Filter Type -->
      <div class="mb-3 param-container">
        <label for="filterType" class="form-label">{{ t('filter_type') }}</label>
        <select
          id="filterType"
          v-model="filterType"
          class="form-select"
          @change="onFilterTypeChange"
        >
          <option value="none">{{ t('filter_none') }}</option>
          <option value="lowpass">{{ t('filter_lowpass') }}</option>
          <option value="highpass">{{ t('filter_highpass') }}</option>
          <option value="bandpass">{{ t('filter_bandpass') }}</option>
          <option value="notch">{{ t('filter_notch') }}</option>
        </select>
      </div>

      <!-- Filter Parameters (only shown when filter is active) -->
      <template v-if="filterType !== 'none'">
        <!-- Filter Frequency -->
        <SliderField
          id="filterFrequency"
          :model-value="filterFrequency"
          :label="frequencyLabel"
          :min="frequencyRange.min"
          :max="frequencyRange.max"
          :step="1"
          :help="frequencyHelp"
          @update:model-value="setFrequency"
        />

        <!-- Filter Q -->
        <SliderField
          id="filterQ"
          :model-value="filterQ"
          :label="qLabel"
          :min="qRange.min"
          :max="qRange.max"
          :step="qRange.step"
          :help="qHelp"
          @update:model-value="setQ"
        />
      </template>

      <!-- Info when no filter selected -->
      <div v-else class="filter-inactive-info">
        <small class="form-text">{{ t('filter_inactive_info') }}</small>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue'
  import { useAlarmStore } from '@/stores/alarmStore'
  import { useAudioContext } from '@/composables/useAudioContext'
  import { useUndoRedo } from '@/composables/useUndoRedo'
  import { useI18n } from '@/i18n'
  import { SliderField } from '@/components/ui'
  import { FILTER_DEFAULTS, filterLimits, filterTextKey } from '@/lib/filterConfig'

  const store = useAlarmStore()
  const { updateFilter: updateAudioFilter } = useAudioContext()
  const { recordChange } = useUndoRedo()

  // Local reactive state
  const filterType = ref(store.filterSettings.type)
  const filterFrequency = ref(store.filterSettings.frequency)
  const filterQ = ref(store.filterSettings.Q)

  const { t } = useI18n()

  const frequencyRange = computed(() => {
    const limits = filterLimits(filterType.value)
    return { min: limits.freqMin, max: limits.freqMax }
  })

  const qRange = computed(() => {
    const limits = filterLimits(filterType.value)
    return { min: limits.qMin, max: limits.qMax, step: limits.qStep }
  })

  const frequencyLabel = computed(() => t(filterTextKey('frequencyLabel', filterType.value)))
  const frequencyHelp = computed(() => t(filterTextKey('frequencyHelp', filterType.value)))
  const qLabel = computed(() => t(filterTextKey('qLabel', filterType.value)))
  const qHelp = computed(() => t(filterTextKey('qHelp', filterType.value)))

  // Watch for store changes (e.g., when loading settings)
  watch(
    () => store.filterSettings,
    (newSettings) => {
      filterType.value = newSettings.type
      filterFrequency.value = newSettings.frequency
      filterQ.value = newSettings.Q
    },
    { deep: true }
  )

  function onFilterTypeChange() {
    // Set default values for the selected filter type
    const defaults = FILTER_DEFAULTS[filterType.value]
    if (filterType.value !== 'none' && defaults) {
      filterFrequency.value = defaults.frequency
      filterQ.value = defaults.Q
    }
    updateFilter()
  }

  function setFrequency(value) {
    filterFrequency.value = value
    updateFilter()
  }

  function setQ(value) {
    filterQ.value = value
    updateFilter()
  }

  function updateFilter() {
    const settings = {
      type: filterType.value,
      frequency: filterFrequency.value,
      Q: filterQ.value,
    }
    const current = store.filterSettings
    if (
      settings.type === current.type &&
      settings.frequency === current.frequency &&
      settings.Q === current.Q
    ) {
      return
    }
    recordChange({ labelKey: 'tab_filter' })
    updateAudioFilter(settings)
  }
</script>

<style scoped>
  .filter-inactive-info {
    padding: var(--ds-space-4);
    text-align: center;
    opacity: 0.7;
  }
</style>
