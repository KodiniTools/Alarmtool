<template>
  <div>
    <h2>{{ t('settings_title') }}</h2>
    <div class="settings-panel">
      <!-- Save Button -->
      <button
        id="saveSettings"
        class="btn btn-secondary"
        @click="saveSettings"
      >
        <i class="fas fa-save"></i> {{ t('settings_save') }}
      </button>

      <!-- Load Button -->
      <button
        id="loadSettings"
        class="btn btn-secondary"
        @click="loadSettings"
      >
        <i class="fas fa-folder-open"></i> {{ t('settings_load') }}
      </button>

      <!-- Export Button -->
      <button
        id="exportSettings"
        class="btn btn-secondary"
        @click="exportSettings"
      >
        <i class="fas fa-file-export"></i> {{ t('settings_export') }}
      </button>

      <!-- Import Button -->
      <label for="importSettings" class="btn btn-secondary" style="margin-bottom: 0;">
        <i class="fas fa-file-import"></i> {{ t('settings_import') }}
      </label>
      <input
        id="importSettings"
        type="file"
        accept=".json"
        style="display: none;"
        @change="importSettings"
      />
    </div>
  </div>
</template>

<script setup>
import { useAlarmStore } from '@/stores/alarmStore'
import { useAudioContext } from '@/composables/useAudioContext'
import { useOscillators } from '@/composables/useOscillators'
import { translations } from '@/i18n/translations'

const store = useAlarmStore()
const { updateFilter } = useAudioContext()
const { parsePattern } = useOscillators()

const t = (key) => translations[store.currentLang]?.[key] || key

function saveSettings() {
  try {
    const settings = {
      globalFilter: {
        type: store.filterSettings.type,
        frequency: store.filterSettings.frequency,
        Q: store.filterSettings.Q
      },
      oscillators: store.oscillators.map((osc) => ({
        waveType: osc.waveType,
        frequency: osc.frequency,
        volume: osc.volume,
        pan: osc.pan,
        attack: osc.attack,
        release: osc.release,
        pattern: osc.pattern
      }))
    }
    localStorage.setItem('alarmToolSettings', JSON.stringify(settings))
    alert('Einstellungen wurden gespeichert.')
  } catch (error) {
    console.error('Fehler beim Speichern:', error)
    alert('Fehler beim Speichern der Einstellungen.')
  }
}

function loadSettings() {
  try {
    const settingsStr = localStorage.getItem('alarmToolSettings')
    if (!settingsStr) {
      alert('Keine gespeicherten Einstellungen gefunden.')
      return
    }
    const settings = JSON.parse(settingsStr)
    applySettings(settings)
    alert('Einstellungen wurden geladen.')
  } catch (error) {
    console.error('Fehler beim Laden:', error)
    alert('Fehler beim Laden der Einstellungen.')
  }
}

function exportSettings() {
  try {
    const settings = {
      globalFilter: {
        type: store.filterSettings.type,
        frequency: store.filterSettings.frequency,
        Q: store.filterSettings.Q
      },
      oscillators: store.oscillators.map((osc) => ({
        waveType: osc.waveType,
        frequency: osc.frequency,
        volume: osc.volume,
        pan: osc.pan,
        attack: osc.attack,
        release: osc.release,
        pattern: osc.pattern
      }))
    }
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'alarmToolSettings.json'
    a.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Fehler beim Exportieren:', error)
    alert('Fehler beim Exportieren der Einstellungen.')
  }
}

function importSettings(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const settings = JSON.parse(e.target.result)
      applySettings(settings)
      alert('Einstellungen wurden importiert.')
    } catch (err) {
      console.error('Fehler beim Importieren:', err)
      alert('Fehler beim Importieren der Einstellungen. Stelle sicher, dass die Datei korrekt ist.')
    }
  }
  reader.readAsText(file)
  
  // Reset input
  event.target.value = ''
}

function applySettings(settings) {
  try {
    // Apply filter settings
    if (settings.globalFilter) {
      updateFilter(settings.globalFilter)
    }

    // Apply oscillator settings
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
        
        // Parse pattern for this oscillator
        parsePattern(index)
      })
    }
  } catch (error) {
    console.error('Fehler beim Anwenden der Einstellungen:', error)
    alert('Fehler beim Anwenden der Einstellungen.')
  }
}
</script>
