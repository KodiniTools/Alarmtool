<template>
  <div class="advanced-options">
    <div class="control-group">
      <SliderInput
        :model-value="attack"
        :label="t('osc_attack')"
        :min="0"
        :max="2000"
        :step="10"
        @update:model-value="emit('update:attack', $event)"
        @change="emit('update:attack', $event)"
      />

      <SliderInput
        :model-value="decay"
        :label="t('osc_decay')"
        :min="0"
        :max="2000"
        :step="10"
        @update:model-value="emit('update:decay', $event)"
        @change="emit('update:decay', $event)"
      />

      <SliderInput
        :model-value="sustain"
        :label="t('osc_sustain')"
        :min="0"
        :max="1"
        :step="0.01"
        @update:model-value="emit('update:sustain', $event)"
        @change="emit('update:sustain', $event)"
      />

      <SliderInput
        :model-value="release"
        :label="t('osc_release')"
        :min="0"
        :max="2000"
        :step="10"
        @update:model-value="emit('update:release', $event)"
        @change="emit('update:release', $event)"
      />

      <div class="mb-3 param-container">
        <label class="form-label">{{ t('osc_pattern') }}</label>
        <input
          :value="pattern"
          type="text"
          class="form-control"
          placeholder="500, 200, 300, 100"
          @input="emit('update:pattern', $event.target.value)"
          @change="emit('update:pattern', $event.target.value)"
        />
        <div class="form-text">{{ t('osc_pattern_help') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useAlarmStore } from '@/stores/alarmStore'
  import { translations } from '@/i18n/translations'
  import SliderInput from './SliderInput.vue'

  const store = useAlarmStore()
  const t = (key) => translations[store.currentLang]?.[key] || key

  defineProps({
    attack: { type: Number, required: true },
    decay: { type: Number, required: true },
    sustain: { type: Number, required: true },
    release: { type: Number, required: true },
    pattern: { type: String, required: true },
  })

  const emit = defineEmits([
    'update:attack',
    'update:decay',
    'update:sustain',
    'update:release',
    'update:pattern',
  ])
</script>
