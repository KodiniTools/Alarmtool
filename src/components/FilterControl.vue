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
          @change="updateFilter"
        >
          <option value="none">{{ t('filter_none') }}</option>
          <option value="lowpass">{{ t('filter_lowpass') }}</option>
          <option value="highpass">{{ t('filter_highpass') }}</option>
          <option value="bandpass">{{ t('filter_bandpass') }}</option>
          <option value="notch">{{ t('filter_notch') }}</option>
        </select>
      </div>

      <!-- Filter Frequency -->
      <div class="mb-3 param-container">
        <label for="filterFrequency" class="form-label">{{ t('filter_frequency') }}</label>
        <div class="slider-input-group">
          <input
            id="filterFrequency"
            v-model.number="filterFrequency"
            type="range"
            class="form-range"
            min="20"
            max="20000"
            step="1"
            @input="updateFilter"
          />
          <input
            v-model.number="filterFrequency"
            type="number"
            class="form-control"
            min="20"
            max="20000"
            step="1"
            @input="updateFilter"
          />
        </div>
        <small class="form-text">{{ t('filter_freq_help') }}</small>
      </div>

      <!-- Filter Q -->
      <div class="mb-3 param-container">
        <label for="filterQ" class="form-label">{{ t('filter_q') }}</label>
        <div class="slider-input-group">
          <input
            id="filterQ"
            v-model.number="filterQ"
            type="range"
            class="form-range"
            min="0.1"
            max="20"
            step="0.1"
            @input="updateFilter"
          />
          <input
            v-model.number="filterQ"
            type="number"
            class="form-control"
            min="0.1"
            max="20"
            step="0.1"
            @input="updateFilter"
          />
        </div>
        <small class="form-text">{{ t('filter_q_help') }}</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
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

function updateFilter() {
  const settings = {
    type: filterType.value,
    frequency: filterFrequency.value,
    Q: filterQ.value
  }
  updateAudioFilter(settings)
}
</script>
