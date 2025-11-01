# Migration: Vanilla JS → Vue 3

## 🔄 Was wurde geändert?

Diese Dokumentation erklärt die wichtigsten Unterschiede zwischen der Original-Anwendung und der Vue 3 Version.

---

## Architektur-Vergleich

### Original (Vanilla JS)
```
index.html (Monolithisch)
├── Inline Translations
├── Inline Theme Logic
├── main.js (Global State)
├── oszillatoren.js (DOM Manipulation)
├── recorder.js (Global Functions)
├── player-v2.js (Event Listeners)
└── alarmtool_styles.css
```

### Vue 3 (Modern)
```
src/
├── components/ (Wiederverwendbare UI-Komponenten)
├── composables/ (Wiederverwendbare Logik)
├── stores/ (Zentraler State mit Pinia)
├── i18n/ (Strukturierte Übersetzungen)
├── App.vue (Haupt-Komponente)
├── main.js (Entry Point)
└── style.css (Globale Styles)
```

---

## ✨ Verbesserungen

### 1. **Reaktivität**
**Vorher**: Manuelles DOM-Update mit `getElementById` und `addEventListener`
```javascript
document.getElementById('filterFrequency').addEventListener('input', (e) => {
  // Manuelles Update
})
```

**Jetzt**: Vue's reaktives System
```vue
<input v-model.number="filterFrequency" @input="updateFilter" />
```

### 2. **State Management**
**Vorher**: Globale Variablen, verstreut über mehrere Dateien
```javascript
let audioCtx = null;
let isAlarmRunning = false;
// In verschiedenen Dateien...
```

**Jetzt**: Zentraler Store mit Pinia
```javascript
export const useAlarmStore = defineStore('alarm', () => {
  const audioCtx = ref(null)
  const isAlarmRunning = ref(false)
  // Alles an einem Ort
})
```

### 3. **Wiederverwendbarkeit**
**Vorher**: Funktionen in separaten JS-Dateien
```javascript
// main.js
function initAudioContext() { /*...*/ }

// player.js
function startAlarm() { /*...*/ }
```

**Jetzt**: Composables mit klarer Schnittstelle
```javascript
// useAudioContext.js
export function useAudioContext() {
  return { initAudioContext, closeAudioContext }
}

// usePlayer.js
export function usePlayer() {
  return { startAlarm, stopAlarm, pauseAlarm }
}
```

### 4. **Komponenten-Struktur**
**Vorher**: Alle UI-Logik in einer Datei
```javascript
// 12 Oszillatoren in einer Schleife erstellt
for (let i = 0; i < 12; i++) {
  const html = `<div>...</div>`;
  container.innerHTML += html;
}
```

**Jetzt**: Komponentenbasiert
```vue
<OscillatorGrid>
  <OscillatorItem v-for="osc in oscillators" :key="osc.id" />
</OscillatorGrid>
```

### 5. **Internationalisierung**
**Vorher**: Inline Übersetzungen mit manuellem DOM-Update
```javascript
document.querySelectorAll('[data-i18n]').forEach(el => {
  el.textContent = translations[lang][key];
})
```

**Jetzt**: Strukturierte i18n mit automatischem Update
```vue
<h2>{{ t('filter_title') }}</h2>
```

---

## 🎯 Funktions-Mapping

### Audio Context
| Original | Vue 3 |
|----------|-------|
| `initAudioContext()` in main.js | `useAudioContext().initAudioContext()` |
| `setupGlobalFilter()` in main.js | `useAudioContext().setupGlobalFilter()` |
| Globale Variablen | Pinia Store |

### Oszillatoren
| Original | Vue 3 |
|----------|-------|
| `createOscillators()` in oszillatoren.js | `useOscillators().createOscillators()` |
| `runOscPattern()` in oszillatoren.js | `useOscillators().runOscPattern()` |
| Array `oscillatorData` | Store `oscillators` |

### Player
| Original | Vue 3 |
|----------|-------|
| `startAlarm()` in player-v2.js | `usePlayer().startAlarm()` |
| `pauseAlarm()` in player-v2.js | `usePlayer().pauseAlarm()` |
| `stopAlarm()` in player-v2.js | `usePlayer().stopAlarm()` |
| Globaler Player State | Store Properties |

### Recorder
| Original | Vue 3 |
|----------|-------|
| `startRecording()` in recorder.js | `useRecorder().startRecording()` |
| `stopRecording()` in recorder.js | `useRecorder().stopRecording()` |
| Globale Recording-Variablen | Composable State |

---

## 📦 Abhängigkeiten

### Original
- Keine Build-Dependencies
- Bootstrap CSS (CDN)
- FontAwesome (CDN)

### Vue 3
- **Vue 3**: Framework
- **Pinia**: State Management
- **Vite**: Build Tool & Dev Server
- FontAwesome (CDN - beibehalten)

---

## 🔧 Konfiguration

### Original
Keine Konfiguration nötig - direktes Öffnen im Browser

### Vue 3
- `vite.config.js`: Build-Konfiguration
- `package.json`: Dependencies & Scripts
- Dev Server auf Port 5173 (konfigurierbar)

---

## 💡 Best Practices implementiert

1. **Single Responsibility**: Jede Komponente/Composable hat eine klare Aufgabe
2. **Composition API**: Moderne Vue 3 Syntax
3. **TypeScript-ready**: Struktur ist TypeScript-kompatibel
4. **Performance**: Reaktivität nur wo nötig
5. **Wartbarkeit**: Klare Ordnerstruktur und Naming
6. **Testbarkeit**: Composables sind leicht zu testen

---

## 🚀 Migration-Checklist

Folgende Features wurden 1:1 übernommen:
- ✅ 12 Oszillatoren mit allen Parametern
- ✅ Globaler Filter (Tiefpass, Hochpass, etc.)
- ✅ Audio Effects (Reverb, Delay)
- ✅ Live Recording mit MediaRecorder
- ✅ Player Controls (Play/Pause/Stop)
- ✅ Keyboard Shortcuts
- ✅ Settings Management (Save/Load/Export/Import)
- ✅ Deutsch/Englisch
- ✅ Dark/Light Theme
- ✅ FAQ Section
- ✅ Responsive Design

Zusätzliche Verbesserungen:
- ✅ Bessere Code-Organisation
- ✅ Einfachere Wartung
- ✅ Bessere Performance durch Vue's Reaktivität
- ✅ Hot Module Replacement (HMR) im Dev-Modus
- ✅ Production-ready Build-System

---

## 📝 Weiterentwicklung

Die neue Struktur ermöglicht einfach:

### Neue Features hinzufügen
```javascript
// 1. Erstelle neue Komponente
src/components/NewFeature.vue

// 2. Erstelle Composable (optional)
src/composables/useNewFeature.js

// 3. Erweitere Store (optional)
src/stores/alarmStore.js

// 4. Importiere in App.vue
```

### Neue Sprache hinzufügen
```javascript
// src/i18n/translations.js
export const translations = {
  de: { /*...*/ },
  en: { /*...*/ },
  fr: { /* Neue Sprache */ }
}
```

### Testing hinzufügen
```bash
# Vitest installieren
npm install -D vitest @vue/test-utils

# Tests schreiben
src/components/__tests__/
```

---

## 🎓 Lernen

Diese Migration zeigt:
- **Vue 3 Composition API** in der Praxis
- **Pinia** State Management
- **Vite** Build Tool
- **Composables** Pattern
- **Component-driven** Development

Perfekt als Lern-Projekt für moderne Vue 3 Entwicklung!

---

## 🤝 Unterstützung

Bei Fragen zur Migration oder Vue 3 Architektur:
1. Siehe offizielle Vue 3 Docs: https://vuejs.org
2. Pinia Docs: https://pinia.vuejs.org
3. Vite Docs: https://vitejs.dev

---

Viel Erfolg mit der modernen Vue 3 Version! 🎉
