# ProgressBar

Der Aufnahme-Fortschritt: eine halbfette Timer-Zeile mit Spinner und Restzeit über einer Pill-Leiste in `ds-accent` auf `ds-border-strong`; dieselbe Leiste zeigt die MP3/WAV-Konvertierung.

**Aufbau (Quelle `base.css`, `RecorderControl.vue`):**
- `.timer` — 8 px Abstand oben, 14 px / 600 in `ds-text`; davor `fa-circle-notch fa-spin`, dahinter `<span>` mit `formatTime(remaining)` und „verbleibend".
- `.progress` — Spur `ds-border-strong`, `ds-radius-full`, 8 px hoch (die App setzt inline 14 bzw. 20 px), `overflow: hidden`.
- `.progress-bar` — `ds-accent`, volle Höhe, `ds-radius-full`, `width`-Transition `ds-duration-slow`; `role="progressbar"` mit `aria-valuenow/min/max`. Die Klassen `.progress-bar-striped.progress-bar-animated` der Konvertierung haben keine eigenen Regeln.
- Begleitende Texte: `.small-text.mt-3` als Hilfe, `.recording-success` mit `fa-check-circle` nach dem Ende (ohne eigene CSS-Regel; Vorschau färbt sie `ds-success`).

**Der Konsument liefert:** den Prozentwert (Aufnahme: verstrichene / gewählte Dauer; Konvertierung: Encoder-Fortschritt) und die Restzeit; sichtbar nur während `store.isRecording` bzw. `isConverting`.

**Dos/Don'ts:** Immer mit Zeit- oder Zustandstext — die Leiste allein erklärt nichts. Keine Prozentzahl in der Leiste. Nicht für den Player-Fortschritt (der hat die 4-px-`.player-progress-track`).

Statische Vorschau (hand-written from `src/styles/base.css`, `src/components/RecorderControl.vue`).
