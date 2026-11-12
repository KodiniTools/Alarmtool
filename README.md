# Alarm Tool - Vue Edition

Eine moderne Vue 3 Anwendung zur Erzeugung komplexer Audiosignale mit 12 individuell konfigurierbaren Oszillatoren.

## Features

- 🎵 **12 Oszillatoren** mit individuellen Einstellungen
  - Verschiedene Wellenformen (Sinus, Rechteck, Sägezahn, Dreieck, Puls, Orgel)
  - Frequenz, Lautstärke, Pan-Steuerung
  - Attack/Release-Hüllkurven
  - Pattern-basierte Rhythmen

- 🎛️ **Globaler Filter**
  - Tiefpass, Hochpass, Bandpass, Notch
  - Einstellbare Frequenz und Q-Faktor

- 🎤 **Live Recording**
  - MediaRecorder API
  - Hochwertige Audio-Codecs (WAV, Opus, WebM)
  - Verschiedene Aufnahmedauern (1-5 Minuten)

- 🎮 **Media Player**
  - Play/Pause/Stop
  - Lautstärke-Kontrolle
  - Mute-Funktion
  - Loop-Modus
  - Keyboard Shortcuts (Leertaste, Esc, M, L)

- 🌐 **Internationalisierung**
  - Deutsch und Englisch
  - Einfach erweiterbar

- 🌓 **Theme Support**
  - Dark Mode (Standard)
  - Light Mode

- 💾 **Einstellungsverwaltung**
  - Speichern/Laden (LocalStorage)
  - Export/Import als JSON

## Installation

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Production Build
npm run build

# Preview Production Build
npm run preview
```

## Projektstruktur

```
alarm-tool-vue/
├── src/
│   ├── components/          # Vue Komponenten
│   │   ├── TopToolbar.vue   # Sprach- und Theme-Switcher
│   │   ├── FilterControl.vue
│   │   ├── OscillatorGrid.vue
│   │   ├── OscillatorItem.vue
│   │   ├── RecorderControl.vue
│   │   ├── PlayerControl.vue
│   │   ├── FAQSection.vue
│   │   └── SettingsPanel.vue
│   ├── composables/         # Wiederverwendbare Logik
│   │   ├── useAudioContext.ts
│   │   ├── useOscillators.ts
│   │   ├── usePlayer.ts
│   │   └── useRecorder.ts
│   ├── stores/              # Pinia State Management
│   │   └── alarmStore.ts
│   ├── i18n/                # Internationalisierung
│   │   ├── de.ts
│   │   ├── en.ts
│   │   └── translations.ts
│   ├── App.vue              # Haupt-Komponente
│   ├── main.ts              # Entry Point
│   └── style.css            # Globale Styles
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## Verwendung

### Alarm starten

1. Konfiguriere die Oszillatoren nach deinen Wünschen
2. Optional: Passe den globalen Filter an
3. Klicke auf den Play-Button (▶️) im Player
4. Die Töne werden sofort abgespielt

### Aufnahme erstellen

1. Starte zuerst den Alarm
2. Wähle eine Aufnahmedauer (1-5 Minuten)
3. Klicke auf "Aufnahme starten"
4. Nach Ablauf der Zeit erscheint automatisch ein Download-Link

### Einstellungen speichern

1. Konfiguriere alle gewünschten Parameter
2. Klicke auf "Speichern" um im Browser zu speichern
3. Oder "Exportieren" um eine JSON-Datei herunterzuladen
4. Mit "Importieren" kannst du gespeicherte JSON-Dateien laden

### Keyboard Shortcuts

- **Leertaste**: Play/Pause
- **Esc**: Stop
- **M**: Mute/Unmute
- **L**: Loop aktivieren/deaktivieren

## Technologie-Stack

- **Vue 3** - Progressive JavaScript Framework
- **Pinia** - State Management
- **Vite** - Build Tool & Dev Server
- **Web Audio API** - Audio-Verarbeitung
- **MediaRecorder API** - Audio-Aufnahme
- **FontAwesome** - Icons

## Browser-Unterstützung

- Chrome/Edge (aktuell)
- Firefox (aktuell)
- Safari (aktuell)

Alle Browser müssen die Web Audio API und MediaRecorder API unterstützen.

## Entwicklung

### Neue Übersetzung hinzufügen

Lege eine Datei je Sprache an (z. B. `src/i18n/fr.ts` mit denselben Schlüsseln wie `de.ts`),
und trage sie in `src/i18n/translations.ts` ein (`SUPPORTED_LANGS` in `locale.ts` liest die Sprachen daraus):

```javascript
import de from './de'
import en from './en'
import fr from './fr'

export const translations = { de, en, fr }
```

### Neuen Oszillator-Parameter hinzufügen

1. Erweitere den passenden Domain-Store in `src/stores/` (z. B. `oscillatorStore.ts`)
2. Füge UI-Element in `src/components/OscillatorItem.vue` hinzu
3. Implementiere Logik in `src/composables/useOscillators.ts`

## Lizenz
MIT Lizenz

Open Source - frei verwendbar und anpassbar

## Autor
Dinko Ramić Kodini Tools kodinitools.com



