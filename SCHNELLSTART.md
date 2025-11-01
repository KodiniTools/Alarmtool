# 🚀 Schnellstart - Alarm Tool Vue

## Installation & Start in 3 Schritten

### 1. In das Projektverzeichnis wechseln
```bash
cd alarm-tool-vue
```

### 2. Dependencies installieren
```bash
npm install
```

### 3. Development Server starten
```bash
npm run dev
```

Die Anwendung ist dann verfügbar unter: **http://localhost:5173**

---

## Alternative: Sofort-Start ohne Installation

Falls Sie Node.js noch nicht installiert haben:

1. **Node.js installieren** von https://nodejs.org (LTS Version empfohlen)
2. Dann die obigen Schritte befolgen

---

## Production Build

Für einen optimierten Production Build:

```bash
npm run build
```

Die Build-Dateien befinden sich dann im `dist/` Ordner.

Preview des Production Builds:
```bash
npm run preview
```

---

## 📋 Wichtige Hinweise

### Browser-Anforderungen
- Moderne Browser mit Web Audio API Support
- Chrome, Firefox, Safari, Edge (aktuelle Versionen)

### Audio-Aufnahme
- Beim ersten Start fragt der Browser nach Mikrofon-Berechtigung
- Dies ist normal - die App nutzt nur die interne Audio-Engine

---

## 🎯 Erste Schritte nach dem Start

1. **Oszillatoren konfigurieren** (Tab "Oszillatoren")
   - Wähle Wellenformen
   - Stelle Frequenzen ein
   - Passe Lautstärke und Pan an

2. **Alarm starten** (Media Player Steuerung)
   - Klicke auf Play (▶️)
   - Die Töne werden sofort abgespielt

3. **Aufnahme erstellen** (Tab "Aufnahme")
   - Wähle eine Dauer
   - Klicke "Aufnahme starten"
   - Download-Link erscheint automatisch

4. **Einstellungen speichern** (Einstellungen verwalten)
   - Klicke "Speichern" für Browser-Speicher
   - Oder "Exportieren" für JSON-Datei

---

## 🎹 Keyboard Shortcuts

- **Leertaste**: Play/Pause
- **Esc**: Stop
- **M**: Mute/Unmute
- **L**: Loop aktivieren/deaktivieren

---

## 🆘 Probleme?

### Port bereits belegt
Wenn Port 5173 bereits verwendet wird:
```bash
npm run dev -- --port 3000
```

### Dependencies-Fehler
Cache leeren und neu installieren:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Audio funktioniert nicht
- Überprüfe Browser-Berechtigungen
- Stelle sicher, dass keine Browser-Extensions Audio blockieren
- Teste in einem Incognito/Private Window

---

## 📚 Weitere Informationen

Siehe **README.md** für:
- Detaillierte Projektstruktur
- Architektur-Übersicht
- Entwickler-Dokumentation
- API-Referenz

---

## ✨ Features

✅ 12 individuell konfigurierbare Oszillatoren
✅ Globale Filtersteuerung (Tiefpass, Hochpass, etc.)
✅ Live-Recording mit hochwertigen Audio-Codecs
✅ Vollständige Media Player Steuerung
✅ Deutsch/Englisch Unterstützung
✅ Dark/Light Theme
✅ Einstellungen speichern/laden/exportieren

---

Viel Spaß mit dem Alarm Tool! 🎵
