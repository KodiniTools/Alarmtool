<template>
  <div class="oscillator-header">
    <div class="oscillator-title-row">
      <label class="toggle-switch" :title="enabled ? t('osc_disable') : t('osc_enable')">
        <input
          :checked="enabled"
          type="checkbox"
          @change="emit('toggle-enabled', $event.target.checked)"
        />
        <span class="toggle-slider"></span>
      </label>
      <h5 class="oscillator-title">{{ t('osc_title_prefix') }} {{ oscillatorId + 1 }}</h5>
    </div>
    <div class="osc-actions">
      <button class="more-options-btn" :title="t('osc_copy')" @click="emit('copy')">
        <i class="fas fa-copy"></i>
      </button>
      <button
        class="more-options-btn"
        :title="t('osc_paste')"
        :disabled="!hasClipboard"
        @click="emit('paste')"
      >
        <i class="fas fa-paste"></i>
      </button>
      <button
        class="more-options-btn"
        :title="showAdvanced ? t('osc_advanced_hide') : t('osc_advanced_show')"
        :disabled="!enabled"
        @click="emit('toggle-advanced')"
      >
        <i class="fas fa-cog"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
  import { useAlarmStore } from '@/stores/alarmStore'
  import { translations } from '@/i18n/translations'

  const store = useAlarmStore()
  const t = (key) => translations[store.currentLang]?.[key] || key

  defineProps({
    oscillatorId: { type: Number, required: true },
    enabled: { type: Boolean, required: true },
    hasClipboard: { type: Boolean, required: true },
    showAdvanced: { type: Boolean, required: true },
  })

  const emit = defineEmits(['toggle-enabled', 'copy', 'paste', 'toggle-advanced'])
</script>
