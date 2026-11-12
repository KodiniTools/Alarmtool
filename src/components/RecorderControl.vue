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

<script setup lang="ts">
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
