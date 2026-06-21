<template>
  <div class="control-group" :class="{ 'controls-disabled': disabled }">
    <div class="mb-3 param-container">
      <label class="form-label">{{ t('osc_waveform') }}</label>
      <select
        :value="waveType"
        class="form-select"
        :disabled="disabled"
        @change="emit('update:waveType', $event.target.value)"
      >
        <option value="sine">{{ t('osc_wave_sine') }}</option>
        <option value="square">{{ t('osc_wave_square') }}</option>
        <option value="sawtooth">{{ t('osc_wave_sawtooth') }}</option>
        <option value="triangle">{{ t('osc_wave_triangle') }}</option>
      </select>
    </div>

    <SliderInput
      :model-value="frequency"
      :label="t('osc_frequency')"
      :min="50"
      :max="2000"
      :step="1"
      :disabled="disabled"
      @update:model-value="emit('update:frequency', $event)"
      @change="emit('update:frequency', $event)"
    />

    <SliderInput
      :model-value="volume"
      :label="t('osc_volume')"
      :min="0"
      :max="1"
      :step="0.01"
      :disabled="disabled"
      @update:model-value="emit('update:volume', $event)"
      @change="emit('update:volume', $event)"
    />

    <SliderInput
      :model-value="pan"
      :label="t('osc_pan')"
      :min="-1"
      :max="1"
      :step="0.01"
      :disabled="disabled"
      @update:model-value="emit('update:pan', $event)"
      @change="emit('update:pan', $event)"
    />
  </div>
</template>

<script setup>
  import { useAlarmStore } from '@/stores/alarmStore'
  import { translations } from '@/i18n/translations'
  import SliderInput from './SliderInput.vue'

  const store = useAlarmStore()
  const t = (key) => translations[store.currentLang]?.[key] || key

  defineProps({
    waveType: { type: String, required: true },
    frequency: { type: Number, required: true },
    volume: { type: Number, required: true },
    pan: { type: Number, required: true },
    disabled: { type: Boolean, default: false },
  })

  const emit = defineEmits(['update:waveType', 'update:frequency', 'update:volume', 'update:pan'])
</script>
