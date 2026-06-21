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
        <div class="mb-3 param-container">
          <label for="filterFrequency" class="form-label">{{ frequencyLabel }}</label>
          <div class="slider-input-group">
            <input
              id="filterFrequency"
              v-model.number="filterFrequency"
              type="range"
              class="form-range"
              :min="frequencyRange.min"
              :max="frequencyRange.max"
              step="1"
              @input="updateFilter"
            />
            <input
              v-model.number="filterFrequency"
              type="number"
              class="form-control"
              :min="frequencyRange.min"
              :max="frequencyRange.max"
              step="1"
              @input="updateFilter"
            />
          </div>
          <small class="form-text">{{ frequencyHelp }}</small>
        </div>

        <!-- Filter Q -->
        <div class="mb-3 param-container">
          <label for="filterQ" class="form-label">{{ qLabel }}</label>
          <div class="slider-input-group">
            <input
              id="filterQ"
              v-model.number="filterQ"
              type="range"
              class="form-range"
              :min="qRange.min"
              :max="qRange.max"
              :step="qRange.step"
              @input="updateFilter"
            />
            <input
              v-model.number="filterQ"
              type="number"
              class="form-control"
              :min="qRange.min"
              :max="qRange.max"
              :step="qRange.step"
              @input="updateFilter"
            />
          </div>
          <small class="form-text">{{ qHelp }}</small>
        </div>
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
  import { translations } from '@/i18n/translations'

  const store = useAlarmStore()
  const { updateFilter: updateAudioFilter } = useAudioContext()

  // Local reactive state
  const filterType = ref(store.filterSettings.type)
  const filterFrequency = ref(store.filterSettings.frequency)
  const filterQ = ref(store.filterSettings.Q)

  // Translation helper
  const t = (key) => translations[store.currentLang]?.[key] || key

  // Filter-specific default values
  const filterDefaults = {
    lowpass: {
      frequency: 2000,
      Q: 1,
      freqMin: 20,
      freqMax: 20000,
      qMin: 0.1,
      qMax: 20,
      qStep: 0.1,
    },
    highpass: {
      frequency: 200,
      Q: 1,
      freqMin: 20,
      freqMax: 20000,
      qMin: 0.1,
      qMax: 20,
      qStep: 0.1,
    },
    bandpass: {
      frequency: 1000,
      Q: 5,
      freqMin: 20,
      freqMax: 20000,
      qMin: 0.5,
      qMax: 30,
      qStep: 0.5,
    },
    notch: { frequency: 1000, Q: 10, freqMin: 20, freqMax: 20000, qMin: 1, qMax: 50, qStep: 1 },
  }

  // Computed properties for dynamic ranges
  const frequencyRange = computed(() => {
    const defaults = filterDefaults[filterType.value] || filterDefaults.lowpass
    return { min: defaults.freqMin, max: defaults.freqMax }
  })

  const qRange = computed(() => {
    const defaults = filterDefaults[filterType.value] || filterDefaults.lowpass
    return { min: defaults.qMin, max: defaults.qMax, step: defaults.qStep }
  })

  // Computed properties for dynamic labels
  const frequencyLabel = computed(() => {
    const labels = {
      lowpass: t('filter_freq_cutoff'),
      highpass: t('filter_freq_cutoff'),
      bandpass: t('filter_freq_center'),
      notch: t('filter_freq_notch'),
    }
    return labels[filterType.value] || t('filter_frequency')
  })

  const frequencyHelp = computed(() => {
    const helps = {
      lowpass: t('filter_freq_help_lowpass'),
      highpass: t('filter_freq_help_highpass'),
      bandpass: t('filter_freq_help_bandpass'),
      notch: t('filter_freq_help_notch'),
    }
    return helps[filterType.value] || t('filter_freq_help')
  })

  const qLabel = computed(() => {
    const labels = {
      lowpass: t('filter_q_resonance'),
      highpass: t('filter_q_resonance'),
      bandpass: t('filter_q_bandwidth'),
      notch: t('filter_q_width'),
    }
    return labels[filterType.value] || t('filter_q')
  })

  const qHelp = computed(() => {
    const helps = {
      lowpass: t('filter_q_help_lowpass'),
      highpass: t('filter_q_help_highpass'),
      bandpass: t('filter_q_help_bandpass'),
      notch: t('filter_q_help_notch'),
    }
    return helps[filterType.value] || t('filter_q_help')
  })

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
    if (filterType.value !== 'none' && filterDefaults[filterType.value]) {
      const defaults = filterDefaults[filterType.value]
      filterFrequency.value = defaults.frequency
      filterQ.value = defaults.Q
    }
    updateFilter()
  }

  function updateFilter() {
    const settings = {
      type: filterType.value,
      frequency: filterFrequency.value,
      Q: filterQ.value,
    }
    updateAudioFilter(settings)
  }
</script>

<style scoped>
  .filter-inactive-info {
    padding: 1rem;
    text-align: center;
    opacity: 0.7;
  }
</style>
