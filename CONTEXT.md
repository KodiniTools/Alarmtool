# CONTEXT.md - Alarmtool

Diese Datei dokumentiert den technischen Kontext des Alarmtool-Projekts.

---

## Tech-Stack

### Frontend Framework
| Technologie | Version | Beschreibung |
|-------------|---------|--------------|
| **Vue 3** | ^3.4.0 | Progressive JavaScript Framework |
| **Pinia** | ^2.1.7 | State Management (Vuex-Nachfolger) |
| **Vite** | ^5.0.0 | Build Tool & Dev Server |
| **JavaScript** | ES6+ | Programmiersprache (Migration nach TypeScript vorbereitet) |
| **TypeScript** | ~5.9 | `tsconfig.json` (strict, `allowJs`), Prüfung mit `vue-tsc`; `src/lib`, `src/composables`, `src/stores`, `src/i18n`, `src/utils` und `main.ts` sind TypeScript (in `src/lib` außer `waveforms.js`, das `design-system/build.mjs` direkt in Node lädt, und der Fremdbibliothek `lamejs.js`) |

### Browser APIs
| API | Verwendung |
|-----|------------|
| **Web Audio API** | Erzeugung und Verarbeitung von Audio-Signalen |
| **MediaRecorder API** | Aufnahme von Audio-Streams |
| **LocalStorage API** | Speicherung von Benutzereinstellungen |

### Zusätzliche Libraries
| Library | Version | Verwendung |
|---------|---------|------------|
| **FontAwesome** | 6.4.0 | Icon-Bibliothek |
| **Google Analytics** | GTM | Analytics-Tracking |

### Hinweis
Dies ist eine **reine Frontend-Anwendung (SPA)** ohne Backend oder Datenbank. Alle Daten werden client-seitig im Browser verarbeitet und gespeichert.

---

## Ordnerstruktur

```
/Alarmtool/
├── .git/                          # Git Repository
├── .gitignore                     # Git Ignore Rules
├── LICENSE                        # MIT Lizenz
├── README.md                      # Hauptdokumentation
├── MIGRATION.md                   # Migrations-Guide (Vanilla JS → Vue 3)
├── BUGFIX_Recording.md            # Bug-Fix Dokumentation
├── SCHNELLSTART.md                # Schnellstart-Anleitung (Deutsch)
├── PROJEKTSTRUKTUR.txt            # Projektstruktur-Übersicht
├── CONTEXT.md                     # Diese Datei
├── index.html                     # HTML Entry Point
├── package.json                   # npm Dependencies & Scripts
├── package-lock.json              # Locked Dependencies
├── vite.config.js                 # Vite Konfiguration
│
└── src/                           # Quellcode
    ├── main.ts                    # Vue App Entry Point
    ├── App.vue                    # Root Component
    ├── style.css                  # Globale CSS Styles
    │
    ├── components/                # Vue Komponenten
    │   ├── TopToolbar.vue         # Sprach- & Theme-Switcher
    │   ├── FilterControl.vue      # Globale Audio-Filter UI
    │   ├── OscillatorGrid.vue     # Grid-Container für Oszillatoren
    │   ├── OscillatorItem.vue     # Einzelne Oszillator-Steuerung
    │   ├── PlayerControl.vue      # Play/Pause/Stop Controls
    │   ├── RecorderControl.vue    # Audio-Aufnahme UI
    │   ├── SettingsPanel.vue      # Settings Save/Load/Export/Import
    │   ├── FAQSection.vue         # FAQ Dokumentation
    │   ├── CookieBanner.vue       # Cookie Consent Banner
    │   └── AppFooter.vue          # Footer mit Links
    │
    ├── composables/               # Wiederverwendbare Logik (Composition API)
    │   ├── useAudioContext.ts     # Audio Context & Effekte
    │   ├── useOscillators.ts      # Oszillator-Erstellung & Pattern
    │   ├── usePlayer.ts           # Play/Pause/Stop/Mute Logik
    │   └── useRecorder.ts         # Aufnahme & Download
    │
    ├── stores/                    # Pinia State Management
    │   └── alarmStore.ts          # Fassade über die Domain-Stores (TypeScript)
    │
    ├── lib/                       # Reine Logik ohne Vue, TypeScript (u. a. filterConfig.ts, recordingFormats.ts)
    │
    └── i18n/                      # Internationalisierung
        ├── de.ts / en.ts          # Texte je Sprache (gleiche Schlüssel, Test tests/i18n.spec.js)
        └── translations.ts        # fasst de und en zusammen (Typ Lang)
```

---

## Datenbankschema / State Management

Da diese Anwendung **keine Datenbank** verwendet, wird hier die State-Management-Struktur dokumentiert, die im Pinia Store (`src/stores/alarmStore.ts`, Fassade über `oscillatorStore`, `playerStore`, `recorderStore`, `settingsStore` und `audioNodes`) definiert ist.

### Audio Context & Nodes

| Property | Typ | Beschreibung |
|----------|-----|--------------|
| `audioCtx` | AudioContext | Web Audio API Context |
| `masterGainNode` | GainNode | Master-Lautstärkeregler |
| `filterNode` | BiquadFilterNode | Globaler Audio-Filter |
| `delayNode` | DelayNode | Delay-Effekt |
| `convolverNode` | ConvolverNode | Reverb (Convolver) |
| `reverbGain` | GainNode | Reverb-Lautstärke |
| `effectsOut` | GainNode | Effects Chain Output |

### Player State

| Property | Typ | Default | Beschreibung |
|----------|-----|---------|--------------|
| `isPlaying` | Boolean | `false` | Wiedergabe aktiv |
| `isPaused` | Boolean | `false` | Wiedergabe pausiert |
| `currentTime` | Number | `0` | Aktuelle Wiedergabezeit (ms) |
| `volume` | Number | `0.5` | Lautstärke (0-1) |
| `isMuted` | Boolean | `false` | Stummgeschaltet |
| `isLooping` | Boolean | `false` | Loop aktiviert |

### Recording State

| Property | Typ | Default | Beschreibung |
|----------|-----|---------|--------------|
| `isRecording` | Boolean | `false` | Aufnahme aktiv |
| `recordingDuration` | Number | `0` | Aufnahmedauer (ms) |
| `remainingTime` | Number | `0` | Verbleibende Zeit (ms) |

### Settings

| Property | Typ | Default | Beschreibung |
|----------|-----|---------|--------------|
| `currentLang` | String | `'de'` | Sprache (`'de'` oder `'en'`) |
| `currentTheme` | String | `'dark'` | Theme (`'dark'` oder `'light'`) |
| `filterSettings` | Object | siehe unten | Filter-Einstellungen |

#### Filter Settings

```javascript
filterSettings: {
  type: 'none',      // 'none' | 'lowpass' | 'highpass' | 'bandpass' | 'notch'
  frequency: 1000,   // Frequenz in Hz
  Q: 1               // Quality Factor
}
```

### Oscillators Array

Das System unterstützt **12 unabhängige Oszillatoren**. Jeder Oszillator hat folgende Struktur:

| Property | Typ | Default | Beschreibung |
|----------|-----|---------|--------------|
| `id` | Number | `0-11` | Eindeutige ID |
| `enabled` | Boolean | `false` | Oszillator aktiviert |
| `oscillator` | OscillatorNode | `null` | Web Audio Oszillator |
| `gainNode` | GainNode | `null` | Gain Control Node |
| `panNode` | StereoPannerNode | `null` | Stereo Pan Node |
| `patternTimeoutId` | Number | `null` | Timeout ID für Pattern |
| `patternSteps` | Array | `[]` | Pattern-Schritte in ms |
| `patternIndex` | Number | `0` | Aktueller Pattern-Schritt |
| `toneIsOn` | Boolean | `false` | Ton aktiv |
| `waveType` | String | `'sine'` | Wellenform |
| `frequency` | Number | `440` | Frequenz in Hz |
| `volume` | Number | `0.5` | Lautstärke (0-1) |
| `pan` | Number | `0` | Stereo-Pan (-1 bis 1) |
| `attack` | Number | `10` | Attack-Zeit in ms |
| `release` | Number | `10` | Release-Zeit in ms |
| `pattern` | String | `''` | Pattern-String z.B. `"300,200,500,100"` |

#### Unterstützte Wellenformen

- `'sine'` - Sinuswelle
- `'square'` - Rechteckwelle
- `'sawtooth'` - Sägezahnwelle
- `'triangle'` - Dreieckwelle

### LocalStorage Keys

| Key | Typ | Beschreibung |
|-----|-----|--------------|
| `alarmToolLang` | String | Gespeicherte Sprachpräferenz |
| `alarmToolTheme` | String | Gespeicherte Theme-Präferenz |

---

## Build & Deployment

### Scripts

```bash
npm run dev      # Startet Entwicklungsserver (Port 5173)
npm run build    # Erstellt Production Build in /dist
npm run preview  # Vorschau des Production Builds
npm test         # Vitest (Unit- und Komponententests in tests/)
npm run lint     # ESLint (JS, TS und .vue mit <script setup> oder lang="ts")
npm run format:check  # Prettier
npm run type-check    # vue-tsc (TypeScript)
npm run design-system:check  # Design-System-Export prüfen
```

### CI

`.github/workflows/ci.yml` führt bei jedem Pull Request und Push auf `main`
Lint, Prettier, Typprüfung, Tests, Design-System-Check und Build aus.

### Konfiguration (vite.config.js)

- **Base Path:** `/alarmtool/` (für Subpath-Deployment)
- **Output:** `/dist` Verzeichnis
- **Code Splitting:** Vue und Vendor-Libraries werden separiert
- **Source Maps:** Deaktiviert in Production

---

## Architektur-Übersicht

```
┌─────────────────────────────────────────────────────────────┐
│                        App.vue                               │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐   │
│  │ TopToolbar  │  │ PlayerControl│  │ RecorderControl   │   │
│  └─────────────┘  └──────────────┘  └───────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    OscillatorGrid                       ││
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       ││
│  │  │OscillatorItem│ │OscillatorItem│ │OscillatorItem│ ... ││
│  │  └─────────────┘ └─────────────┘ └─────────────┘       ││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐   │
│  │FilterControl│  │SettingsPanel │  │   FAQSection      │   │
│  └─────────────┘  └──────────────┘  └───────────────────┘   │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐   │
│  │CookieBanner │  │              │  │    AppFooter      │   │
│  └─────────────┘  └──────────────┘  └───────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Pinia Store                             │
│                    (alarmStore.ts)                           │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌───────────┐ │
│  │ Audio Nodes│ │Player State│ │ Oscillators│ │ Settings  │ │
│  └────────────┘ └────────────┘ └────────────┘ └───────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Composables                             │
│  ┌────────────────┐  ┌────────────────┐                     │
│  │useAudioContext │  │ useOscillators │                     │
│  └────────────────┘  └────────────────┘                     │
│  ┌────────────────┐  ┌────────────────┐                     │
│  │   usePlayer    │  │  useRecorder   │                     │
│  └────────────────┘  └────────────────┘                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Web Audio API                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │Oscillator│──│  Gain    │──│  Filter  │──│Destination│    │
│  │   Node   │  │  Node    │  │  Node    │  │  (Output) │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Ui-Komponenten (`src/components/ui`)

Wiederverwendbare Bausteine nach dem Muster von Playlist-Generator und Equalizer-19,
exportiert über `src/components/ui/index.js`:

- `UiButton`: Textbutton (`variant` primary/secondary/danger, `size` md/sm, `href` + `download` für Links)
- `UiIconButton`: Button nur mit Icon, `label` wird `aria-label` und `title`
- `UiSwitch`: Ein/Aus-Schalter (`role="switch"`, `label` als zugänglicher Name)
- `SliderField`: Slider plus Zahlfeld mit Label und Hilfetext (Oszillator- und Filterparameter)
- `CollapsibleSection`: auf- und zuklappbarer Abschnitt der Sidebar

Teilkomponenten der Aufnahme liegen in `src/components/recorder/`
(`RecordingConvert` für MP3/WAV-Umwandlung, `RecordingProgress` für Restzeit und Balken).
Ihre Stile stehen wie alle Komponenten-Stile global in `src/styles/components/recorder.css`.
`tests/designTokens.spec.js` prüft CSS-Dateien und `<style>`-Blöcke der `.vue`-Dateien auf
feste Farben, Gradients, Lifts und fremde Radien.

Buttons werden nur über diese Komponenten gebaut (Test `tests/UiButton.spec.js`).
Die Stile bleiben global in `src/styles/components/button.css`, weil der
Design-System-Export (`npm run design-system`) daraus `bundle.css` erzeugt.

---

## Weitere Dokumentation

- **README.md** - Vollständige Feature-Übersicht und Nutzungsanleitung
- **MIGRATION.md** - Erläuterung der Migration von Vanilla JS zu Vue 3
- **SCHNELLSTART.md** - Deutsche Schnellstart-Anleitung
- **BUGFIX_Recording.md** - Dokumentation der Recording-Bugfixes
