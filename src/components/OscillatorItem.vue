<template>
  <div class="oscillator-item" :class="{ 'oscillator-disabled': !settings.enabled }">
    <div class="oscillator-header">
      <div class="oscillator-title-row">
        <label class="toggle-switch" :title="settings.enabled ? t('osc_disable') : t('osc_enable')">
          <input
            v-model="settings.enabled"
            type="checkbox"
            @change="updateParameter('enabled', settings.enabled)"
          />
          <span class="toggle-slider"></span>
        </label>
        <h5 class="oscillator-title">{{ t('osc_title_prefix') }} {{ oscillatorId + 1 }}</h5>
      </div>
      <div class="osc-actions">
        <button class="more-options-btn" :title="t('osc_copy')" @click="copySettings">
          <i class="fas fa-copy"></i>
        </button>
        <button
          class="more-options-btn"
          :title="t('osc_paste')"
          :disabled="!store.oscClipboard"
          @click="pasteSettings"
        >
          <i class="fas fa-paste"></i>
        </button>
        <button
          class="more-options-btn"
          :title="showAdvanced ? 'Erweiterte Optionen ausblenden' : 'Erweiterte Optionen anzeigen'"
          :disabled="!settings.enabled"
          @click="showAdvanced = !showAdvanced"
        >
          <i class="fas fa-cog"></i>
        </button>
      </div>
    </div>

    <div class="control-group" :class="{ 'controls-disabled': !settings.enabled }">
      <!-- Waveform -->
      <div class="mb-3 param-container">
        <label class="form-label">{{ t('osc_waveform') }}</label>
        <select
          v-model="settings.waveType"
          class="form-select"
          :disabled="!settings.enabled"
          @change="updateParameter('waveType', settings.waveType)"
        >
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
            :disabled="!settings.enabled"
            @input="updateParameter('frequency', settings.frequency)"
          />
          <input
            v-model.number="settings.frequency"
            type="number"
            class="form-control"
            min="50"
            max="2000"
            step="1"
            :disabled="!settings.enabled"
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
            :disabled="!settings.enabled"
            @input="updateParameter('volume', settings.volume)"
          />
          <input
            v-model.number="settings.volume"
            type="number"
            class="form-control"
            min="0"
            max="1"
            step="0.01"
            :disabled="!settings.enabled"
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
            :disabled="!settings.enabled"
            @input="updateParameter('pan', settings.pan)"
          />
          <input
            v-model.number="settings.pan"
            type="number"
            class="form-control"
            min="-1"
            max="1"
            step="0.01"
            :disabled="!settings.enabled"
            @input="updateParameter('pan', settings.pan)"
          />
        </div>
      </div>
    </div>

    <!-- Advanced Options -->
    <div v-show="showAdvanced && settings.enabled" class="advanced-options">
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
              step="10"
              @input="updateParameter('attack', settings.attack)"
            />
            <input
              v-model.number="settings.attack"
              type="number"
              class="form-control"
              min="0"
              max="2000"
              step="10"
              @input="updateParameter('attack', settings.attack)"
            />
          </div>
        </div>

        <!-- Decay -->
        <div class="mb-3 param-container">
          <label class="form-label">{{ t('osc_decay') }}</label>
          <div class="slider-input-group">
            <input
              v-model.number="settings.decay"
              type="range"
              class="form-range"
              min="0"
              max="2000"
              step="10"
              @input="updateParameter('decay', settings.decay)"
            />
            <input
              v-model.number="settings.decay"
              type="number"
              class="form-control"
              min="0"
              max="2000"
              step="10"
              @input="updateParameter('decay', settings.decay)"
            />
          </div>
        </div>

        <!-- Sustain -->
        <div class="mb-3 param-container">
          <label class="form-label">{{ t('osc_sustain') }}</label>
          <div class="slider-input-group">
            <input
              v-model.number="settings.sustain"
              type="range"
              class="form-range"
              min="0"
              max="1"
              step="0.01"
              @input="updateParameter('sustain', settings.sustain)"
            />
            <input
              v-model.number="settings.sustain"
              type="number"
              class="form-control"
              min="0"
              max="1"
              step="0.01"
              @input="updateParameter('sustain', settings.sustain)"
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
              step="10"
              @input="updateParameter('release', settings.release)"
            />
            <input
              v-model.number="settings.release"
              type="number"
              class="form-control"
              min="0"
              max="2000"
              step="10"
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
            placeholder="500, 200, 300, 100"
            @input="updateParameter('pattern', settings.pattern)"
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
  import { useToast } from '@/composables/useToast'
  import { translations } from '@/i18n/translations'

  const props = defineProps({
    oscillatorId: {
      type: Number,
      required: true,
    },
    oscillator: {
      type: Object,
      required: true,
    },
  })

  const store = useAlarmStore()
  const { updateOscillatorParameter, parsePattern } = useOscillators()
  const toast = useToast()

  const showAdvanced = ref(false)

  // Local settings (synced with store)
  const settings = ref({
    enabled: props.oscillator.enabled,
    waveType: props.oscillator.waveType,
    frequency: props.oscillator.frequency,
    volume: props.oscillator.volume,
    pan: props.oscillator.pan,
    attack: props.oscillator.attack,
    decay: props.oscillator.decay,
    sustain: props.oscillator.sustain,
    release: props.oscillator.release,
    pattern: props.oscillator.pattern,
  })

  const t = (key) => translations[store.currentLang]?.[key] || key

  // Watch for external changes (e.g., loading settings)
  watch(
    () => props.oscillator,
    (newOsc) => {
      settings.value = {
        enabled: newOsc.enabled,
        waveType: newOsc.waveType,
        frequency: newOsc.frequency,
        volume: newOsc.volume,
        pan: newOsc.pan,
        attack: newOsc.attack,
        decay: newOsc.decay,
        sustain: newOsc.sustain,
        release: newOsc.release,
        pattern: newOsc.pattern,
      }
    },
    { deep: true }
  )

  function updateParameter(param, value) {
    updateOscillatorParameter(props.oscillatorId, param, value)
  }

  function copySettings() {
    store.oscClipboard = {
      waveType: settings.value.waveType,
      frequency: settings.value.frequency,
      volume: settings.value.volume,
      pan: settings.value.pan,
      attack: settings.value.attack,
      decay: settings.value.decay,
      sustain: settings.value.sustain,
      release: settings.value.release,
      pattern: settings.value.pattern,
    }
    toast.success('toast_osc_copied')
  }

  function pasteSettings() {
    if (!store.oscClipboard) return
    const clip = store.oscClipboard
    const params = [
      'waveType',
      'frequency',
      'volume',
      'pan',
      'attack',
      'decay',
      'sustain',
      'release',
      'pattern',
    ]
    params.forEach((param) => {
      updateOscillatorParameter(props.oscillatorId, param, clip[param])
    })
    parsePattern(props.oscillatorId)
    toast.success('toast_osc_pasted')
  }
</script>
