# 🐛 Bugfix: Recording Timer Issue

## Problem

Die Aufnahme wurde nicht automatisch nach Ablauf der gewählten Zeit beendet und der Download-Link wurde nicht angezeigt.

## Ursache

**Race Condition im Timer-Code:**

Das Recording-Interval prüfte alle 100ms die verbleibende Zeit. Wenn die Zeit abgelaufen war (`remainingMs <= 0`), rief es `clearRecordingTimers()` auf, was ALLE Timer (inklusive des Timeouts) löschte.

```javascript
// VORHER (FEHLERHAFT):
if (remainingMs <= 0) {
  store.remainingTime = 0
  clearRecordingTimers()  // ❌ Löscht auch den Timeout!
  return
}
```

**Folge:**
- Der Timeout, der den MediaRecorder stoppen sollte, wurde gecancelt
- Der MediaRecorder lief weiter
- `onstop` Event wurde nie gefeuert
- Download-Link wurde nie erstellt

## Lösung

1. **Interval stoppt nur sich selbst:**
   ```javascript
   if (remainingMs <= 0) {
     store.remainingTime = 0
     // Nur das Interval stoppen
     if (recordingTimerInterval.value) {
       clearInterval(recordingTimerInterval.value)
       recordingTimerInterval.value = null
     }
     return
   }
   ```

2. **Timeout übernimmt das Stoppen:**
   ```javascript
   recordingTimeout.value = setTimeout(() => {
     console.log('Recording timeout reached - stopping recording')
     
     // MediaRecorder stoppen
     if (mediaRecorder.value && mediaRecorder.value.state === 'recording') {
       mediaRecorder.value.stop()  // Triggert onstop Event
     }
     
     // Alle Timer clearen
     clearRecordingTimers()
     
     // State aktualisieren
     store.isRecording = false
     store.remainingTime = 0
   }, durationMs)
   ```

3. **Zusätzliches Logging:**
   - Console Logs für Debugging
   - Tracking von Data Chunks
   - Bestätigung des onstop Events

## Geänderte Datei

- `src/composables/useRecorder.js`
  - `startRecordingTimer()` Funktion repariert
  - Mehr Console Logging hinzugefügt
  - `createDownloadURL()` mit Debug-Logging

## Test

Nach dem Fix:
1. ✅ Timer läuft korrekt herunter
2. ✅ Aufnahme stoppt automatisch nach gewählter Zeit
3. ✅ Progress Bar verschwindet
4. ✅ Download-Link erscheint
5. ✅ Audio-Datei kann heruntergeladen werden

## Verifikation

Öffne die Browser Console (F12) während der Aufnahme:

```
Expected output:
Data chunk received: XXX bytes
Data chunk received: XXX bytes
...
Recording timeout reached - stopping recording
MediaRecorder stopped
MediaRecorder onstop event fired
Recorded chunks: XX
createDownloadURL called
Blob created: XXXXX bytes, type: audio/...
✅ Recording created: alarm_recording_..., Size: X.X MB
showDownload set to: true
```

## Status

🟢 **BEHOBEN** - Recording funktioniert jetzt korrekt!

---

**Datum:** 17. Oktober 2025  
**Datei:** useRecorder.js  
**Typ:** Bugfix (Race Condition)
