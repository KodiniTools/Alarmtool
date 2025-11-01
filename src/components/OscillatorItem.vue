<template>
  <div class="oscillator-item">
    <div class="oscillator-header">
      <h5 class="oscillator-title">{{ t('osc_title_prefix') }} {{ oscillatorId + 1 }}</h5>
      <button
        class="more-options-btn"
        @click="showAdvanced = !showAdvanced"
        :title="showAdvanced ? 'Erweiterte Optionen ausblenden' : 'Erweiterte Optionen anzeigen'"
      >
        <i class="fas fa-cog"></i>
      </button>
    </div>

    <div class="control-group">
      <!-- Waveform -->
      <div class="mb-3 param-container">
        <label class="form-label">{{ t('osc_waveform') }}</label>
        <select v-model="settings.waveType" class="form-select" @change="updateParameter('waveType', settings.waveType)">
          <option value="sine">{{ t('osc_wave_sine') }}</option>
          <option value="square">{{ t('osc_wave_square') }}</option>
          <option value="sawtooth">{{ t('osc_wave_sawtooth') }}</option>
          <option value="triangle">{{ t('osc_wave_triangle') }}</option>
        </select>
      </div>

      <!-- Frequency -->
      <div class="mb-3 param-container">
        <label class="form-label">{{ t('osc_frequency') }}</label>
        <div class="slider-input-group">
          <input
            v-model.number="settings.frequency"
            type="range"
            class="form-range"
            min="50"
            max="2000"
            step="1"
            @input="updateParameter('frequency', settings.frequency)"
          />
          <input
            v-model.number="settings.frequency"
            type="number"
            class="form-control"
            min="50"
            max="2000"
            step="1"
            @input="updateParameter('frequency', settings.frequency)"
          />
        </div>
      </div>

      <!-- Volume -->
      <div class="mb-3 param-container">
        <label class="form-label">{{ t('osc_volume') }}</label>
        <div class="slider-input-group">
          <input
            v-model.number="settings.volume"
            type="range"
            class="form-range"
            min="0"
            max="1"
            step="0.01"
            @input="updateParameter('volume', settings.volume)"
          />
          <input
            v-model.number="settings.volume"
            type="number"
            class="form-control"
            min="0"
            max="1"
            step="0.01"
            @input="updateParameter('volume', settings.volume)"
          />
        </div>
      </div>

      <!-- Pan -->
      <div class="mb-3 param-container">
        <label class="form-label">{{ t('osc_pan') }}</label>
        <div class="slider-input-group">
          <input
            v-model.number="settings.pan"
            type="range"
            class="form-range"
            min="-1"
            max="1"
            step="0.01"
            @input="updateParameter('pan', settings.pan)"
          />
          <input
            v-model.number="settings.pan"
            type="number"
            class="form-control"
            min="-1"
            max="1"
            step="0.01"
            @input="updateParameter('pan', settings.pan)"
          />
        </div>
      </div>
    </div>

    <!-- Advanced Options -->
    <div v-show="showAdvanced" class="advanced-options">
      <div class="control-group">
        <!-- Attack -->
        <div class="mb-3 param-container">
          <label class="form-label">{{ t('osc_attack') }}</label>
          <div class="slider-input-group">
            <input
              v-model.number="settings.attack"
              type="range"
              class="form-range"
              min="0"
              max="2000"
              step="50"
              @input="updateParameter('attack', settings.attack)"
            />
            <input
              v-model.number="settings.attack"
              type="number"
              class="form-control"
              min="0"
              max="2000"
              step="50"
              @input="updateParameter('attack', settings.attack)"
            />
          </div>
        </div>

        <!-- Release -->
        <div class="mb-3 param-container">
          <label class="form-label">{{ t('osc_release') }}</label>
          <div class="slider-input-group">
            <input
              v-model.number="settings.release"
              type="range"
              class="form-range"
              min="0"
              max="2000"
              step="50"
              @input="updateParameter('release', settings.release)"
            />
            <input
              v-model.number="settings.release"
              type="number"
              class="form-control"
              min="0"
              max="2000"
              step="50"
              @input="updateParameter('release', settings.release)"
            />
          </div>
        </div>

        <!-- Pattern -->
        <div class="mb-3 param-container">
          <label class="form-label">{{ t('osc_pattern') }}</label>
          <input
            v-model="settings.pattern"
            type="text"
            class="form-control"
            @change="updateParameter('pattern', settings.pattern)"
          />
          <div class="form-text">{{ t('osc_pattern_help') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAlarmStore } from '@/stores/alarmStore'
import { useOscillators } from '@/composables/useOscillators'
import { translations } from '@/i18n/translations'

const props = defineProps({
  oscillatorId: {
    type: Number,
    required: true
  },
  oscillator: {
    type: Object,
    required: true
  }
})

const store = useAlarmStore()
const { updateOscillatorParameter } = useOscillators()

const showAdvanced = ref(false)

// Local settings (synced with store)
const settings = ref({
  waveType: props.oscillator.waveType,
  frequency: props.oscillator.frequency,
  volume: props.oscillator.volume,
  pan: props.oscillator.pan,
  attack: props.oscillator.attack,
  release: props.oscillator.release,
  pattern: props.oscillator.pattern
})

const t = (key) => translations[store.currentLang]?.[key] || key

// Watch for external changes (e.g., loading settings)
watch(
  () => props.oscillator,
  (newOsc) => {
    settings.value = {
      waveType: newOsc.waveType,
      frequency: newOsc.frequency,
      volume: newOsc.volume,
      pan: newOsc.pan,
      attack: newOsc.attack,
      release: newOsc.release,
      pattern: newOsc.pattern
    }
  },
  { deep: true }
)

function updateParameter(param, value) {
  updateOscillatorParameter(props.oscillatorId, param, value)
}
</script>
