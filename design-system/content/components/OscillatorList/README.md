# OscillatorList

Die Master-Liste der zwölf Oszillatoren in der Sidebar: Kopfzeile mit Zähler-Badge, darunter Zeilen aus Ein/Aus-Punkt, Wellenform-Chip, Name und Frequenz.

**Aufbau (Quelle `OscillatorGrid.vue`, `OscillatorListRow.vue`, `oscillator.css`):**
- `.osc-sidebar-header` / `.osc-sidebar-title` — `sidebar-title` 1 rem / 700 mit goldenem Icon; `.osc-active-badge` als 999-px-Pill (`active-badge`, Gold auf Gold 14 %) zeigt „n/12 aktiv".
- `.osc-list` — `space-1` vertikales Padding; liegt im Körper der Collapsible „Oszillator wählen". ≤ 640 px zweispaltiges Grid, ≤ 420 px einspaltig.
- `.osc-list-row` — `<button>` volle Breite, `space-2` `space-4` Padding, Gap `space-2`, `at-radius-xs`, Text `at-text`. Hover Gold 6 %; `--selected` Gold 10 % plus 3-px-Goldbalken links (Light: Navy-Washes); `--disabled` Opazität 0.55.
- `.osc-row-toggle` — 16-px-Ring in `at-muted` mit 8-px-Punkt; `--on` färbt Punkt und Ring `at-primary`. Klick stoppt die Zeilenauswahl (`@click.stop`).
- `.osc-wave-chip` — `wave-chip` 0.6 rem / 700, `radius-chip`, Ink und 15 %-Tint je Wellenform: `--sine` `at-success`, `--square` `at-primary`, `--sawtooth` `at-danger`, `--triangle` `at-info-text`, `--pulse` `at-wave-pulse`, `--organ` `at-wave-organ`.
- `.osc-row-name` 0.82 rem / 500 mit Ellipsis; `.osc-row-meta` 0.7 rem `at-muted` („660 Hz" oder kursiv „aus").

**Der Konsument liefert:** je Zeile `oscillatorId`, das Oszillator-Objekt (`enabled`, `waveType`, `frequency`), `selected`; Events `select` und `toggle-enabled`.

**Dos/Don'ts:** Chips zeigen das Kürzel aus `WAVE_ABBR`, nie den vollen Namen. Nur eine Zeile ist `--selected`; beliebig viele sind an. Keine Drag-Handles oder Kontextmenüs.

Statische Vorschau (hand-written from `src/components/oscillator/OscillatorListRow.vue`, `src/styles/components/oscillator.css`).
