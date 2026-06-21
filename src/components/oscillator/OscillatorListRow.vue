<template>
  <button
    class="osc-list-row"
    :class="{
      'osc-list-row--selected': selected,
      'osc-list-row--disabled': !oscillator.enabled,
    }"
    type="button"
    @click="emit('select')"
  >
    <!-- Toggle -->
    <span
      class="osc-row-toggle"
      :title="oscillator.enabled ? t('osc_disable') : t('osc_enable')"
      @click.stop="emit('toggle-enabled', !oscillator.enabled)"
    >
      <span class="osc-row-toggle-dot" :class="{ 'osc-row-toggle-dot--on': oscillator.enabled }" />
    </span>

    <!-- Waveform chip -->
    <span class="osc-wave-chip" :class="`osc-wave-chip--${oscillator.waveType}`">
      {{ WAVE_ABBR[oscillator.waveType] ?? '?' }}
    </span>

    <!-- Name -->
    <span class="osc-row-name">{{ t('osc_title_prefix') }} {{ oscillatorId + 1 }}</span>

    <!-- Key values (only when enabled) -->
    <span v-if="oscillator.enabled" class="osc-row-meta">{{ oscillator.frequency }} Hz</span>
    <span v-else class="osc-row-meta osc-row-meta--dim">{{ t('osc_disabled_label') }}</span>
  </button>
</template>

<script setup>
  import { useAlarmStore } from '@/stores/alarmStore'
  import { translations } from '@/i18n/translations'

  const WAVE_ABBR = { sine: 'SIN', square: 'SQR', sawtooth: 'SAW', triangle: 'TRI' }

  const store = useAlarmStore()
  const t = (key) => translations[store.currentLang]?.[key] ?? key

  defineProps({
    oscillatorId: { type: Number, required: true },
    oscillator: { type: Object, required: true },
    selected: { type: Boolean, default: false },
  })

  const emit = defineEmits(['select', 'toggle-enabled'])
</script>
