<template>
  <transition name="hearing-warning">
    <div
      v-if="visible"
      class="hearing-warning"
      role="alert"
      aria-live="polite"
      :style="{ bottom: 'var(--player-bar-height, 120px)' }"
    >
      <div class="hearing-warning__inner">
        <i class="fas fa-volume-high hearing-warning__icon" aria-hidden="true"></i>
        <div class="hearing-warning__body">
          <strong class="hearing-warning__title">{{ t('hearing_warning_title') }}</strong>
          <span class="hearing-warning__text">{{ t('hearing_warning_text') }}</span>
        </div>
        <button class="hearing-warning__dismiss" @click="dismiss">
          {{ t('hearing_warning_dismiss') }}
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
  import { ref } from 'vue'
  import { useAlarmStore } from '@/stores/alarmStore'
  import { translations } from '@/i18n/translations'

  const STORAGE_KEY = 'alarmToolHearingAck'

  const store = useAlarmStore()
  const t = (key) => translations[store.currentLang]?.[key] || key

  // Show once until the user acknowledges it. Reading storage can throw in
  // private-mode browsers, so guard it and fail open (show the warning).
  function isAcknowledged() {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      return false
    }
  }

  const visible = ref(!isAcknowledged())

  function dismiss() {
    visible.value = false
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* storage unavailable — warning simply reappears next visit */
    }
  }
</script>
