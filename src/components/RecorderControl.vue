<template>
  <div>
    <h2>{{ t('rec_title') }}</h2>
    <div class="control-group">
      <div class="mb-3 recorder-controls">
        <!-- Duration Select -->
        <div class="recorder-field">
          <label for="recordDuration" class="form-label">{{ t('rec_duration') }}</label>
          <select id="recordDuration" v-model.number="selectedDuration" class="form-select">
            <option :value="null" disabled>{{ t('rec_select') }}</option>
            <option :value="30000">{{ t('rec_30sec') }}</option>
            <option :value="60000">{{ t('rec_1min') }}</option>
            <option :value="120000">{{ t('rec_2min') }}</option>
            <option :value="180000">{{ t('rec_3min') }}</option>
            <option :value="300000">{{ t('rec_5min') }}</option>
          </select>
        </div>

        <!-- Format Select -->
        <div class="recorder-field">
          <label for="recordFormat" class="form-label">{{ t('rec_format') }}</label>
          <select id="recordFormat" v-model="selectedFormat" class="form-select">
            <option v-for="fmt in availableFormats" :key="fmt.value" :value="fmt.value">
              {{ t(fmt.labelKey) }}
            </option>
          </select>
        </div>

        <!-- Channel Mode Select -->
        <div class="recorder-field">
          <label for="channelMode" class="form-label">{{ t('rec_channels') }}</label>
          <select id="channelMode" v-model="selectedChannelMode" class="form-select">
            <option value="stereo">{{ t('rec_channels_stereo') }}</option>
            <option value="mono">{{ t('rec_channels_mono') }}</option>
          </select>
        </div>

        <!-- Start Recording Button -->
        <div class="recorder-field recorder-actions">
          <UiButton
            id="startRecordingBtn"
            variant="primary"
            :disabled="!canStartRecording"
            @click="handleStartRecording"
          >
            <i class="fas fa-record-vinyl"></i> {{ t('rec_start') }}
          </UiButton>

          <!-- Download Link -->
          <UiButton
            v-if="showDownload"
            :href="downloadUrl"
            :download="downloadFilename"
            class="download-ready"
            @click="handleDownload"
          >
            <i class="fas fa-download"></i> {{ t('rec_download') }}
          </UiButton>

          <!-- Dismiss Recording -->
          <UiButton
            v-if="showDownload"
            variant="danger"
            :title="t('rec_dismiss')"
            @click="handleDismiss"
          >
            <i class="fas fa-times"></i> {{ t('rec_dismiss') }}
          </UiButton>
        </div>
      </div>

      <!-- Success Feedback -->
      <div v-if="showDownload" class="recording-success">
        <i class="fas fa-check-circle"></i> {{ t('rec_success') }}
      </div>

      <RecordingConvert
        ref="converter"
        :offer-conversion="showDownload"
        :recorded-blob="recordedBlob"
        :base-filename="downloadFilename"
        :mono="selectedChannelMode === 'mono'"
      />

      <RecordingProgress :duration-ms="selectedDuration" />

      <p class="small-text mt-3">{{ t('rec_help') }}</p>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, useTemplateRef } from 'vue'
  import { useAlarmStore } from '@/stores/alarmStore'
  import { useRecorder } from '@/composables/useRecorder'
  import { useToast } from '@/composables/useToast'
  import { useI18n } from '@/i18n'
  import { UiButton } from '@/components/ui'
  import { availableRecordingFormats } from '@/lib/recordingFormats'
  import RecordingConvert from './recorder/RecordingConvert.vue'
  import RecordingProgress from './recorder/RecordingProgress.vue'

  const store = useAlarmStore()
  const {
    startRecording,
    downloadUrl,
    downloadFilename,
    showDownload,
    resetDownload,
    recordedBlob,
  } = useRecorder()
  const converter = useTemplateRef('converter')
  const toast = useToast()

  const selectedDuration = ref(60000) // Default 1 minute

  const { t } = useI18n()

  // Formats the browser can record
  const availableFormats = computed(() => availableRecordingFormats())

  // Default to first available format
  const selectedFormat = ref(availableFormats.value[0]?.value || 'auto')

  // Channel mode: stereo or mono
  const selectedChannelMode = ref('mono')

  const canStartRecording = computed(() => {
    return selectedDuration.value && store.isAlarmRunning && !store.isRecording
  })

  function handleStartRecording() {
    if (!canStartRecording.value) return
    startRecording(
      selectedDuration.value,
      selectedFormat.value,
      selectedChannelMode.value === 'mono'
    )
  }

  function handleDownload() {
    // Reset download link after short delay to allow download to start
    setTimeout(() => {
      resetDownload()
    }, 100)
  }

  function handleDismiss() {
    converter.value?.reset()
    resetDownload()
    toast.info('toast_rec_dismissed')
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

  /* Success feedback */
  .recording-success {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    margin-top: 0.75rem;
    background: linear-gradient(135deg, rgba(40, 167, 69, 0.15), rgba(40, 167, 69, 0.05));
    border: 1px solid rgba(40, 167, 69, 0.3);
    border-radius: 8px;
    color: #28a745;
    font-weight: 500;
    animation: successFadeIn 0.4s ease-out;
  }

  .recording-success i {
    font-size: 1.2rem;
    animation: successPulse 1s ease-in-out;
  }

  /* Download button animation */
  .download-ready {
    animation: downloadPulse 0.6s ease-out;
    border-color: #28a745 !important;
    color: #28a745 !important;
  }

  .download-ready:hover {
    background-color: #28a745 !important;
    color: white !important;
  }

  @keyframes successFadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes successPulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
  }

  @keyframes downloadPulse {
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.5);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 0 0 8px rgba(40, 167, 69, 0);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(40, 167, 69, 0);
    }
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
