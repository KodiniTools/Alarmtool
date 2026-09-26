<template>
  <div class="settings-menu">
    <div
      v-for="group in groups"
      :key="group.labelKey"
      class="settings-menu-group"
      role="group"
      :aria-label="t(group.labelKey)"
    >
      <span class="settings-menu-label">{{ t(group.labelKey) }}</span>
      <button
        v-for="item in group.items"
        :key="item.nameKey"
        type="button"
        class="settings-menu-item"
        @click="item.run"
      >
        <span class="settings-menu-icon"><i :class="item.icon" aria-hidden="true"></i></span>
        <span class="settings-menu-text">
          <span class="settings-menu-name">{{ t(item.nameKey) }}</span>
          <span class="settings-menu-desc">{{ t(item.descKey) }}</span>
        </span>
      </button>
    </div>
    <input
      ref="importInput"
      type="file"
      accept=".json,application/json"
      class="settings-import-input"
      tabindex="-1"
      aria-hidden="true"
      @change="importSettings"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useAlarmStore } from '@/stores/alarmStore'
  import { useAudioContext } from '@/composables/useAudioContext'
  import { useOscillators } from '@/composables/useOscillators'
  import { useToast } from '@/composables/useToast'
  import { useUndoRedo } from '@/composables/useUndoRedo'
  import { useI18n } from '@/i18n'
  import { normalizeOscSettings, pickOscParams } from '@/lib/oscillatorDefaults'

  const store = useAlarmStore()
  const { updateFilter } = useAudioContext()
  const { parsePattern } = useOscillators()
  const toast = useToast()
  const { withHistory } = useUndoRedo()
  const importInput = ref(null)

  const { t } = useI18n()

  function triggerImport() {
    importInput.value?.click()
  }

  const groups = [
    {
      labelKey: 'settings_group_local',
      items: [
        {
          nameKey: 'settings_save',
          descKey: 'settings_save_desc',
          icon: 'fas fa-save',
          run: saveSettings,
        },
        {
          nameKey: 'settings_load',
          descKey: 'settings_load_desc',
          icon: 'fas fa-folder-open',
          run: loadSettings,
        },
      ],
    },
    {
      labelKey: 'settings_group_file',
      items: [
        {
          nameKey: 'settings_export',
          descKey: 'settings_export_desc',
          icon: 'fas fa-file-export',
          run: exportSettings,
        },
        {
          nameKey: 'settings_import',
          descKey: 'settings_import_desc',
          icon: 'fas fa-file-import',
          run: triggerImport,
        },
      ],
    },
  ]

  function buildSnapshot() {
    return {
      globalFilter: {
        type: store.filterSettings.type,
        frequency: store.filterSettings.frequency,
        Q: store.filterSettings.Q,
      },
      oscillators: store.oscillators.map(pickOscParams),
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem('alarmToolSettings', JSON.stringify(buildSnapshot()))
      toast.success('toast_settings_saved')
    } catch {
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
      const settings = JSON.parse(raw)
      withHistory({ labelKey: 'settings_load' }, () => applySettings(settings))
      toast.success('toast_settings_loaded')
    } catch {
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
    } catch {
      toast.error('toast_settings_export_error')
    }
  }

  function importSettings(event) {
    const file = event.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target.result)
        withHistory({ labelKey: 'settings_import' }, () => applySettings(settings))
        toast.success('toast_settings_imported')
      } catch {
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
        store.updateOscillator(i, normalizeOscSettings(s))
        parsePattern(i)
      })
    }
  }
</script>
