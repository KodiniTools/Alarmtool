<template>
  <div class="osc-editor" :class="{ 'osc-editor--disabled': !settings.enabled }">
    <!-- Editor header -->
    <div class="osc-editor-header">
      <div class="osc-editor-title-row">
        <label class="toggle-switch" :title="settings.enabled ? t('osc_disable') : t('osc_enable')">
          <input
            :checked="settings.enabled"
            type="checkbox"
            @change="updateParameter('enabled', $event.target.checked)"
          />
          <span class="toggle-slider"></span>
        </label>
        <h3 class="osc-editor-title">
          {{ t('osc_title_prefix') }} {{ oscillatorId + 1 }}
          <span class="osc-editor-wave-badge" :class="`osc-wave-chip--${settings.waveType}`">
            {{ WAVE_ABBR[settings.waveType] ?? settings.waveType }}
          </span>
        </h3>
      </div>
      <div class="osc-editor-actions">
        <button
          class="btn btn-outline-secondary btn-sm"
          :title="t('osc_copy')"
          @click="copySettings"
        >
          <i class="fas fa-copy"></i>
          <span class="osc-action-label">{{ t('osc_copy') }}</span>
        </button>
        <button
          class="btn btn-outline-secondary btn-sm"
          :title="t('osc_paste')"
          :disabled="!store.oscClipboard"
          @click="pasteSettings"
        >
          <i class="fas fa-paste"></i>
          <span class="osc-action-label">{{ t('osc_paste') }}</span>
        </button>
      </div>
    </div>

    <!-- Waveform selector -->
    <div class="osc-editor-section">
      <div class="osc-wave-selector" :class="{ 'controls-disabled': !settings.enabled }">
        <button
          v-for="wave in WAVE_TYPES"
          :key="wave.value"
          class="osc-wave-btn"
          :class="{ 'osc-wave-btn--active': settings.waveType === wave.value }"
          :disabled="!settings.enabled"
          :title="t(wave.labelKey)"
          @click="updateParameter('waveType', wave.value)"
        >
          <svg
            class="osc-wave-icon"
            viewBox="0 0 40 20"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path :d="wave.svgPath" />
          </svg>
          <span>{{ t(wave.labelKey) }}</span>
        </button>
      </div>
    </div>

    <!-- Main parameters: 2-column grid -->
    <div class="osc-editor-section" :class="{ 'controls-disabled': !settings.enabled }">
      <div class="osc-params-grid">
        <SliderInput
          :model-value="settings.frequency"
          :label="t('osc_frequency')"
          :min="50"
          :max="2000"
          :step="1"
          :disabled="!settings.enabled"
          @update:model-value="updateParameter('frequency', $event)"
          @change="updateParameter('frequency', $event)"
        />
        <SliderInput
          :model-value="settings.volume"
          :label="t('osc_volume')"
          :min="0"
          :max="1"
          :step="0.01"
          :disabled="!settings.enabled"
          @update:model-value="updateParameter('volume', $event)"
          @change="updateParameter('volume', $event)"
        />
        <SliderInput
          :model-value="settings.pan"
          :label="t('osc_pan')"
          :min="-1"
          :max="1"
          :step="0.01"
          :disabled="!settings.enabled"
          @update:model-value="updateParameter('pan', $event)"
          @change="updateParameter('pan', $event)"
        />
      </div>
    </div>

    <!-- ADSR & Pattern — collapsible -->
    <div class="osc-editor-section">
      <button class="osc-adsr-toggle" :disabled="!settings.enabled" @click="showAdsr = !showAdsr">
        <i class="fas" :class="showAdsr ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
        {{ t('osc_adsr_section') }}
      </button>

      <div
        v-show="showAdsr"
        class="osc-adsr-body"
        :class="{ 'controls-disabled': !settings.enabled }"
      >
        <div class="osc-params-grid">
          <SliderInput
            :model-value="settings.attack"
            :label="t('osc_attack')"
            :min="0"
            :max="2000"
            :step="10"
            :disabled="!settings.enabled"
            @update:model-value="updateParameter('attack', $event)"
            @change="updateParameter('attack', $event)"
          />
          <SliderInput
            :model-value="settings.decay"
            :label="t('osc_decay')"
            :min="0"
            :max="2000"
            :step="10"
            :disabled="!settings.enabled"
            @update:model-value="updateParameter('decay', $event)"
            @change="updateParameter('decay', $event)"
          />
          <SliderInput
            :model-value="settings.sustain"
            :label="t('osc_sustain')"
            :min="0"
            :max="1"
            :step="0.01"
            :disabled="!settings.enabled"
            @update:model-value="updateParameter('sustain', $event)"
            @change="updateParameter('sustain', $event)"
          />
          <SliderInput
            :model-value="settings.release"
            :label="t('osc_release')"
            :min="0"
            :max="2000"
            :step="10"
            :disabled="!settings.enabled"
            @update:model-value="updateParameter('release', $event)"
            @change="updateParameter('release', $event)"
          />
        </div>

        <div class="param-container">
          <label class="form-label">{{ t('osc_pattern') }}</label>
          <input
            :value="settings.pattern"
            type="text"
            class="form-control"
            :disabled="!settings.enabled"
            placeholder="500, 200, 300, 100"
            @input="updateParameter('pattern', $event.target.value)"
            @change="updateParameter('pattern', $event.target.value)"
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
  import SliderInput from './oscillator/SliderInput.vue'

  const WAVE_ABBR = { sine: 'SIN', square: 'SQR', sawtooth: 'SAW', triangle: 'TRI' }

  const WAVE_TYPES = [
    {
      value: 'sine',
      labelKey: 'osc_wave_sine',
      svgPath: 'M2,10 C8,10 8,2 14,2 C20,2 20,18 26,18 C32,18 32,10 38,10',
    },
    {
      value: 'square',
      labelKey: 'osc_wave_square',
      svgPath: 'M2,10 L2,3 L14,3 L14,17 L26,17 L26,3 L38,3 L38,10',
    },
    {
      value: 'sawtooth',
      labelKey: 'osc_wave_sawtooth',
      svgPath: 'M2,17 L14,3 L14,17 L26,3 L26,17 L38,3',
    },
    {
      value: 'triangle',
      labelKey: 'osc_wave_triangle',
      svgPath: 'M2,10 L8,3 L20,17 L32,3 L38,10',
    },
  ]

  const CLIPBOARD_PARAMS = [
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

  const props = defineProps({
    oscillatorId: { type: Number, required: true },
    oscillator: { type: Object, required: true },
  })

  const store = useAlarmStore()
  const { updateOscillatorParameter, parsePattern } = useOscillators()
  const toast = useToast()
  const t = (key) => translations[store.currentLang]?.[key] ?? key

  const showAdsr = ref(false)
  const settings = ref({ ...props.oscillator })

  watch(
    () => props.oscillator,
    (newOsc) => {
      settings.value = { ...newOsc }
    },
    { deep: true }
  )

  function updateParameter(param, value) {
    settings.value[param] = value
    updateOscillatorParameter(props.oscillatorId, param, value)
  }

  function copySettings() {
    store.oscClipboard = Object.fromEntries(CLIPBOARD_PARAMS.map((p) => [p, settings.value[p]]))
    toast.success('toast_osc_copied')
  }

  function pasteSettings() {
    if (!store.oscClipboard) return
    CLIPBOARD_PARAMS.forEach((param) => {
      updateOscillatorParameter(props.oscillatorId, param, store.oscClipboard[param])
    })
    parsePattern(props.oscillatorId)
    toast.success('toast_osc_pasted')
  }
</script>
