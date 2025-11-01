<template>
  <div>
    <h2>{{ t('rec_title') }}</h2>
    <div class="control-group">
      <div class="mb-3">
        <!-- Duration Select -->
        <label for="recordDuration" class="form-label">{{ t('rec_duration') }}</label>
        <select
          id="recordDuration"
          v-model.number="selectedDuration"
          class="form-select"
          style="display: inline-block; width: auto; margin-right: 1rem;"
        >
          <option :value="null" disabled>{{ t('rec_select') }}</option>
          <option :value="60000">{{ t('rec_1min') }}</option>
          <option :value="120000">{{ t('rec_2min') }}</option>
          <option :value="180000">{{ t('rec_3min') }}</option>
          <option :value="300000">{{ t('rec_5min') }}</option>
        </select>

        <!-- Format Info -->
        <label class="form-label" style="margin-left: 1rem;">{{ t('rec_format') }}</label>
        <select class="form-select" style="display: inline-block; width: auto; margin-right: 1rem;" disabled>
          <option>{{ t('rec_auto') }}</option>
        </select>

        <!-- Start Recording Button -->
        <button
          id="startRecordingBtn"
          class="btn btn-success"
          style="margin-left: 0.5rem;"
          :disabled="!canStartRecording"
          @click="handleStartRecording"
        >
          <i class="fas fa-record-vinyl"></i> {{ t('rec_start') }}
        </button>

        <!-- Download Link -->
        <a
          v-if="showDownload"
          :href="downloadUrl"
          :download="downloadFilename"
          class="btn btn-outline-secondary"
          style="margin-left: 0.5rem;"
          @click="handleDownload"
        >
          <i class="fas fa-download"></i> {{ t('rec_download') }}
        </a>
      </div>

      <!-- Recording Feedback -->
      <div v-if="store.isRecording" class="timer">
        <i class="fas fa-circle-notch fa-spin"></i> {{ t('rec_running') }}
        <span>{{ formatTime(store.remainingTime) }}</span> {{ t('rec_remaining') }}
      </div>

      <!-- Progress Bar -->
      <div v-if="store.isRecording" class="progress mt-2" style="height: 20px;">
        <div
          class="progress-bar"
          role="progressbar"
          :style="{ width: progressPercentage + '%' }"
          :aria-valuenow="progressPercentage"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>

      <p class="small-text mt-3">{{ t('rec_help') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAlarmStore } from '@/stores/alarmStore'
import { useRecorder } from '@/composables/useRecorder'
import { translations } from '@/i18n/translations'

const store = useAlarmStore()
const {
  startRecording,
  formatTime,
  downloadUrl,
  downloadFilename,
  showDownload,
  resetDownload
} = useRecorder()

const selectedDuration = ref(60000) // Default 1 minute
store.recordingDuration = selectedDuration.value

const t = (key) => translations[store.currentLang]?.[key] || key

const canStartRecording = computed(() => {
  return selectedDuration.value && store.isAlarmRunning && !store.isRecording
})

const progressPercentage = computed(() => {
  if (!selectedDuration.value || !store.isRecording) return 0
  return ((selectedDuration.value - store.remainingTime) / selectedDuration.value) * 100
})

function handleStartRecording() {
  if (!canStartRecording.value) return
  startRecording(selectedDuration.value)
}

function handleDownload() {
  // Reset download link after short delay to allow download to start
  setTimeout(() => {
    resetDownload()
  }, 100)
}
</script>
