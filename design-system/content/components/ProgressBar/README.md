# ProgressBar

Der Aufnahme-Fortschritt: eine fette Timer-Zeile mit Spinner und Restzeit über einer 20-px-Goldleiste, die sich über die Aufnahmedauer füllt; dieselbe Leiste zeigt mit 14 px die MP3/WAV-Konvertierung.

**Aufbau (Quelle `base.css`, `RecorderControl.vue`):**
- `.timer` — 10 px Abstand oben, `font-weight: bold`, `at-text`; davor `fa-circle-notch fa-spin`, dahinter `<span>` mit `formatTime(remaining)` und „verbleibend".
- `.progress` — Spur `rgba(14,28,50,.5)` (`at-surface` 50 %), `radius-card`, 20 px hoch (14 px bei Konvertierung, inline gesetzt), `overflow: hidden`.
- `.progress-bar` — `at-primary`, volle Höhe, `width`-Transition 0.3 s; `role="progressbar"` mit `aria-valuenow/min/max`. Die Konvertierung ergänzt `.progress-bar-striped.progress-bar-animated` (Klassen aus der Bootstrap-Herkunft, ohne eigene Regeln im Repo).
- Begleitende Texte: `.small-text.mt-3` als Hilfe, `.recording-success` mit `fa-check-circle` nach dem Ende (ohne eigene CSS-Regel; Vorschau färbt sie `at-success`).

**Der Konsument liefert:** den Prozentwert (Aufnahme: verstrichene / gewählte Dauer; Konvertierung: Encoder-Fortschritt) und die Restzeit; sichtbar nur während `store.isRecording` bzw. `isConverting`.

**Dos/Don'ts:** Immer mit Zeit- oder Zustandstext — die Leiste allein erklärt nichts. Keine Prozentzahl in der Leiste. Nicht für den Player-Fortschritt verwenden (der hat die 3-px-`.player-progress-track`).

Statische Vorschau (hand-written from `src/styles/base.css`, `src/components/RecorderControl.vue`).
