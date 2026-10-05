# OscillatorList

Die Master-Liste der zwölf Oszillatoren in der Sidebar: Kopfzeile mit Zähler-Badge, darunter Zeilen aus Ein/Aus-Punkt, Wellenform-Chip, Name und Frequenz.

**Aufbau (Quelle `OscillatorGrid.vue`, `OscillatorListRow.vue`, `oscillator.css`):**
- `.osc-sidebar-header` / `.osc-sidebar-title` — `panel-title` 16 px / 600 mit Icon in `ds-accent` (16 px); `.osc-active-badge` als 20-px-Pill wie `UiPanel count`: `ds-surface-2`, `ds-text-2`, 12 px / 600, Tabellenziffern.
- `.osc-list` — 4 px vertikales Padding; liegt im Körper der Collapsible „Oszillator wählen". ≤ 640 px zweispaltiges Grid, ≤ 420 px einspaltig.
- `.osc-list-row` — `<button>` volle Breite, Padding 8 / 12 px, Gap 8 px, `ds-radius-sm`, Text `ds-text`. Hover `ds-surface-3`; `--selected` `ds-accent-soft` plus 3-px-Balken `ds-accent` links; `--disabled` Opazität 0.55; Fokus `ds-focus-ring`.
- `.osc-row-toggle` — 16-px-Ring in `ds-border-strong` mit 8-px-Punkt in `ds-text-3`; `--on` färbt Punkt und Ring `ds-accent`. Klick stoppt die Zeilenauswahl (`@click.stop`).
- `.osc-wave-chip` — `chip` 12 px / 600, 18 px hoch, `ds-surface-2` mit `ds-border`, `ds-radius-sm`; Ink je Wellenform: `--sine` `ds-success`, `--square` `ds-accent`, `--sawtooth` `ds-danger`, `--triangle` `ds-info`, `--pulse` `ds-warning`, `--organ` `ds-text-2`.
- `.osc-row-name` 13 px / 500 mit Ellipsis; `.osc-row-meta` 12 px `ds-text-3`, Tabellenziffern („660 Hz" oder kursiv „aus").

**Der Konsument liefert:** je Zeile `oscillatorId`, das Oszillator-Objekt (`enabled`, `waveType`, `frequency`), `selected`; Events `select` und `toggle-enabled`.

**Dos/Don'ts:** Chips zeigen das Kürzel aus `WAVE_ABBR`, nie den vollen Namen. Nur eine Zeile ist `--selected`; beliebig viele sind an. Keine Drag-Handles oder Kontextmenüs.

Statische Vorschau (hand-written from `src/components/oscillator/OscillatorListRow.vue`, `src/styles/components/oscillator.css`).
