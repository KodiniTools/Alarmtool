<template>
  <div class="settings">
    <!-- Local group: Save / Load -->
    <div class="settings-group">
      <span class="settings-group-label">{{ t('settings_group_local') }}</span>
      <div class="settings-actions">
        <button class="settings-action-btn" @click="saveSettings">
          <span class="settings-action-icon"><i class="fas fa-save"></i></span>
          <span class="settings-action-body">
            <span class="settings-action-name">{{ t('settings_save') }}</span>
            <span class="settings-action-desc">{{ t('settings_save_desc') }}</span>
          </span>
        </button>
        <button class="settings-action-btn" @click="loadSettings">
          <span class="settings-action-icon"><i class="fas fa-folder-open"></i></span>
          <span class="settings-action-body">
            <span class="settings-action-name">{{ t('settings_load') }}</span>
            <span class="settings-action-desc">{{ t('settings_load_desc') }}</span>
          </span>
        </button>
      </div>
    </div>

    <!-- Divider -->
    <div class="settings-divider"></div>

    <!-- File group: Export / Import -->
    <div class="settings-group">
      <span class="settings-group-label">{{ t('settings_group_file') }}</span>
      <div class="settings-actions">
        <button class="settings-action-btn" @click="exportSettings">
          <span class="settings-action-icon"><i class="fas fa-file-export"></i></span>
          <span class="settings-action-body">
            <span class="settings-action-name">{{ t('settings_export') }}</span>
            <span class="settings-action-desc">{{ t('settings_export_desc') }}</span>
          </span>
        </button>
        <label class="settings-action-btn" tabindex="0" @keydown.enter="triggerImport">
          <span class="settings-action-icon"><i class="fas fa-file-import"></i></span>
          <span class="settings-action-body">
            <span class="settings-action-name">{{ t('settings_import') }}</span>
            <span class="settings-action-desc">{{ t('settings_import_desc') }}</span>
          </span>
          <input
            ref="importInput"
            type="file"
            accept=".json"
            class="settings-import-input"
            @change="importSettings"
          />
        </label>
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
  import { translations } from '@/i18n/translations'

  const store = useAlarmStore()
  const { updateFilter } = useAudioContext()
  const { parsePattern } = useOscillators()
  const toast = useToast()
  const importInput = ref(null)

  const t = (key) => translations[store.currentLang]?.[key] ?? key

  function triggerImport() {
    importInput.value?.click()
  }

  function buildSnapshot() {
    return {
      globalFilter: {
        type: store.filterSettings.type,
        frequency: store.filterSettings.frequency,
        Q: store.filterSettings.Q,
      },
      oscillators: store.oscillators.map((osc) => ({
        waveType: osc.waveType,
        frequency: osc.frequency,
        volume: osc.volume,
        pan: osc.pan,
        attack: osc.attack,
        decay: osc.decay,
        sustain: osc.sustain,
        release: osc.release,
        pattern: osc.pattern,
      })),
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem('alarmToolSettings', JSON.stringify(buildSnapshot()))
      toast.success('toast_settings_saved')
    } catch (_e) {
      toast.error('toast_settings_save_error')
    }
  }

  function loadSettings() {
    try {
      const raw = localStorage.getItem('alarmToolSettings')
      if (!raw) {
        toast.info('toast_settings_none')
        return
      }
      applySettings(JSON.parse(raw))
      toast.success('toast_settings_loaded')
    } catch (_e) {
      toast.error('toast_settings_load_error')
    }
  }

  function exportSettings() {
    try {
      const blob = new Blob([JSON.stringify(buildSnapshot(), null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'alarmToolSettings.json'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('toast_settings_exported')
    } catch (_e) {
      toast.error('toast_settings_export_error')
    }
  }

  function importSettings(event) {
    const file = event.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        applySettings(JSON.parse(e.target.result))
        toast.success('toast_settings_imported')
      } catch (_err) {
        toast.error('toast_settings_import_error')
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  function applySettings(settings) {
    if (settings.globalFilter) updateFilter(settings.globalFilter)
    if (settings.oscillators?.length === store.oscillators.length) {
      settings.oscillators.forEach((s, i) => {
        store.updateOscillator(i, {
          waveType: s.waveType,
          frequency: s.frequency,
          volume: s.volume,
          pan: s.pan,
          attack: s.attack,
          decay: s.decay ?? 50,
          sustain: s.sustain ?? 0.8,
          release: s.release,
          pattern: s.pattern,
        })
        parsePattern(i)
      })
    }
  }
</script>
