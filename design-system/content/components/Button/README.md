# Button

Die Schaltfläche der App: `.btn` plus eine Farbvariante, 6-px-Radius, Icon links mit 0.4 rem Abstand, Lift um 1 px auf Hover.

**Wann:** jede Aktion mit Text — Aufnahme starten, Speichern, Download, Verwerfen, Kopieren/Einfügen. Nicht für Transport (Play/Pause/Stop), Tabs oder Listenauswahl; die haben eigene Komponenten.

**Varianten (Quelle `button.css`):**
- `.btn-primary` — Gold `at-primary` auf `at-primary-fg`; die eine Hauptaktion pro Ansicht. Hover hellt zu `at-primary-hover`.
- `.btn-success` — `at-success` mit `at-on-success`; Aufnahme starten.
- `.btn-danger` — `at-danger` mit `at-on-danger` (Weiß, 3.1:1 — Quellwert); Verwerfen, Aufnahme löschen.
- `.btn-secondary` — `at-info`-Füllung mit `at-on-info`; Zurücksetzen, Preset-Reset. Hover wechselt zu Gold.
- `.btn-outline-secondary` — transparent, 1 px `at-muted`-Rahmen, Text `at-text-dim`; Download, Konvertieren, Editor-Aktionen. Als `<a download>` mit `.download-ready` auch für Links.
- `.btn-sm` — 0.35 rem 0.7 rem, `button-sm`; für Aktionen in Kopfzeilen (Kopieren/Einfügen).

**Der Konsument liefert:** `<button>` oder `<a>`, Label-Text in Satzschreibung, optional ein Icon-Element vor dem Text (`<i class="fas fa-…">` in der App). `disabled` setzt nur Opazität 0.45 und `cursor: not-allowed`.

**Dos/Don'ts:** Nur ein `.btn-primary` pro Sektion. Keine Icon-only-Buttons mit `.btn` — dafür Transport-/Aux-Buttons. Kein zusätzlicher Rahmen oder Schatten auf Varianten. Tastaturfokus kommt vom Browser-Outline; `.tab-btn--link` zeigt, wie ein 2-px-Gold-Outline aussieht.

Statische Vorschau (hand-written from `src/styles/components/button.css` und `RecorderControl.vue`); Font-Awesome-Icons durch Inline-SVG-Platzhalter ersetzt.
