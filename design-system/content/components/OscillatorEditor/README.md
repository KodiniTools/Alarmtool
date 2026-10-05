# OscillatorEditor

Das Detail-Panel rechts neben der Liste: ein Verlaufs-Glaskasten mit Kopfzeile (Schalter, Titel, Wellenform-Badge, Kopieren/Einfügen) und Sektionen für Wellenform, Grundparameter sowie aufklappbare Hüllkurve und Rhythmus.

**Aufbau (Quelle `OscillatorItem.vue`, `oscillator.css`):**
- `.osc-editor` — Verlauf 160° aus `at-panel` 55 % → `at-surface` 45 % (Light: Weiß 70 % → `at-bg` 40 %), 1 px `at-hairline`, `at-radius`, `at-shadow-1`, `overflow: hidden`. `--disabled` dimmt alles auf 0.65.
- `.osc-editor-header` — Flex space-between, `space-4` `space-5` Padding, Grund `at-scrim`, Hairline unten. Titel `editor-title` 1.05 rem / 600 plus `.osc-editor-wave-badge` (`wave-badge`, Chip-Farben wie in der Liste). Aktionen sind `.btn-outline-secondary.btn-sm`; ≤ 900 px nur Icons (`.osc-action-label` versteckt).
- `.osc-editor-section` — `space-4` `space-5` Padding, Hairline unten (8 %), die letzte ohne. Jede beginnt mit `.osc-section-label` (Eyebrow mit Gold-Icon).
- `.osc-params-grid` — zwei Spalten, Gap `space-2` × `space-6`, ≤ 640 px eine Spalte; Zellen sind `FormControls`-Paare, deren Zahl zur zentrierten Pill mit Tabellenziffern und `at-bg` 45 % wird.
- `.osc-adsr-toggle` — Eyebrow als `<button>` mit Chevron (rechts = zu, unten = offen), darunter `.osc-adsr-body` mit vier weiteren Paaren (Attack, Decay, Sustain, Release) und dem Pattern-Textfeld.
- `.controls-disabled` — `pointer-events: none; opacity: .4` für ganze Blöcke, wenn der Oszillator aus ist.
- `.osc-editor-placeholder` — gestrichelter Rahmen, zentriertes Icon 2 rem bei 0.35, `at-muted`; erscheint, wenn keine Zeile gewählt ist.

**Der Konsument liefert:** `oscillatorId` und das Settings-Objekt; Änderungen gehen über `updateParameter(key, value)` in den Store. Der Ein/Aus-Schalter (`.toggle-switch`) hat im Quellcode **keine** Stilregeln — er erscheint als native Checkbox (siehe README, „Nicht synchronisiert").

**Dos/Don'ts:** Genau ein Editor sichtbar (`:key` = gewählter Index). Parameter nur in Paaren Slider + Zahl. Keine weiteren Buttons im Kopf außer Kopieren/Einfügen.

Statische Vorschau (hand-written from `src/components/OscillatorItem.vue`, `src/styles/components/oscillator.css`).
