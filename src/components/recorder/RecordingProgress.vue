<template>
  <!-- Recording Feedback -->
  <div v-if="store.isRecording" class="timer">
    <i class="fas fa-circle-notch fa-spin"></i> {{ t('rec_running') }}
    <span>{{ formatTime(store.remainingTime) }}</span> {{ t('rec_remaining') }}
  </div>

  <!-- Progress Bar -->
  <div v-if="store.isRecording" class="progress mt-2" style="height: 20px">
    <div
      class="progress-bar"
      role="progressbar"
      :style="{ width: percentage + '%' }"
      :aria-valuenow="percentage"
      aria-valuemin="0"
      aria-valuemax="100"
    ></div>
  </div>
</template>

<script setup lang="ts">
  /** Restzeit und Fortschrittsbalken, solange eine Aufnahme läuft. */
  import { computed } from 'vue'
  import { useAlarmStore } from '@/stores/alarmStore'
  import { useI18n } from '@/i18n'
  import { formatTime } from '@/lib/formatTime'

  const props = defineProps({
    /** Gewählte Aufnahmedauer in ms (null = keine Auswahl) */
    durationMs: { type: Number, default: null },
  })

  const store = useAlarmStore()
  const { t } = useI18n()

  const percentage = computed(() => {
    if (!props.durationMs || !store.isRecording) return 0
    return ((props.durationMs - store.remainingTime) / props.durationMs) * 100
  })
</script>
