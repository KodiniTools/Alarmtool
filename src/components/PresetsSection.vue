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

          <!-- Preview Player -->
          <div class="preset-preview-player">
            <div class="preview-controls">
              <button
                class="preview-btn preview-btn-play"
                :class="{ active: activePresetId === preset.id && isPlaying && !isPaused }"
                :title="t('preview_play')"
                @click="handlePlay(preset)"
              >
                <i
                  :class="
                    activePresetId === preset.id && isPlaying && !isPaused
                      ? 'fas fa-pause'
                      : 'fas fa-play'
                  "
                ></i>
              </button>
              <button
                class="preview-btn preview-btn-stop"
                :disabled="activePresetId !== preset.id || !isPlaying"
                :title="t('preview_stop')"
                @click="handleStop(preset)"
              >
                <i class="fas fa-stop"></i>
              </button>
              <div class="preview-volume">
                <i class="fas fa-volume-down preview-volume-icon"></i>
                <input
                  type="range"
                  class="form-range preview-volume-slider"
                  min="0"
                  max="1"
                  step="0.01"
                  :value="previewVolume"
                  :title="t('preview_volume')"
                  @input="setPreviewVolume(parseFloat($event.target.value))"
                />
                <i class="fas fa-volume-up preview-volume-icon"></i>
              </div>
            </div>
            <div v-if="activePresetId === preset.id && isPlaying" class="preview-indicator">
              <span class="preview-indicator-dot"></span>
              <span class="preview-indicator-text">
                {{ isPaused ? t('preview_paused') : t('preview_playing') }}
              </span>
            </div>
          </div>
        </div>
        <button class="btn btn-primary preset-load-btn" @click="loadPreset(preset)">
          <i class="fas fa-download"></i> {{ t('presets_load') }}
        </button>
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
  import { usePresetPreview } from '@/composables/usePresetPreview'
  import { translations } from '@/i18n/translations'

  const store = useAlarmStore()
  const { updateFilter } = useAudioContext()
  const { parsePattern } = useOscillators()
  const toast = useToast()
  const {
    activePresetId,
    isPlaying,
    isPaused,
    previewVolume,
    playPreset,
    pausePreview,
    stopPreview,
    setPreviewVolume,
  } = usePresetPreview()

  const t = (key) => translations[store.currentLang]?.[key] || key

  const activePreset = ref(null)

  const defaultOsc = {
    waveType: 'sine',
    frequency: 440,
    volume: 0.5,
    pan: 0,
    attack: 20,
    decay: 50,
    sustain: 0.8,
    release: 80,
    pattern: '1500,300',
  }

  const presets = [
    {
      id: 'emergency',
      nameKey: 'preset_emergency_name',
      descKey: 'preset_emergency_desc',
      icon: 'fas fa-truck-medical',
      tags: ['preset_tag_sine', 'preset_tag_triangle', 'preset_tag_lowpass'],
      data: {
        globalFilter: { type: 'lowpass', frequency: 6000, Q: 0.8 },
        oscillators: [
          {
            waveType: 'sine',
            frequency: 660,
            volume: 0.7,
            pan: 0,
            attack: 80,
            release: 80,
            pattern: '700,50,700,50',
          },
          {
            waveType: 'sine',
            frequency: 880,
            volume: 0.7,
            pan: 0,
            attack: 80,
            release: 80,
            pattern: '50,700,50,700',
          },
          {
            waveType: 'triangle',
            frequency: 1320,
            volume: 0.15,
            pan: 0,
            attack: 150,
            release: 150,
            pattern: '700,50,700,50',
          },
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
        ],
      },
    },
    {
      id: 'industrial',
      nameKey: 'preset_industrial_name',
      descKey: 'preset_industrial_desc',
      icon: 'fas fa-industry',
      tags: ['preset_tag_sawtooth', 'preset_tag_square', 'preset_tag_lowpass'],
      data: {
        globalFilter: { type: 'lowpass', frequency: 3500, Q: 2.5 },
        oscillators: [
          {
            waveType: 'sawtooth',
            frequency: 180,
            volume: 0.65,
            pan: 0,
            attack: 20,
            release: 50,
            pattern: '400,600',
          },
          {
            waveType: 'square',
            frequency: 360,
            volume: 0.4,
            pan: -0.3,
            attack: 10,
            release: 30,
            pattern: '150,100,150,600',
          },
          {
            waveType: 'sawtooth',
            frequency: 540,
            volume: 0.25,
            pan: 0.3,
            attack: 30,
            release: 80,
            pattern: '400,600',
          },
          {
            waveType: 'square',
            frequency: 90,
            volume: 0.5,
            pan: 0,
            attack: 0,
            release: 0,
            pattern: '1000,1000',
          },
          {
            waveType: 'triangle',
            frequency: 720,
            volume: 0.15,
            pan: 0.6,
            attack: 50,
            release: 200,
            pattern: '200,200,200,400',
          },
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
        ],
      },
    },
    {
      id: 'wakeup',
      nameKey: 'preset_wakeup_name',
      descKey: 'preset_wakeup_desc',
      icon: 'fas fa-sun',
      tags: ['preset_tag_sine', 'preset_tag_triangle', 'preset_tag_soft'],
      data: {
        globalFilter: { type: 'lowpass', frequency: 4000, Q: 0.5 },
        oscillators: [
          {
            waveType: 'sine',
            frequency: 523,
            volume: 0.35,
            pan: -0.2,
            attack: 800,
            release: 600,
            pattern: '1500,1000',
          },
          {
            waveType: 'sine',
            frequency: 659,
            volume: 0.3,
            pan: 0.2,
            attack: 900,
            release: 700,
            pattern: '1000,1500',
          },
          {
            waveType: 'triangle',
            frequency: 784,
            volume: 0.2,
            pan: -0.4,
            attack: 1200,
            release: 800,
            pattern: '2000,500',
          },
          {
            waveType: 'sine',
            frequency: 1047,
            volume: 0.12,
            pan: 0.4,
            attack: 1500,
            release: 1000,
            pattern: '2500,1000',
          },
          {
            waveType: 'triangle',
            frequency: 392,
            volume: 0.18,
            pan: 0,
            attack: 1000,
            release: 1200,
            pattern: '3000,500',
          },
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
        ],
      },
    },
    {
      id: 'heartbeat',
      nameKey: 'preset_heartbeat_name',
      descKey: 'preset_heartbeat_desc',
      icon: 'fas fa-heartbeat',
      tags: ['preset_tag_sine', 'preset_tag_bandpass', 'preset_tag_medical'],
      data: {
        globalFilter: { type: 'bandpass', frequency: 1200, Q: 3 },
        oscillators: [
          {
            waveType: 'sine',
            frequency: 880,
            volume: 0.7,
            pan: 0,
            attack: 10,
            release: 40,
            pattern: '80,120,80,700',
          },
          {
            waveType: 'triangle',
            frequency: 1760,
            volume: 0.25,
            pan: 0,
            attack: 5,
            release: 30,
            pattern: '80,120,80,700',
          },
          {
            waveType: 'sine',
            frequency: 440,
            volume: 0.35,
            pan: 0,
            attack: 5,
            release: 60,
            pattern: '60,140,60,720',
          },
          {
            waveType: 'sine',
            frequency: 660,
            volume: 0.15,
            pan: -0.5,
            attack: 0,
            release: 100,
            pattern: '50,50,50,830',
          },
          {
            waveType: 'sine',
            frequency: 660,
            volume: 0.15,
            pan: 0.5,
            attack: 0,
            release: 100,
            pattern: '830,50,50,50',
          },
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
        ],
      },
    },
    {
      id: 'scifi',
      nameKey: 'preset_scifi_name',
      descKey: 'preset_scifi_desc',
      icon: 'fas fa-satellite',
      tags: ['preset_tag_sawtooth', 'preset_tag_stereo', 'preset_tag_highpass'],
      data: {
        globalFilter: { type: 'highpass', frequency: 150, Q: 1.5 },
        oscillators: [
          {
            waveType: 'sawtooth',
            frequency: 200,
            volume: 0.3,
            pan: -0.8,
            attack: 500,
            release: 300,
            pattern: '800,400',
          },
          {
            waveType: 'sawtooth',
            frequency: 203,
            volume: 0.3,
            pan: 0.8,
            attack: 500,
            release: 300,
            pattern: '400,800',
          },
          {
            waveType: 'square',
            frequency: 800,
            volume: 0.2,
            pan: -0.6,
            attack: 200,
            release: 150,
            pattern: '150,100,150,100,150,350',
          },
          {
            waveType: 'square',
            frequency: 1200,
            volume: 0.15,
            pan: 0.6,
            attack: 150,
            release: 200,
            pattern: '350,150,100,150,100,150',
          },
          {
            waveType: 'sine',
            frequency: 1600,
            volume: 0.12,
            pan: -1,
            attack: 300,
            release: 400,
            pattern: '600,200,200,200',
          },
          {
            waveType: 'sine',
            frequency: 1600,
            volume: 0.12,
            pan: 1,
            attack: 300,
            release: 400,
            pattern: '200,200,600,200',
          },
          {
            waveType: 'triangle',
            frequency: 100,
            volume: 0.5,
            pan: 0,
            attack: 0,
            release: 0,
            pattern: '2400,100',
          },
          {
            waveType: 'sine',
            frequency: 400,
            volume: 0.1,
            pan: -0.3,
            attack: 1000,
            release: 500,
            pattern: '1200,300',
          },
          {
            waveType: 'sine',
            frequency: 600,
            volume: 0.1,
            pan: 0.3,
            attack: 1000,
            release: 500,
            pattern: '300,1200',
          },
          defaultOsc,
          defaultOsc,
          defaultOsc,
        ],
      },
    },
    {
      id: 'airraid',
      nameKey: 'preset_airraid_name',
      descKey: 'preset_airraid_desc',
      icon: 'fas fa-tower-broadcast',
      tags: ['preset_tag_sawtooth', 'preset_tag_siren', 'preset_tag_aggressive'],
      data: {
        globalFilter: { type: 'lowpass', frequency: 5000, Q: 3 },
        oscillators: [
          {
            waveType: 'sawtooth',
            frequency: 430,
            volume: 0.8,
            pan: -0.3,
            attack: 300,
            release: 300,
            pattern: '1800,200',
          },
          {
            waveType: 'sawtooth',
            frequency: 520,
            volume: 0.7,
            pan: 0.3,
            attack: 300,
            release: 300,
            pattern: '200,1800',
          },
          {
            waveType: 'sawtooth',
            frequency: 660,
            volume: 0.5,
            pan: 0,
            attack: 200,
            release: 200,
            pattern: '1000,1000',
          },
          {
            waveType: 'square',
            frequency: 220,
            volume: 0.5,
            pan: 0,
            attack: 0,
            release: 0,
            pattern: '2000,100',
          },
          {
            waveType: 'triangle',
            frequency: 880,
            volume: 0.2,
            pan: 0.5,
            attack: 400,
            release: 400,
            pattern: '1500,500',
          },
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
        ],
      },
    },
    {
      id: 'klaxon',
      nameKey: 'preset_klaxon_name',
      descKey: 'preset_klaxon_desc',
      icon: 'fas fa-bullhorn',
      tags: ['preset_tag_square', 'preset_tag_aggressive', 'preset_tag_harsh'],
      data: {
        globalFilter: { type: 'lowpass', frequency: 2500, Q: 4 },
        oscillators: [
          {
            waveType: 'square',
            frequency: 165,
            volume: 0.75,
            pan: 0,
            attack: 5,
            release: 20,
            pattern: '400,120',
          },
          {
            waveType: 'sawtooth',
            frequency: 220,
            volume: 0.6,
            pan: 0,
            attack: 5,
            release: 20,
            pattern: '400,120',
          },
          {
            waveType: 'square',
            frequency: 330,
            volume: 0.4,
            pan: -0.4,
            attack: 5,
            release: 20,
            pattern: '400,120',
          },
          {
            waveType: 'square',
            frequency: 110,
            volume: 0.5,
            pan: 0,
            attack: 0,
            release: 0,
            pattern: '400,120',
          },
          {
            waveType: 'triangle',
            frequency: 495,
            volume: 0.2,
            pan: 0.4,
            attack: 10,
            release: 40,
            pattern: '400,120',
          },
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
        ],
      },
    },
    {
      id: 'panic',
      nameKey: 'preset_panic_name',
      descKey: 'preset_panic_desc',
      icon: 'fas fa-triangle-exclamation',
      tags: ['preset_tag_square', 'preset_tag_harsh', 'preset_tag_highpass'],
      data: {
        globalFilter: { type: 'highpass', frequency: 800, Q: 2 },
        oscillators: [
          {
            waveType: 'square',
            frequency: 2000,
            volume: 0.5,
            pan: -0.5,
            attack: 2,
            release: 10,
            pattern: '90,60,90,300',
          },
          {
            waveType: 'square',
            frequency: 2500,
            volume: 0.45,
            pan: 0.5,
            attack: 2,
            release: 10,
            pattern: '90,60,90,300',
          },
          {
            waveType: 'sawtooth',
            frequency: 3000,
            volume: 0.3,
            pan: 0,
            attack: 2,
            release: 10,
            pattern: '60,60,60,60,60,300',
          },
          {
            waveType: 'square',
            frequency: 1500,
            volume: 0.4,
            pan: 0,
            attack: 2,
            release: 10,
            pattern: '90,60,90,300',
          },
          {
            waveType: 'sine',
            frequency: 4000,
            volume: 0.12,
            pan: 0,
            attack: 0,
            release: 20,
            pattern: '45,45,45,600',
          },
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
        ],
      },
    },
    {
      id: 'redalert',
      nameKey: 'preset_redalert_name',
      descKey: 'preset_redalert_desc',
      icon: 'fas fa-radiation',
      tags: ['preset_tag_sawtooth', 'preset_tag_aggressive', 'preset_tag_bandpass'],
      data: {
        globalFilter: { type: 'bandpass', frequency: 1000, Q: 5 },
        oscillators: [
          {
            waveType: 'sawtooth',
            frequency: 466,
            volume: 0.7,
            pan: -0.6,
            attack: 60,
            release: 120,
            pattern: '500,250',
          },
          {
            waveType: 'sawtooth',
            frequency: 659,
            volume: 0.6,
            pan: 0.6,
            attack: 60,
            release: 120,
            pattern: '500,250',
          },
          {
            waveType: 'square',
            frequency: 233,
            volume: 0.5,
            pan: 0,
            attack: 20,
            release: 60,
            pattern: '500,250',
          },
          {
            waveType: 'sawtooth',
            frequency: 932,
            volume: 0.3,
            pan: 0,
            attack: 40,
            release: 100,
            pattern: '250,250,500',
          },
          {
            waveType: 'triangle',
            frequency: 1245,
            volume: 0.15,
            pan: 0.3,
            attack: 50,
            release: 150,
            pattern: '750,250',
          },
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
        ],
      },
    },
    {
      id: 'malfunction',
      nameKey: 'preset_malfunction_name',
      descKey: 'preset_malfunction_desc',
      icon: 'fas fa-bug',
      tags: ['preset_tag_square', 'preset_tag_aggressive', 'preset_tag_harsh'],
      data: {
        globalFilter: { type: 'lowpass', frequency: 4000, Q: 6 },
        oscillators: [
          {
            waveType: 'square',
            frequency: 300,
            volume: 0.6,
            pan: -0.5,
            attack: 0,
            release: 5,
            pattern: '40,40,40,40,40,200',
          },
          {
            waveType: 'sawtooth',
            frequency: 450,
            volume: 0.5,
            pan: 0.5,
            attack: 0,
            release: 5,
            pattern: '40,80,40,40,200',
          },
          {
            waveType: 'square',
            frequency: 600,
            volume: 0.4,
            pan: 0,
            attack: 0,
            release: 5,
            pattern: '30,30,30,30,30,30,200',
          },
          {
            waveType: 'sawtooth',
            frequency: 150,
            volume: 0.55,
            pan: 0,
            attack: 0,
            release: 0,
            pattern: '80,40',
          },
          {
            waveType: 'square',
            frequency: 1200,
            volume: 0.25,
            pan: -0.3,
            attack: 0,
            release: 5,
            pattern: '25,25,25,375',
          },
          {
            waveType: 'triangle',
            frequency: 900,
            volume: 0.2,
            pan: 0.3,
            attack: 0,
            release: 10,
            pattern: '50,50,50,350',
          },
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
          defaultOsc,
        ],
      },
    },
  ]

  function handlePlay(preset) {
    if (activePresetId.value === preset.id && isPlaying.value && !isPaused.value) {
      pausePreview()
    } else {
      playPreset(preset)
    }
  }

  function handleStop(preset) {
    if (activePresetId.value === preset.id) {
      stopPreview()
    }
  }

  function getActivePresetName() {
    const preset = presets.find((p) => p.id === activePreset.value)
    return preset ? t(preset.nameKey) : ''
  }

  function resetToDefaults() {
    // Stop any preview
    if (isPlaying.value) {
      stopPreview()
    }

    // Reset filter to none
    updateFilter({ type: 'none', frequency: 1000, Q: 1 })

    // Reset all oscillators to defaults, first 3 enabled
    store.oscillators.forEach((_, index) => {
      store.updateOscillator(index, {
        enabled: index < 3,
        ...defaultOsc,
      })
      parsePattern(index)
    })

    activePreset.value = null
    toast.info('toast_preset_reset')
  }

  function isDefaultOsc(oscSettings) {
    return (
      oscSettings.frequency === defaultOsc.frequency &&
      oscSettings.volume === defaultOsc.volume &&
      oscSettings.waveType === defaultOsc.waveType &&
      oscSettings.pattern === defaultOsc.pattern
    )
  }

  function loadPreset(preset) {
    try {
      // Stop any preview that is playing
      if (isPlaying.value) {
        stopPreview()
      }

      const settings = preset.data

      if (settings.globalFilter) {
        updateFilter(settings.globalFilter)
      }

      if (settings.oscillators && settings.oscillators.length === store.oscillators.length) {
        settings.oscillators.forEach((oscSettings, index) => {
          const shouldEnable = !isDefaultOsc(oscSettings)
          store.updateOscillator(index, {
            enabled: shouldEnable,
            waveType: oscSettings.waveType,
            frequency: oscSettings.frequency,
            volume: oscSettings.volume,
            pan: oscSettings.pan,
            attack: oscSettings.attack,
            decay: oscSettings.decay ?? 50,
            sustain: oscSettings.sustain ?? 0.8,
            release: oscSettings.release,
            pattern: oscSettings.pattern,
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
