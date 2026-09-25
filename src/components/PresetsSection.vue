<template>
  <div>
    <h2>{{ t('presets_title') }}</h2>
    <p class="presets-intro">{{ t('presets_intro') }}</p>

    <!-- Active Preset Banner -->
    <div v-if="activePreset" class="preset-active-banner">
      <div class="preset-active-info">
        <i class="fas fa-check-circle"></i>
        <span
          >{{ t('preset_active_label') }}: <strong>{{ getActivePresetName() }}</strong></span
        >
      </div>
      <button
        class="btn btn-secondary preset-reset-btn"
        :title="t('preset_reset_title')"
        @click="resetToDefaults"
      >
        <i class="fas fa-undo"></i> {{ t('preset_reset') }}
      </button>
    </div>

    <div class="presets-grid">
      <div
        v-for="preset in presets"
        :key="preset.id"
        class="preset-card"
        :class="{ 'preset-active': activePreset === preset.id }"
      >
        <div class="preset-icon">
          <i :class="preset.icon"></i>
        </div>
        <div class="preset-info">
          <h3 class="preset-name">{{ t(preset.nameKey) }}</h3>
          <p class="preset-description">{{ t(preset.descKey) }}</p>
          <div class="preset-tags">
            <span v-for="tag in preset.tags" :key="tag" class="preset-tag">
              {{ t(tag) }}
            </span>
          </div>

          <!-- Play via the sticky player -->
          <div class="preset-play">
            <button
              class="preset-play-btn"
              :class="{ active: activePreset === preset.id && store.isPlaying }"
              :title="t('preset_play')"
              :aria-label="t('preset_play')"
              @click="playPreset(preset)"
            >
              <i class="fas fa-play" aria-hidden="true"></i>
              <span>{{ t('preset_play') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useAlarmStore } from '@/stores/alarmStore'
  import { useAudioContext } from '@/composables/useAudioContext'
  import { useOscillators } from '@/composables/useOscillators'
  import { useToast } from '@/composables/useToast'
  import { usePlayer } from '@/composables/usePlayer'
  import { useI18n } from '@/i18n'
  import { PRESETS as presets } from '@/data/presets'
  import {
    DEFAULT_ENABLED_COUNT,
    DEFAULT_FILTER,
    DEFAULT_OSCILLATOR,
    normalizeOscSettings,
  } from '@/lib/oscillatorDefaults'

  const store = useAlarmStore()
  const { updateFilter } = useAudioContext()
  const { parsePattern } = useOscillators()
  const { restartAlarm, stopAlarm } = usePlayer()
  const toast = useToast()
  const { t } = useI18n()

  const activePreset = ref(null)

  // Load the preset and (re)start the sticky player so it takes over playback.
  function playPreset(preset) {
    loadPreset(preset)
    restartAlarm()

    // Tell the sticky player which preset is sounding (startAlarm resets this
    // to "custom", so set it afterwards).
    store.activePresetKey = preset.nameKey

    // Apply the preset's filter to the live node explicitly: on a freshly
    // created audio context the filter node defaults to allpass and ignores
    // the stored filter type, so re-apply it after the context exists.
    if (preset.data.globalFilter) {
      updateFilter(preset.data.globalFilter)
    }
  }

  function getActivePresetName() {
    const preset = presets.find((p) => p.id === activePreset.value)
    return preset ? t(preset.nameKey) : ''
  }

  function resetToDefaults() {
    // Stop the sticky player if it is running
    if (store.isPlaying) {
      stopAlarm()
    }

    // Reset filter to none
    updateFilter({ ...DEFAULT_FILTER })

    // Reset all oscillators to defaults, first ones enabled
    store.oscillators.forEach((_, index) => {
      store.updateOscillator(index, {
        enabled: index < DEFAULT_ENABLED_COUNT,
        ...DEFAULT_OSCILLATOR,
      })
      parsePattern(index)
    })

    activePreset.value = null
    toast.info('toast_preset_reset')
  }

  function isDefaultOsc(oscSettings) {
    return (
      oscSettings.frequency === DEFAULT_OSCILLATOR.frequency &&
      oscSettings.volume === DEFAULT_OSCILLATOR.volume &&
      oscSettings.waveType === DEFAULT_OSCILLATOR.waveType &&
      oscSettings.pattern === DEFAULT_OSCILLATOR.pattern
    )
  }

  function loadPreset(preset) {
    try {
      const settings = preset.data

      if (settings.globalFilter) {
        updateFilter(settings.globalFilter)
      }

      if (settings.oscillators && settings.oscillators.length === store.oscillators.length) {
        settings.oscillators.forEach((oscSettings, index) => {
          store.updateOscillator(index, {
            enabled: !isDefaultOsc(oscSettings),
            ...normalizeOscSettings(oscSettings),
          })
          parsePattern(index)
        })
      }

      activePreset.value = preset.id
      toast.success('toast_preset_loaded')
    } catch (error) {
      console.error('Error loading preset:', error)
      toast.error('toast_preset_load_error')
    }
  }
</script>
