<template>
  <!-- Format Conversion -->
  <div v-if="offerConversion && !isConverting" class="convert-section">
    <span class="convert-label">{{ t('rec_convert_label') }}</span>
    <div class="convert-actions">
      <UiButton size="sm" :disabled="isConverting" @click="handleConvert('mp3')">
        <i class="fas fa-file-audio"></i> MP3
      </UiButton>
      <UiButton size="sm" :disabled="isConverting" @click="handleConvert('wav')">
        <i class="fas fa-file-audio"></i> WAV
      </UiButton>
    </div>
  </div>

  <!-- Conversion Progress -->
  <div v-if="isConverting" class="convert-progress">
    <i class="fas fa-cog fa-spin"></i> {{ t('rec_converting') }}
    <div class="progress mt-1" style="height: 14px">
      <div
        class="progress-bar progress-bar-striped progress-bar-animated"
        role="progressbar"
        :style="{ width: conversionProgress + '%' }"
      ></div>
    </div>
  </div>

  <!-- Converted Download -->
  <div v-if="convertedUrl" class="convert-download">
    <UiButton
      :href="convertedUrl"
      :download="convertedFilename"
      class="download-ready"
      @click="handleConvertedDownload"
    >
      <i class="fas fa-download"></i> {{ t('rec_download') }} {{ convertedFilename }}
    </UiButton>
    <UiIconButton variant="danger" size="sm" :label="t('rec_dismiss')" @click="resetConversion">
      <i class="fas fa-times" aria-hidden="true"></i>
    </UiIconButton>
  </div>
</template>

<script setup>
  /**
   * Umwandlung einer fertigen Aufnahme nach MP3 oder WAV: Angebot, Fortschritt und
   * Download-Link. Der Zustand gehört dieser Komponente; `reset()` (per Template-Ref)
   * verwirft eine laufende oder fertige Umwandlung, z. B. wenn die Aufnahme verworfen wird.
   */
  import { useFormatConverter } from '@/composables/useFormatConverter'
  import { useI18n } from '@/i18n'
  import { UiButton, UiIconButton } from '@/components/ui'

  const props = defineProps({
    /** Zeigt das Umwandlungsangebot (solange die Aufnahme bereitsteht) */
    offerConversion: { type: Boolean, required: true },
    /** Die aufgenommene Datei; ohne sie passiert beim Klick nichts */
    recordedBlob: { type: Blob, default: null },
    /** Dateiname der Aufnahme; die Endung wird ersetzt */
    baseFilename: { type: String, required: true },
    /** Vor dem Kodieren auf Mono heruntermischen */
    mono: { type: Boolean, default: false },
  })

  const { t } = useI18n()
  const {
    isConverting,
    conversionProgress,
    convertedUrl,
    convertedFilename,
    convertBlob,
    resetConversion,
  } = useFormatConverter()

  async function handleConvert(targetFormat) {
    if (!props.recordedBlob) return
    resetConversion()
    try {
      await convertBlob(props.recordedBlob, targetFormat, props.baseFilename, props.mono)
    } catch {
      // Error already handled in composable
    }
  }

  function handleConvertedDownload() {
    setTimeout(() => {
      resetConversion()
    }, 100)
  }

  defineExpose({ reset: resetConversion })
</script>

<style scoped>
  .convert-section {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    margin-top: 0.75rem;
    background: linear-gradient(135deg, rgba(100, 149, 237, 0.1), rgba(100, 149, 237, 0.03));
    border: 1px solid rgba(100, 149, 237, 0.25);
    border-radius: 8px;
  }

  .convert-label {
    font-size: 0.9rem;
    opacity: 0.85;
    white-space: nowrap;
  }

  .convert-actions {
    display: flex;
    gap: 0.5rem;
  }

  .convert-progress {
    padding: 0.75rem 1rem;
    margin-top: 0.75rem;
    background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 193, 7, 0.03));
    border: 1px solid rgba(255, 193, 7, 0.25);
    border-radius: 8px;
    font-size: 0.9rem;
  }

  .convert-download {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.75rem;
    animation: successFadeIn 0.4s ease-out;
  }

  /* Download button animation (wie der Aufnahme-Download in RecorderControl) */
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
    .convert-section {
      flex-direction: column;
      align-items: flex-start;
    }

    .convert-download {
      flex-direction: column;
      align-items: stretch;
    }
  }
</style>
