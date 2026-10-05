# WaveSelector

Das Wellenform-Raster im Oszillator-Editor: sechs Kacheln mit der 40×20-Glyphe über dem Namen; die gewählte trägt `ds-accent-soft` mit `ds-accent`-Rahmen — das Auswahlmuster des Collage Makers (`border-accent bg-accent-soft`).

**Aufbau (Quelle `OscillatorItem.vue`, `waveforms.js`, `oscillator.css`):**
- `.osc-section-label` — Eyebrow „WELLENFORM" (12 px / 600, VERSALIEN, `ds-text-3`, Icon `ds-accent`) mit 16 px darunter.
- `.osc-wave-selector` — Grid 3 Spalten, Gap 8 px (≤ 900 px 2, ≤ 640 px 3, ≤ 420 px 2).
- `.osc-wave-btn` — Spalte, Padding 12 / 8 px, `ds-surface-2`, `ds-border-strong`, `ds-radius-md`, Text 13 px / 500 in `ds-text-2`. Hover: Rahmen `ds-accent`, Text `ds-text`. `--active`: `ds-accent-soft`, Rahmen `ds-accent`, Text `ds-text`. Fokus `ds-focus-ring`; `disabled` 0.45. Kein Lift, kein Innenring.
- `.osc-wave-icon` — 40 × 20 px, `stroke="currentColor"`, Strich 1.5, runde Enden; Pfade aus `WAVE_TYPES[].svgPath` (auch unter `assets/Icons/wave-*.svg`).

**Der Konsument liefert:** die Reihenfolge und Pfade aus `WAVE_TYPES` (Sinus, Rechteck, Sägezahn, Dreieck, Puls, Orgel), den aktiven `waveType`, `disabled` wenn der Oszillator aus ist, `title` mit dem Namen.

**Dos/Don'ts:** Glyphen nie durch Font Awesome oder Text ersetzen. Keine siebte Wellenform ohne Eintrag in `waveforms.js`. Die Kürzel SIN/SQR/… gehören in Chips und Badges, nicht in die Kacheln.

Statische Vorschau (hand-written from `src/components/OscillatorItem.vue`, `src/lib/waveforms.js`).
