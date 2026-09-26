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
      <div class="osc-section-label">
        <i class="fas fa-wave-square"></i>
        <span>{{ t('osc_waveform') }}</span>
      </div>
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
      <div class="osc-section-label">
        <i class="fas fa-sliders"></i>
        <span>{{ t('osc_section_basics') }}</span>
      </div>
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
  import { useUndoRedo } from '@/composables/useUndoRedo'
  import { useToast } from '@/composables/useToast'
  import { useI18n } from '@/i18n'
  import SliderInput from './oscillator/SliderInput.vue'
  import { WAVE_TYPES, WAVE_ABBR } from '@/lib/waveforms'
  import { OSC_PARAMS, pickOscParams } from '@/lib/oscillatorDefaults'

  const props = defineProps({
    oscillatorId: { type: Number, required: true },
    oscillator: { type: Object, required: true },
  })

  const store = useAlarmStore()
  const { updateOscillatorParameter, parsePattern } = useOscillators()
  const { withHistory } = useUndoRedo()
  const toast = useToast()
  const { t } = useI18n()

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
    store.oscClipboard = pickOscParams(settings.value)
    toast.success('toast_osc_copied')
  }

  function pasteSettings() {
    if (!store.oscClipboard) return
    withHistory({ labelKey: 'osc_paste', oscId: props.oscillatorId }, () => {
      OSC_PARAMS.forEach((param) => {
        updateOscillatorParameter(props.oscillatorId, param, store.oscClipboard[param])
      })
      parsePattern(props.oscillatorId)
    })
    toast.success('toast_osc_pasted')
  }
</script>
