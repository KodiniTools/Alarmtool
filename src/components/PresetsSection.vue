<template>
  <div>
    <h2>{{ t('presets_title') }}</h2>
    <p class="presets-intro">{{ t('presets_intro') }}</p>

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
            <span class="preset-tag" v-for="tag in preset.tags" :key="tag">
              {{ t(tag) }}
            </span>
          </div>
        </div>
        <button
          class="btn btn-primary preset-load-btn"
          @click="loadPreset(preset)"
        >
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
import { translations } from '@/i18n/translations'

const store = useAlarmStore()
const { updateFilter } = useAudioContext()
const { parsePattern } = useOscillators()

const t = (key) => translations[store.currentLang]?.[key] || key

const activePreset = ref(null)

const defaultOsc = {
  waveType: 'sine',
  frequency: 440,
  volume: 0.5,
  pan: 0,
  attack: 100,
  release: 100,
  pattern: '300,200,500,100'
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
        { waveType: 'sine', frequency: 660, volume: 0.7, pan: 0, attack: 80, release: 80, pattern: '700,50,700,50' },
        { waveType: 'sine', frequency: 880, volume: 0.7, pan: 0, attack: 80, release: 80, pattern: '50,700,50,700' },
        { waveType: 'triangle', frequency: 1320, volume: 0.15, pan: 0, attack: 150, release: 150, pattern: '700,50,700,50' },
        defaultOsc, defaultOsc, defaultOsc, defaultOsc, defaultOsc, defaultOsc, defaultOsc, defaultOsc, defaultOsc
      ]
    }
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
        { waveType: 'sawtooth', frequency: 180, volume: 0.65, pan: 0, attack: 20, release: 50, pattern: '400,600' },
        { waveType: 'square', frequency: 360, volume: 0.4, pan: -0.3, attack: 10, release: 30, pattern: '150,100,150,600' },
        { waveType: 'sawtooth', frequency: 540, volume: 0.25, pan: 0.3, attack: 30, release: 80, pattern: '400,600' },
        { waveType: 'square', frequency: 90, volume: 0.5, pan: 0, attack: 0, release: 0, pattern: '1000,1000' },
        { waveType: 'triangle', frequency: 720, volume: 0.15, pan: 0.6, attack: 50, release: 200, pattern: '200,200,200,400' },
        defaultOsc, defaultOsc, defaultOsc, defaultOsc, defaultOsc, defaultOsc, defaultOsc
      ]
    }
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
        { waveType: 'sine', frequency: 523, volume: 0.35, pan: -0.2, attack: 800, release: 600, pattern: '1500,1000' },
        { waveType: 'sine', frequency: 659, volume: 0.3, pan: 0.2, attack: 900, release: 700, pattern: '1000,1500' },
        { waveType: 'triangle', frequency: 784, volume: 0.2, pan: -0.4, attack: 1200, release: 800, pattern: '2000,500' },
        { waveType: 'sine', frequency: 1047, volume: 0.12, pan: 0.4, attack: 1500, release: 1000, pattern: '2500,1000' },
        { waveType: 'triangle', frequency: 392, volume: 0.18, pan: 0, attack: 1000, release: 1200, pattern: '3000,500' },
        defaultOsc, defaultOsc, defaultOsc, defaultOsc, defaultOsc, defaultOsc, defaultOsc
      ]
    }
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
        { waveType: 'sine', frequency: 880, volume: 0.7, pan: 0, attack: 10, release: 40, pattern: '80,120,80,700' },
        { waveType: 'triangle', frequency: 1760, volume: 0.25, pan: 0, attack: 5, release: 30, pattern: '80,120,80,700' },
        { waveType: 'sine', frequency: 440, volume: 0.35, pan: 0, attack: 5, release: 60, pattern: '60,140,60,720' },
        { waveType: 'sine', frequency: 660, volume: 0.15, pan: -0.5, attack: 0, release: 100, pattern: '50,50,50,830' },
        { waveType: 'sine', frequency: 660, volume: 0.15, pan: 0.5, attack: 0, release: 100, pattern: '830,50,50,50' },
        defaultOsc, defaultOsc, defaultOsc, defaultOsc, defaultOsc, defaultOsc, defaultOsc
      ]
    }
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
        { waveType: 'sawtooth', frequency: 200, volume: 0.3, pan: -0.8, attack: 500, release: 300, pattern: '800,400' },
        { waveType: 'sawtooth', frequency: 203, volume: 0.3, pan: 0.8, attack: 500, release: 300, pattern: '400,800' },
        { waveType: 'square', frequency: 800, volume: 0.2, pan: -0.6, attack: 200, release: 150, pattern: '150,100,150,100,150,350' },
        { waveType: 'square', frequency: 1200, volume: 0.15, pan: 0.6, attack: 150, release: 200, pattern: '350,150,100,150,100,150' },
        { waveType: 'sine', frequency: 1600, volume: 0.12, pan: -1, attack: 300, release: 400, pattern: '600,200,200,200' },
        { waveType: 'sine', frequency: 1600, volume: 0.12, pan: 1, attack: 300, release: 400, pattern: '200,200,600,200' },
        { waveType: 'triangle', frequency: 100, volume: 0.5, pan: 0, attack: 0, release: 0, pattern: '2400,100' },
        { waveType: 'sine', frequency: 400, volume: 0.1, pan: -0.3, attack: 1000, release: 500, pattern: '1200,300' },
        { waveType: 'sine', frequency: 600, volume: 0.1, pan: 0.3, attack: 1000, release: 500, pattern: '300,1200' },
        defaultOsc, defaultOsc, defaultOsc
      ]
    }
  }
]

function loadPreset(preset) {
  try {
    const settings = preset.data

    if (settings.globalFilter) {
      updateFilter(settings.globalFilter)
    }

    if (settings.oscillators && settings.oscillators.length === store.oscillators.length) {
      settings.oscillators.forEach((oscSettings, index) => {
        store.updateOscillator(index, {
          waveType: oscSettings.waveType,
          frequency: oscSettings.frequency,
          volume: oscSettings.volume,
          pan: oscSettings.pan,
          attack: oscSettings.attack,
          release: oscSettings.release,
          pattern: oscSettings.pattern
        })
        parsePattern(index)
      })
    }

    activePreset.value = preset.id
  } catch (error) {
    console.error('Error loading preset:', error)
  }
}
</script>
