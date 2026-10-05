# WaveSelector

Das Wellenform-Raster im Oszillator-Editor: sechs Kacheln mit der 40×20-Glyphe über dem Namen, genau eine golden umrandet.

**Aufbau (Quelle `OscillatorItem.vue`, `waveforms.js`, `oscillator.css`):**
- `.osc-section-label` — Eyebrow „WELLENFORM" (`eyebrow`, `at-muted`, goldenes Icon) mit `space-4` darunter.
- `.osc-wave-selector` — Grid 3 Spalten, Gap `space-2` (≤ 900 px 2, ≤ 640 px 3, ≤ 420 px 2).
- `.osc-wave-btn` — Spalte, `space-3` `space-2` Padding, `at-scrim`-Grund, 1 px `at-hairline`, `at-radius-sm`, Text `wave-button` 0.72 rem in `at-muted`. Hover: Gold 8 %, Rahmen Gold 30 %, `at-text`, 1 px Lift. `--active`: Gold 12 %, Rahmen `at-primary`, Text `at-primary`, zusätzlich 1 px Innenring. `disabled`: Opazität 0.4.
- `.osc-wave-icon` — 40 × 20 px, `stroke="currentColor"`, Strich 1.5, runde Enden; Pfade aus `WAVE_TYPES[].svgPath` (auch unter `assets/Icons/wave-*.svg`).

**Der Konsument liefert:** die Reihenfolge und Pfade aus `WAVE_TYPES` (Sinus, Rechteck, Sägezahn, Dreieck, Puls, Orgel — Reihenfolge ist Anzeige-Reihenfolge), den aktiven `waveType`, `disabled` wenn der Oszillator aus ist, und `title` mit dem Namen.

**Dos/Don'ts:** Glyphen nie durch Font-Awesome oder Text ersetzen. Keine siebte Wellenform ohne Eintrag in `waveforms.js` (Fourier-Koeffizienten + Pfad). Die Kürzel SIN/SQR/… gehören in Chips und Badges, nicht in die Kacheln.

Statische Vorschau (hand-written from `src/components/OscillatorItem.vue`, `src/lib/waveforms.js`).
