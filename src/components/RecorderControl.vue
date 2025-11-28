<template>
  <div>
    <h2>{{ t('rec_title') }}</h2>
    <div class="control-group">
      <div class="mb-3 recorder-controls">
        <!-- Duration Select -->
        <div class="recorder-field">
          <label for="recordDuration" class="form-label">{{ t('rec_duration') }}</label>
          <select
            id="recordDuration"
            v-model.number="selectedDuration"
            class="form-select"
          >
            <option :value="null" disabled>{{ t('rec_select') }}</option>
            <option :value="60000">{{ t('rec_1min') }}</option>
            <option :value="120000">{{ t('rec_2min') }}</option>
            <option :value="180000">{{ t('rec_3min') }}</option>
            <option :value="300000">{{ t('rec_5min') }}</option>
          </select>
        </div>

        <!-- Format Select -->
        <div class="recorder-field">
          <label for="recordFormat" class="form-label">{{ t('rec_format') }}</label>
          <select
            id="recordFormat"
            v-model="selectedFormat"
            class="form-select"
          >
            <option
              v-for="fmt in availableFormats"
              :key="fmt.value"
              :value="fmt.value"
            >
              {{ t(fmt.labelKey) }}
            </option>
          </select>
        </div>

        <!-- Start Recording Button -->
        <div class="recorder-field recorder-actions">
          <button
            id="startRecordingBtn"
            class="btn btn-success"
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
            @click="handleDownload"
          >
            <i class="fas fa-download"></i> {{ t('rec_download') }}
          </a>
        </div>
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

// Define all possible formats with their mime types
const allFormats = [
  { value: 'webm-opus', labelKey: 'rec_format_webm', mimeType: 'audio/webm;codecs=opus' },
  { value: 'ogg-opus', labelKey: 'rec_format_ogg', mimeType: 'audio/ogg;codecs=opus' },
  { value: 'wav', labelKey: 'rec_format_wav', mimeType: 'audio/wav' }
]

// Filter to only show formats supported by the browser
const availableFormats = computed(() => {
  const supported = allFormats.filter(fmt =>
    typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(fmt.mimeType)
  )
  // If multiple formats available, add "auto" option at the beginning
  if (supported.length > 1) {
    return [{ value: 'auto', labelKey: 'rec_format_auto' }, ...supported]
  }
  // If only one or no formats, just return what's available
  return supported.length > 0 ? supported : [{ value: 'auto', labelKey: 'rec_format_auto' }]
})

// Default to first available format
const selectedFormat = ref(availableFormats.value[0]?.value || 'auto')

const canStartRecording = computed(() => {
  return selectedDuration.value && store.isAlarmRunning && !store.isRecording
})

const progressPercentage = computed(() => {
  if (!selectedDuration.value || !store.isRecording) return 0
  return ((selectedDuration.value - store.remainingTime) / selectedDuration.value) * 100
})

function handleStartRecording() {
  if (!canStartRecording.value) return
  startRecording(selectedDuration.value, selectedFormat.value)
}

function handleDownload() {
  // Reset download link after short delay to allow download to start
  setTimeout(() => {
    resetDownload()
  }, 100)
}
</script>

<style scoped>
.recorder-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
}

.recorder-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.recorder-field .form-select {
  width: auto;
  min-width: 140px;
}

.recorder-actions {
  display: flex;
  gap: 0.5rem;
  flex-direction: row;
  align-items: center;
}

@media (max-width: 768px) {
  .recorder-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .recorder-field .form-select {
    width: 100%;
  }

  .recorder-actions {
    flex-direction: column;
  }
}
</style>
