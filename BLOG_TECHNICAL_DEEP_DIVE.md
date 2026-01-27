# Alarmtool: Ein technischer Deep Dive in moderne Web-Audio-Entwicklung

## Einleitung

Das **Alarmtool** ist eine vollständig im Browser laufende Anwendung zur Generierung komplexer, anpassbarer Alarmsignale. In diesem Blog-Post werden wir die technischen Lösungen, Architekturentscheidungen und Implementierungsdetails dieser Anwendung detailliert analysieren. Dieser Artikel eignet sich hervorragend zum Lernen moderner Web-Entwicklungspraktiken.

---

## Inhaltsverzeichnis

1. [Technologie-Stack](#1-technologie-stack)
2. [Projektstruktur](#2-projektstruktur)
3. [Vue 3 Composition API](#3-vue-3-composition-api)
4. [State Management mit Pinia](#4-state-management-mit-pinia)
5. [Web Audio API - Das Herzstück](#5-web-audio-api---das-herzstück)
6. [Das Oszillator-System](#6-das-oszillator-system)
7. [Audio-Effektkette](#7-audio-effektkette)
8. [Pattern-basierte Rhythmussteuerung](#8-pattern-basierte-rhythmussteuerung)
9. [Aufnahme-System mit MediaRecorder](#9-aufnahme-system-mit-mediarecorder)
10. [Internationalisierung (i18n)](#10-internationalisierung-i18n)
11. [Theming mit CSS Custom Properties](#11-theming-mit-css-custom-properties)
12. [Keyboard-Shortcuts](#12-keyboard-shortcuts)
13. [Build-Konfiguration mit Vite](#13-build-konfiguration-mit-vite)
14. [Best Practices und Patterns](#14-best-practices-und-patterns)
15. [Zusammenfassung](#15-zusammenfassung)

---

## 1. Technologie-Stack

### Frontend-Framework

```javascript
// package.json - Kerndependencies
{
  "dependencies": {
    "vue": "^3.4.0",      // Reaktives UI-Framework
    "pinia": "^2.1.7"     // State Management
  },
  "devDependencies": {
    "vite": "^5.0.0",     // Build-Tool
    "@vitejs/plugin-vue": "^5.0.0"
  }
}
```

**Vue 3** wurde gewählt wegen:
- Reaktiver Datenbindung für Echtzeit-UI-Updates
- Composition API für bessere Code-Organisation
- Exzellenter Performance durch Virtual DOM Diffing
- Großer Community und Ökosystem

**Pinia** ersetzt Vuex als State Manager und bietet:
- Einfachere API mit weniger Boilerplate
- TypeScript-Support out-of-the-box
- Modularität und DevTools-Integration

**Vite** als Build-Tool ermöglicht:
- Instant Development Server (kein Bundling während Entwicklung)
- Hot Module Replacement (HMR)
- Optimierte Production Builds

### Browser-APIs

| API | Verwendungszweck |
|-----|------------------|
| **Web Audio API** | Oszillatoren, Filter, Effekte |
| **MediaRecorder API** | Audio-Aufnahme in verschiedenen Formaten |
| **LocalStorage API** | Persistente Benutzereinstellungen |

---

## 2. Projektstruktur

```
Alarmtool/
├── src/
│   ├── main.js                    # App-Initialisierung
│   ├── App.vue                    # Root-Komponente
│   ├── style.css                  # Globale Styles (895 Zeilen)
│   │
│   ├── components/                # 11 Vue-Komponenten
│   │   ├── TopToolbar.vue        # Sprache & Theme
│   │   ├── FilterControl.vue     # Globaler Filter
│   │   ├── OscillatorGrid.vue    # Oszillator-Grid
│   │   ├── OscillatorItem.vue    # Einzelner Oszillator
│   │   ├── PlayerControl.vue     # Play/Pause/Stop
│   │   ├── RecorderControl.vue   # Aufnahme
│   │   ├── SettingsPanel.vue     # Einstellungen
│   │   ├── FAQSection.vue        # FAQ
│   │   ├── CookieBanner.vue      # Cookie-Consent
│   │   ├── DonateButton.vue      # Spendenlink
│   │   └── AppFooter.vue         # Footer
│   │
│   ├── composables/              # 4 wiederverwendbare Logik-Module
│   │   ├── useAudioContext.js    # Audio-Kontext & Effekte
│   │   ├── useOscillators.js     # Oszillator-Management
│   │   ├── usePlayer.js          # Wiedergabe-Steuerung
│   │   └── useRecorder.js        # Aufnahme-Logik
│   │
│   ├── stores/
│   │   └── alarmStore.js         # Zentraler Pinia Store
│   │
│   └── i18n/
│       └── translations.js       # Übersetzungen DE/EN
│
├── index.html                     # Entry Point
├── vite.config.js                # Build-Konfiguration
└── package.json                  # Projektmetadaten
```

### Warum diese Struktur?

**Separation of Concerns** ist das Kernprinzip:
- **Components**: UI-Darstellung und Benutzerinteraktion
- **Composables**: Geschäftslogik und API-Interaktion
- **Stores**: Globaler Anwendungszustand
- **i18n**: Sprachspezifische Inhalte

---

## 3. Vue 3 Composition API

Die Composition API ist das moderne Paradigma in Vue 3. Sie ermöglicht bessere Code-Organisation und Wiederverwendbarkeit.

### Grundlegende Syntax

```vue
<!-- Beispiel: OscillatorItem.vue -->
<script setup>
import { ref, computed, watch } from 'vue'
import { useAlarmStore } from '@/stores/alarmStore'

// Reaktive Referenzen
const showAdvanced = ref(false)
const store = useAlarmStore()

// Props definieren
const props = defineProps({
  oscillator: { type: Object, required: true }
})

// Computed Properties
const frequencyLabel = computed(() =>
  `${props.oscillator.frequency} Hz`
)

// Watch für reaktive Änderungen
watch(() => props.oscillator.enabled, (newVal) => {
  if (newVal) {
    startOscillator()
  } else {
    stopOscillator()
  }
})

// Methoden
function toggleOscillator() {
  store.updateOscillator(props.oscillator.id, {
    enabled: !props.oscillator.enabled
  })
}
</script>

<template>
  <div class="oscillator-card">
    <button @click="toggleOscillator">
      {{ oscillator.enabled ? 'An' : 'Aus' }}
    </button>
    <span>{{ frequencyLabel }}</span>
  </div>
</template>
```

### Key Concepts erklärt

| Konzept | Beschreibung | Beispiel |
|---------|--------------|----------|
| `ref()` | Reaktiver Wrapper für primitive Werte | `const count = ref(0)` |
| `reactive()` | Reaktiver Wrapper für Objekte | `const state = reactive({ name: '' })` |
| `computed()` | Abgeleitete, gecachte Werte | `const double = computed(() => count.value * 2)` |
| `watch()` | Reaktion auf Wertänderungen | `watch(count, (newVal) => {...})` |
| `defineProps()` | Props von Parent-Komponente | `defineProps({ title: String })` |
| `defineEmits()` | Events an Parent senden | `const emit = defineEmits(['update'])` |

---

## 4. State Management mit Pinia

### Der zentrale Store

```javascript
// src/stores/alarmStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAlarmStore = defineStore('alarm', () => {
  // ============ AUDIO CONTEXT ============
  const audioCtx = ref(null)
  const masterGainNode = ref(null)
  const filterNode = ref(null)
  const delayNode = ref(null)
  const convolverNode = ref(null)
  const reverbGain = ref(null)
  const effectsOut = ref(null)

  // ============ PLAYBACK STATE ============
  const isPlaying = ref(false)
  const isPaused = ref(false)
  const currentTime = ref(0)
  const volume = ref(0.5)
  const isMuted = ref(false)
  const isLooping = ref(false)

  // ============ RECORDING STATE ============
  const isRecording = ref(false)
  const recordingDuration = ref(60000) // 1 Minute default
  const remainingTime = ref(0)

  // ============ USER PREFERENCES ============
  const currentLang = ref(localStorage.getItem('alarmtool-lang') || 'de')
  const currentTheme = ref(localStorage.getItem('alarmtool-theme') || 'dark')

  // ============ FILTER SETTINGS ============
  const filterSettings = ref({
    type: 'none',      // 'none', 'lowpass', 'highpass', 'bandpass', 'notch'
    frequency: 1000,   // Hz
    Q: 1               // Quality Factor
  })

  // ============ OSCILLATORS (12 Stück) ============
  const oscillators = ref(
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      enabled: false,
      oscillator: null,      // Web Audio OscillatorNode
      gainNode: null,        // GainNode für Lautstärke
      panNode: null,         // StereoPannerNode
      patternTimeoutId: null,
      patternSteps: [],
      patternIndex: 0,
      toneIsOn: false,
      waveType: 'sine',      // 'sine', 'square', 'sawtooth', 'triangle'
      frequency: 440,        // Hz
      volume: 0.5,           // 0-1
      pan: 0,                // -1 (links) bis 1 (rechts)
      attack: 100,           // ms
      release: 100,          // ms
      pattern: '300,200,500,100'  // Rhythmus-Pattern
    }))
  )

  // ============ COMPUTED PROPERTIES ============
  const activeOscillators = computed(() =>
    oscillators.value.filter(o => o.oscillator !== null)
  )

  const enabledOscillators = computed(() =>
    oscillators.value.filter(o => o.enabled)
  )

  // ============ ACTIONS ============
  function setLanguage(lang) {
    currentLang.value = lang
    localStorage.setItem('alarmtool-lang', lang)
  }

  function setTheme(theme) {
    currentTheme.value = theme
    localStorage.setItem('alarmtool-theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }

  function updateFilterSettings(settings) {
    filterSettings.value = { ...filterSettings.value, ...settings }
  }

  function updateOscillator(id, settings) {
    const osc = oscillators.value.find(o => o.id === id)
    if (osc) {
      Object.assign(osc, settings)
    }
  }

  function resetOscillators() {
    oscillators.value.forEach(osc => {
      if (osc.oscillator) {
        osc.oscillator.stop()
        osc.oscillator.disconnect()
      }
      if (osc.gainNode) osc.gainNode.disconnect()
      if (osc.panNode) osc.panNode.disconnect()
      if (osc.patternTimeoutId) clearTimeout(osc.patternTimeoutId)

      osc.oscillator = null
      osc.gainNode = null
      osc.panNode = null
      osc.patternTimeoutId = null
      osc.patternSteps = []
      osc.patternIndex = 0
      osc.toneIsOn = false
    })
  }

  // Store-Objekt zurückgeben
  return {
    // State
    audioCtx, masterGainNode, filterNode, delayNode,
    convolverNode, reverbGain, effectsOut,
    isPlaying, isPaused, currentTime, volume, isMuted, isLooping,
    isRecording, recordingDuration, remainingTime,
    currentLang, currentTheme,
    filterSettings, oscillators,
    // Computed
    activeOscillators, enabledOscillators,
    // Actions
    setLanguage, setTheme, updateFilterSettings,
    updateOscillator, resetOscillators
  }
})
```

### Pinia Store Pattern erklärt

**Setup Store Syntax** (Composition API Style):
```javascript
defineStore('storeName', () => {
  // ref() = state
  // computed() = getters
  // function = actions
  return { /* alles was exportiert werden soll */ }
})
```

**Vorteile dieses Patterns:**
1. **Volle TypeScript-Unterstützung** ohne zusätzliche Typdefinitionen
2. **Flexibilität**: Jede Composition API Funktion nutzbar
3. **Testbarkeit**: Einfaches Mocken einzelner Funktionen
4. **DevTools-Integration**: Vollständige Zeitreise-Debugging

---

## 5. Web Audio API - Das Herzstück

Die Web Audio API ist das Fundament der Audiogenerierung. Sie bietet ein modulares System aus Audio-Nodes.

### Audio Context Initialisierung

```javascript
// src/composables/useAudioContext.js

export function useAudioContext() {
  const store = useAlarmStore()

  async function initAudioContext() {
    // Erstelle neuen AudioContext wenn keiner existiert
    if (!store.audioCtx) {
      store.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    }

    // Browser erfordern User-Interaktion für Audio
    // Suspended Context wieder aufwecken
    if (store.audioCtx.state === 'suspended') {
      await store.audioCtx.resume()
    }

    // Master Gain Node für globale Lautstärke
    store.masterGainNode = store.audioCtx.createGain()
    store.masterGainNode.gain.value = store.volume

    return store.audioCtx
  }

  // ...
}
```

### Wichtig: Suspended State

Browser blockieren Audio standardmäßig bis zur ersten Benutzerinteraktion (Klick/Touch). Das `resume()` ist essentiell:

```javascript
// Pattern für sicheren Audio-Start
async function safelyStartAudio() {
  if (audioCtx.state === 'suspended') {
    await audioCtx.resume()
  }
  // Jetzt kann Audio abgespielt werden
}
```

### Audio Node Typen

| Node-Typ | Beschreibung | Verwendung |
|----------|--------------|------------|
| `OscillatorNode` | Generiert Wellenformen | Basis-Tonerzeugung |
| `GainNode` | Lautstärke-Kontrolle | Volume, Mute, Envelopes |
| `BiquadFilterNode` | Frequenz-Filter | Lowpass, Highpass, etc. |
| `StereoPannerNode` | Links/Rechts-Balance | Stereo-Positionierung |
| `DelayNode` | Zeitverzögerung | Echo-Effekte |
| `ConvolverNode` | Faltung mit Impulse Response | Reverb-Effekte |
| `AnalyserNode` | Frequenz-/Zeitdomäne-Analyse | Visualisierungen |

---

## 6. Das Oszillator-System

### Oszillator-Erstellung

```javascript
// src/composables/useOscillators.js

function createOscillator(oscId) {
  const osc = store.oscillators[oscId]
  const ctx = store.audioCtx

  // 1. Oszillator erstellen
  const oscillatorNode = ctx.createOscillator()
  oscillatorNode.type = osc.waveType       // 'sine', 'square', etc.
  oscillatorNode.frequency.value = osc.frequency

  // 2. Gain Node für Lautstärke & Envelope
  const gainNode = ctx.createGain()
  gainNode.gain.value = 0  // Startet stumm (Attack kommt später)

  // 3. Stereo Panner für Links/Rechts
  const panNode = ctx.createStereoPanner()
  panNode.pan.value = osc.pan

  // 4. Audio-Kette verbinden:
  // Oscillator → Gain → Panner → Master
  oscillatorNode.connect(gainNode)
  gainNode.connect(panNode)
  panNode.connect(store.masterGainNode)

  // 5. Oszillator starten
  oscillatorNode.start()

  // 6. Referenzen im Store speichern
  store.updateOscillator(oscId, {
    oscillator: oscillatorNode,
    gainNode: gainNode,
    panNode: panNode
  })
}
```

### Wellenformen visualisiert

```
SINE (Sinus):        SQUARE (Rechteck):
    ╭──╮                 ┌──┐  ┌──┐
   ╱    ╲             ───┘  └──┘  └──
  ╱      ╲
 ╱        ╲           TRIANGLE (Dreieck):
╱          ╲               /\    /\
            ╰──╯          /  \  /  \
                         /    \/    \

SAWTOOTH (Sägezahn):
   /|   /|   /|
  / |  / |  / |
 /  | /  | /  |
/   |/   |/   |
```

### Attack/Release Envelopes

Envelopes verhindern harte Klicks beim Ein-/Ausschalten:

```javascript
function setOscTone(oscId, on) {
  const osc = store.oscillators[oscId]
  const ctx = store.audioCtx
  const now = ctx.currentTime

  if (on) {
    // ATTACK: Sanftes Einblenden
    osc.gainNode.gain.cancelScheduledValues(now)
    osc.gainNode.gain.setValueAtTime(0, now)
    osc.gainNode.gain.linearRampToValueAtTime(
      osc.volume,
      now + osc.attack / 1000  // ms zu Sekunden
    )
  } else {
    // RELEASE: Sanftes Ausblenden
    osc.gainNode.gain.cancelScheduledValues(now)
    osc.gainNode.gain.setValueAtTime(osc.gainNode.gain.value, now)
    osc.gainNode.gain.linearRampToValueAtTime(
      0,
      now + osc.release / 1000
    )
  }

  osc.toneIsOn = on
}
```

### Visuelle Darstellung des Envelopes

```
Lautstärke
    │
max │     ╭─────────────────────╮
    │    ╱                       ╲
    │   ╱                         ╲
    │  ╱                           ╲
  0 │─╱                             ╲───
    └─────────────────────────────────── Zeit
      │←Attack→│←───Hold───→│←Release→│
```

---

## 7. Audio-Effektkette

### Signalfluss-Diagramm

```
┌─────────────────────────────────────────────────────────┐
│  12 Oszillatoren (Sine/Square/Sawtooth/Triangle)       │
│  Jeder mit: Frequenz, Gain, Pan, Attack/Release         │
└────────────────────────┬────────────────────────────────┘
                         │
                ┌────────▼─────────┐
                │ Stereo Panners   │
                │ (12 Instanzen)   │
                └────────┬─────────┘
                         │
                ┌────────▼──────────────┐
                │ Master Gain Node      │
                │ (Lautstärkeregelung)  │
                └────────┬──────────────┘
                         │
                ┌────────▼────────────────────┐
                │ BiquadFilter Node           │
                │ Lowpass/Highpass/Bandpass   │
                └────────┬────────────────────┘
                         │
                ┌────────▼──────────────┐
                │ Delay Node            │
                │ 250ms mit 25% Feedback│
                └────────┬──────────────┘
                         │
                ┌────────▼────────────────┐
                │ Convolver (Reverb)      │
                │ 2-Sek synthetische IR   │
                └────────┬────────────────┘
                         │
                ┌────────▼──────────────┐
                │ Reverb Gain Control   │
                │ 0.5 Standard-Volume   │
                └────────┬──────────────┘
                         │
                ┌────────▼──────────────┐
                │ AudioContext          │
                │ Destination (Speaker) │
                └───────────────────────┘
```

### Filter-Implementierung

```javascript
function setupGlobalFilter() {
  const ctx = store.audioCtx
  const settings = store.filterSettings

  // BiquadFilterNode erstellen
  store.filterNode = ctx.createBiquadFilter()

  if (settings.type === 'none') {
    // Bypass: Allpass-Filter ändert nichts
    store.filterNode.type = 'allpass'
  } else {
    store.filterNode.type = settings.type
    store.filterNode.frequency.value = settings.frequency
    store.filterNode.Q.value = settings.Q
  }

  // In die Kette einfügen
  store.masterGainNode.connect(store.filterNode)
  store.filterNode.connect(store.effectsOut)
}
```

### Filter-Typen erklärt

```
LOWPASS:                 HIGHPASS:
Dämpft hohe Frequenzen   Dämpft tiefe Frequenzen

Gain│                    Gain│
    │████                    │        ████
    │    ████                │    ████
    │        ████            │████
    └────────────▶ Hz        └────────────▶ Hz
         ↑ Cutoff                 ↑ Cutoff


BANDPASS:                NOTCH (Bandsperre):
Nur Mittenbereich durch  Sperrt Mittenbereich

Gain│                    Gain│
    │     ██                 │████    ████
    │   ████                 │    ████
    │ ████████               │
    └────────────▶ Hz        └────────────▶ Hz
         ↑ Center                 ↑ Center
```

### Reverb mit synthetischer Impulse Response

```javascript
function loadReverbImpulseResponse() {
  const ctx = store.audioCtx
  const length = ctx.sampleRate * 2  // 2 Sekunden
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate)

  // Stereo-Kanäle
  const leftChannel = impulse.getChannelData(0)
  const rightChannel = impulse.getChannelData(1)

  for (let i = 0; i < length; i++) {
    // Exponentieller Decay (natürlicher Hall)
    const decay = Math.pow(1 - i / length, 2)

    // Weißes Rauschen * Decay
    leftChannel[i] = (Math.random() * 2 - 1) * decay
    rightChannel[i] = (Math.random() * 2 - 1) * decay
  }

  store.convolverNode.buffer = impulse
}
```

**Erklärung**: Eine Impulse Response simuliert die akustischen Eigenschaften eines Raumes. Wir erzeugen synthetisch weißes Rauschen mit exponentiellem Abfall, was einen natürlichen Halleffekt erzeugt.

---

## 8. Pattern-basierte Rhythmussteuerung

### Das Pattern-System

Jeder Oszillator kann ein individuelles Rhythmus-Pattern haben:

```
Pattern: "300,200,500,100"
Interpretation:
  - 300ms Ton AN
  - 200ms Ton AUS
  - 500ms Ton AN
  - 100ms Ton AUS
  - Wiederholung...
```

### Implementierung mit setTimeout-Rekursion

```javascript
function parsePattern(oscId) {
  const osc = store.oscillators[oscId]
  const patternStr = osc.pattern.trim()

  // Pattern-String in Array umwandeln
  const steps = patternStr
    .split(',')
    .map(s => parseInt(s.trim(), 10))
    .filter(n => !isNaN(n) && n > 0)

  // Validierung: Mindestens 2 Werte (On + Off)
  if (steps.length < 2 || steps.length % 2 !== 0) {
    // Fallback-Pattern
    return [300, 200, 500, 100]
  }

  return steps
}

function runOscPattern(oscId) {
  const osc = store.oscillators[oscId]

  // Abbruchbedingung
  if (!store.isPlaying || !osc.enabled) return

  const steps = osc.patternSteps
  const stepIndex = osc.patternIndex
  const duration = steps[stepIndex]
  const isOnStep = stepIndex % 2 === 0  // Gerade = AN, Ungerade = AUS

  // Ton ein-/ausschalten
  setOscTone(oscId, isOnStep)

  // Nächsten Schritt planen
  osc.patternTimeoutId = setTimeout(() => {
    // Index weiterzählen (mit Wraparound)
    osc.patternIndex = (stepIndex + 1) % steps.length

    // Rekursiver Aufruf
    runOscPattern(oscId)
  }, duration)
}
```

### Visualisierung eines Patterns

```
Pattern: "300,200,500,100"

Zeit (ms):  0   300  500  1000 1100
            ├────┼────┼─────┼────┤
Ton:        ████      █████
            ON  OFF   ON   OFF
            300 200   500  100
```

### Mehrere Oszillatoren mit unterschiedlichen Patterns

```
Osc 1: "200,200"      ██  ██  ██  ██  ██  ██
Osc 2: "400,100"      ████ ████ ████ ████
Osc 3: "100,100,300"  █ █   ███ █ █   ███
                      ─────────────────────▶ Zeit

Ergebnis: Komplexer polyrhythmischer Alarm!
```

---

## 9. Aufnahme-System mit MediaRecorder

### Format-Erkennung

```javascript
// src/composables/useRecorder.js

function getRecordingOptions(format) {
  const options = { mimeType: '', audioBitsPerSecond: 128000 }

  // Browser-Kompatibilität prüfen
  switch (format) {
    case 'wav':
      if (MediaRecorder.isTypeSupported('audio/wav')) {
        options.mimeType = 'audio/wav'
        options.audioBitsPerSecond = 1411200  // CD-Qualität
      }
      break

    case 'webm':
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        options.mimeType = 'audio/webm;codecs=opus'
        options.audioBitsPerSecond = 320000  // Hohe Qualität
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        options.mimeType = 'audio/webm'
      }
      break

    case 'ogg':
      if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
        options.mimeType = 'audio/ogg;codecs=opus'
        options.audioBitsPerSecond = 320000
      }
      break
  }

  return options
}
```

### Aufnahme-Workflow

```javascript
async function startRecording(durationMs, format) {
  const ctx = store.audioCtx

  // 1. MediaStreamDestination erstellen
  const dest = ctx.createMediaStreamDestination()

  // 2. Effekt-Output mit Destination verbinden
  store.effectsOut.connect(dest)

  // 3. MediaRecorder konfigurieren
  const options = getRecordingOptions(format)
  mediaRecorder.value = new MediaRecorder(dest.stream, options)

  // 4. Daten sammeln
  const audioChunks = []
  mediaRecorder.value.ondataavailable = (e) => {
    if (e.data.size > 0) {
      audioChunks.push(e.data)
    }
  }

  // 5. Aufnahme beendet
  mediaRecorder.value.onstop = () => {
    const blob = new Blob(audioChunks, { type: options.mimeType })
    downloadUrl.value = URL.createObjectURL(blob)
    downloadFilename.value = `alarm_${Date.now()}.${format}`
  }

  // 6. Aufnahme starten
  mediaRecorder.value.start()
  store.isRecording = true

  // 7. Timer für automatisches Stoppen
  startRecordingTimer(durationMs)
}
```

### Unterstützte Formate

| Format | MIME-Type | Bitrate | Browser-Support |
|--------|-----------|---------|-----------------|
| WAV | `audio/wav` | ~1.4 Mbps | Chrome, Edge |
| WebM/Opus | `audio/webm;codecs=opus` | 320 kbps | Chrome, Firefox, Edge |
| OGG/Opus | `audio/ogg;codecs=opus` | 320 kbps | Firefox |

---

## 10. Internationalisierung (i18n)

### Übersetzungs-Struktur

```javascript
// src/i18n/translations.js

export const translations = {
  de: {
    // Navigation
    tabFilter: 'Filter',
    tabOscillators: 'Oszillatoren',
    tabRecording: 'Aufnahme',
    tabFaq: 'FAQ',

    // Filter-Kontrolle
    filterType: 'Filtertyp',
    filterNone: 'Kein Filter',
    filterLowpass: 'Tiefpass',
    filterHighpass: 'Hochpass',
    filterBandpass: 'Bandpass',
    filterNotch: 'Bandsperre',
    filterFrequency: 'Frequenz',
    filterQ: 'Q-Faktor',

    // Oszillator
    oscillatorTitle: 'Oszillator',
    waveType: 'Wellenform',
    frequency: 'Frequenz',
    volume: 'Lautstärke',
    pan: 'Balance',
    attack: 'Attack',
    release: 'Release',
    pattern: 'Pattern',

    // Player
    play: 'Abspielen',
    pause: 'Pause',
    stop: 'Stoppen',
    mute: 'Stumm',
    loop: 'Wiederholen',

    // ... weitere Übersetzungen
  },

  en: {
    tabFilter: 'Filter',
    tabOscillators: 'Oscillators',
    tabRecording: 'Recording',
    tabFaq: 'FAQ',

    filterType: 'Filter Type',
    filterNone: 'No Filter',
    filterLowpass: 'Lowpass',
    // ... etc.
  }
}
```

### Verwendung in Komponenten

```vue
<script setup>
import { computed } from 'vue'
import { useAlarmStore } from '@/stores/alarmStore'
import { translations } from '@/i18n/translations'

const store = useAlarmStore()

// Übersetzungsfunktion
const t = (key) => {
  return translations[store.currentLang]?.[key] || key
}
</script>

<template>
  <div>
    <h2>{{ t('filterType') }}</h2>
    <select>
      <option value="none">{{ t('filterNone') }}</option>
      <option value="lowpass">{{ t('filterLowpass') }}</option>
      <!-- ... -->
    </select>
  </div>
</template>
```

### Sprache wechseln

```javascript
// Im TopToolbar.vue
function switchLanguage(lang) {
  store.setLanguage(lang)  // Speichert auch in localStorage
}
```

---

## 11. Theming mit CSS Custom Properties

### Theme-Definition

```css
/* src/style.css */

/* Dark Mode (Standard) */
:root,
[data-theme="dark"] {
  --bg-primary: #0C0C10;
  --bg-secondary: #14141a;
  --bg-tertiary: #202028;
  --text-primary: #f0f0f2;
  --text-secondary: #a0a0a8;
  --accent-primary: #F2E28E;
  --accent-success: #7ec89b;
  --accent-danger: #e07070;
  --accent-info: #8ac4d6;
  --border-color: #2a2a35;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

/* Light Mode */
[data-theme="light"] {
  --bg-primary: #f8f7f5;
  --bg-secondary: #ffffff;
  --bg-tertiary: #f0f0f0;
  --text-primary: #1a1a1f;
  --text-secondary: #666666;
  --accent-primary: #c4a82e;
  --accent-success: #2d8a4e;
  --accent-danger: #c44040;
  --accent-info: #2980b9;
  --border-color: #e0e0e0;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Verwendung in Komponenten */
.card {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
}

.button-primary {
  background: var(--accent-primary);
  color: var(--bg-primary);
}

.button-primary:hover {
  filter: brightness(1.1);
}
```

### Theme-Wechsel implementieren

```javascript
// In alarmStore.js
function setTheme(theme) {
  currentTheme.value = theme
  localStorage.setItem('alarmtool-theme', theme)

  // DOM-Attribut setzen für CSS-Selektor
  document.documentElement.setAttribute('data-theme', theme)
}

// Beim App-Start Theme laden
onMounted(() => {
  const savedTheme = localStorage.getItem('alarmtool-theme') || 'dark'
  document.documentElement.setAttribute('data-theme', savedTheme)
})
```

### Theme Toggle Button

```vue
<!-- TopToolbar.vue -->
<template>
  <button @click="toggleTheme" :title="t('toggleTheme')">
    <i :class="store.currentTheme === 'dark'
      ? 'fa-solid fa-sun'
      : 'fa-solid fa-moon'"></i>
  </button>
</template>

<script setup>
function toggleTheme() {
  const newTheme = store.currentTheme === 'dark' ? 'light' : 'dark'
  store.setTheme(newTheme)
}
</script>
```

---

## 12. Keyboard-Shortcuts

### Implementierung

```javascript
// src/composables/usePlayer.js

function handleKeyboard(event) {
  // Keine Shortcuts wenn Input-Feld fokussiert
  const activeTag = document.activeElement?.tagName
  if (['INPUT', 'SELECT', 'TEXTAREA'].includes(activeTag)) {
    return
  }

  switch (event.code) {
    case 'Space':
      event.preventDefault()
      if (store.isPlaying && !store.isPaused) {
        pauseAlarm()
      } else if (store.isPaused) {
        resumeAlarm()
      } else {
        startAlarm()
      }
      break

    case 'Escape':
      stopAlarm()
      break

    case 'KeyM':
      toggleMute()
      break

    case 'KeyL':
      toggleLoop()
      break
  }
}

// Event-Listener registrieren
onMounted(() => {
  window.addEventListener('keydown', handleKeyboard)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyboard)
})
```

### Verfügbare Shortcuts

| Taste | Aktion |
|-------|--------|
| `Leertaste` | Play/Pause |
| `Escape` | Stop |
| `M` | Mute/Unmute |
| `L` | Loop An/Aus |

---

## 13. Build-Konfiguration mit Vite

### vite.config.js

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],

  // Base-URL für Deployment auf Subpath
  base: '/alarmtool/',

  // Path-Aliase für saubere Imports
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },

  // Build-Optimierungen
  build: {
    outDir: 'dist',
    sourcemap: false,  // Keine Source Maps in Production

    // Chunk-Splitting für besseres Caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'pinia']  // Externe Libs separieren
        }
      }
    }
  },

  // Development Server
  server: {
    port: 5173,
    open: true  // Browser automatisch öffnen
  },

  // Preview Server (Production Build testen)
  preview: {
    port: 4173
  }
})
```

### NPM Scripts

```json
{
  "scripts": {
    "dev": "vite",              // Entwicklungsserver starten
    "build": "vite build",      // Production Build erstellen
    "preview": "vite preview"   // Production Build lokal testen
  }
}
```

### Warum Vite?

| Feature | Vite | Webpack |
|---------|------|---------|
| Dev-Server Start | < 1 Sekunde | 10-30 Sekunden |
| HMR (Hot Reload) | Instant | 1-3 Sekunden |
| Build-Zeit | Schnell (esbuild) | Langsamer |
| Konfiguration | Minimal | Komplex |
| ES Modules | Native | Gebundelt |

---

## 14. Best Practices und Patterns

### 1. Composables für wiederverwendbare Logik

```javascript
// ❌ Schlecht: Logik in Komponente
export default {
  data() {
    return { audioCtx: null }
  },
  methods: {
    initAudio() { /* ... */ }
  }
}

// ✅ Gut: Extrahiert in Composable
// useAudio.js
export function useAudio() {
  const audioCtx = ref(null)
  function initAudio() { /* ... */ }
  return { audioCtx, initAudio }
}
```

### 2. Separation of Concerns

```
Komponente       → UI-Darstellung, Template, Styles
Composable       → Geschäftslogik, API-Calls
Store            → Globaler State, der geteilt wird
Translations     → Texte, die übersetzt werden müssen
```

### 3. Reaktive Updates statt DOM-Manipulation

```javascript
// ❌ Schlecht: Direkte DOM-Manipulation
document.getElementById('status').textContent = 'Playing'

// ✅ Gut: Reaktive Datenbindung
const status = ref('Stopped')
status.value = 'Playing'  // Template aktualisiert sich automatisch
```

### 4. Cleanup bei Komponenten-Zerstörung

```javascript
// src/composables/usePlayer.js

onMounted(() => {
  window.addEventListener('keydown', handleKeyboard)
})

onUnmounted(() => {
  // Memory Leaks vermeiden!
  window.removeEventListener('keydown', handleKeyboard)

  // Audio-Ressourcen freigeben
  if (store.audioCtx) {
    store.audioCtx.close()
  }
})
```

### 5. Defensive Pattern-Validierung

```javascript
function parsePattern(patternStr) {
  // Leere Eingabe abfangen
  if (!patternStr || typeof patternStr !== 'string') {
    return [300, 200, 500, 100]  // Fallback
  }

  const steps = patternStr
    .split(',')
    .map(s => parseInt(s.trim(), 10))
    .filter(n => !isNaN(n) && n > 0)

  // Ungerade Anzahl = ungültig
  if (steps.length < 2 || steps.length % 2 !== 0) {
    return [300, 200, 500, 100]
  }

  return steps
}
```

### 6. User Preferences persistent speichern

```javascript
// Beim Laden
const savedLang = localStorage.getItem('alarmtool-lang') || 'de'

// Beim Ändern
function setLanguage(lang) {
  currentLang.value = lang
  localStorage.setItem('alarmtool-lang', lang)
}
```

---

## 15. Zusammenfassung

### Was wir gelernt haben

1. **Vue 3 Composition API**: Moderne, flexible Komponenten-Architektur
2. **Pinia State Management**: Zentralisierter, reaktiver Anwendungszustand
3. **Web Audio API**: Professionelle Audio-Synthese im Browser
4. **Composables**: Wiederverwendbare Logik-Module
5. **CSS Custom Properties**: Flexibles Theming-System
6. **Vite**: Blitzschnelles Build-Tool
7. **i18n**: Mehrsprachige Anwendungen

### Schlüsselerkenntnisse

| Aspekt | Lösung |
|--------|--------|
| Audio-Generierung | Web Audio API mit Oszillatoren + Effektkette |
| State Management | Pinia Store mit Composition API |
| Code-Organisation | Composables für Geschäftslogik |
| Rhythmus-Steuerung | setTimeout-basierte Pattern-Rekursion |
| Aufnahme | MediaRecorder API mit Format-Detection |
| Theming | CSS Custom Properties + data-Attribut |
| Mehrsprachigkeit | Translation-Objekt mit Sprachschlüssel |

### Weiterführende Ressourcen

- [Vue 3 Dokumentation](https://vuejs.org/guide/introduction.html)
- [Pinia Dokumentation](https://pinia.vuejs.org/)
- [Web Audio API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Vite Dokumentation](https://vitejs.dev/)

---

## Über dieses Projekt

Das **Alarmtool** ist ein Open-Source-Projekt, das als Lernressource für moderne Web-Entwicklung dient. Es demonstriert, wie man mit Vue 3, der Web Audio API und modernen Best Practices eine vollwertige Audio-Anwendung erstellen kann - komplett im Browser, ohne Backend.

**Lizenz**: MIT

---

*Dieser Blog-Post wurde als technische Dokumentation für Lernzwecke erstellt.*
