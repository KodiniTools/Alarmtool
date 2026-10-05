# OscillatorEditor

Das Detail-Panel rechts neben der Liste: eine `ds-surface-1`-Fläche mit 16-px-Radius und Kopfzeile (Toggle-Schalter, Titel, Wellenform-Badge, Kopieren/Einfügen), darunter Sektionen für Wellenform, Grundparameter sowie aufklappbare Hüllkurve und Rhythmus.

**Aufbau (Quelle `OscillatorItem.vue`, `oscillator.css`, `form.css`):**
- `.osc-editor` — `ds-surface-1`, `ds-border`, `ds-radius-lg`, `overflow: hidden`; kein Verlauf, kein Schatten. `--disabled` dimmt alles auf 0.65.
- `.osc-editor-header` — Flex space-between, Padding 12 / 20 px, Trennlinie `ds-border` unten. Titel `panel-title` 16 px / 600 plus `.osc-editor-wave-badge` (wie der Chip der Liste). Links der `.toggle-switch` (36×20, `ds-accent` wenn an). Aktionen sind `.btn-outline-secondary.btn-sm`; ≤ 900 px nur Icons.
- `.osc-editor-section` — Padding 16 / 20 px, Trennlinie `ds-border` unten, die letzte ohne. Jede beginnt mit `.osc-section-label` (Eyebrow).
- `.osc-params-grid` — zwei Spalten, Gap 8 × 24 px, ≤ 640 px eine Spalte; Zellen sind `FormControls`-Paare.
- `.osc-adsr-toggle` — Eyebrow als `<button>` mit Chevron (rechts = zu, unten = offen, `ds-accent`), darunter `.osc-adsr-body` mit vier weiteren Paaren und dem Pattern-Textfeld.
- `.controls-disabled` — `pointer-events: none; opacity: .45` für ganze Blöcke, wenn der Oszillator aus ist.
- `.osc-editor-placeholder` — gestrichelter `ds-border-strong`-Rahmen, `ds-radius-lg`, zentriertes 32-px-Icon und Text in `ds-text-3`; erscheint, wenn keine Zeile gewählt ist.

**Der Konsument liefert:** `oscillatorId` und das Settings-Objekt; Änderungen gehen über `updateParameter(key, value)` in den Store.

**Dos/Don'ts:** Genau ein Editor sichtbar (`:key` = gewählter Index). Parameter nur in Paaren Slider + Zahl. Keine weiteren Buttons im Kopf außer Kopieren/Einfügen.

Statische Vorschau (hand-written from `src/components/OscillatorItem.vue`, `src/styles/components/oscillator.css`).
