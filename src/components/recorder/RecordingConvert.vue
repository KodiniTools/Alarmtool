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
    <UiButton :href="convertedUrl" :download="convertedFilename" @click="handleConvertedDownload">
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
