# PresetCard

Die Preset-Karte: Icon-Kachel links, Name, Beschreibung, Tag-Pills und ein Play-Pill; dazu das Banner über der Liste, das das aktive Preset nennt. Karten sind flache `ds-surface-1`-Flächen mit 1-px-Rahmen; Auswahl heißt `ds-accent-soft` plus `ds-accent`-Rahmen.

**Aufbau (Quelle `PresetsSection.vue`, `presets.js`, `presets.css`):**
- `.presets-intro` — 14 px in `ds-text-2`, 20 px darunter.
- `.preset-active-banner` — Flex space-between, Padding 12 / 16 px, `ds-radius-md`, `ds-accent-soft` mit Rahmen `ds-accent`; `.preset-active-info` in `ds-text-2` mit Häkchen in `ds-accent` und `<strong>` in `ds-text`; rechts `.btn-secondary.preset-reset-btn`.
- `.presets-grid` — Spalte, Gap 12 px, scrollbar bis 65 vh mit dünner Scrollbar in `ds-border-strong`.
- `.preset-card` — Flex, Gap 16 px, Padding 16 px, `ds-radius-md`, `ds-surface-1`, `ds-border`. Hover: Rahmen `ds-border-strong`. `.preset-active`: Rahmen `ds-accent`, Grund `ds-accent-soft`. Kein Lift, kein Schatten.
- `.preset-icon` — 40 px (`ds-control-lg`), `ds-radius-md`, `ds-surface-2`, Icon `ds-accent` 20 px; ≤ 480 px 36 px.
- `.preset-name` 14 px / 600, `.preset-description` 13 px `ds-text-2`, `.preset-tags` mit `.preset-tag` (20-px-Pill, `ds-surface-2`, `ds-border`, `ds-text-2`, 12 px / 500).
- `.preset-play` — Trennlinie oben, 12 px Abstand; `.preset-play-btn` Pill 28 px, `ds-surface-2` mit `ds-border-strong`, 13 px / 500; Hover `ds-surface-3`; `.active` Goldfüllung mit `ds-on-accent`.

**Der Konsument liefert:** Presets aus `PRESET_DEFINITIONS` (`id`, `nameKey`, `descKey`, `icon`, `tags[]`, `globalFilter`, `oscillators[]`); `activePreset` für Banner, Karte und Play-Zustand; `playPreset` übergibt an den Sticky-Player.

**Responsiv:** ≤ 768 px Karte als Spalte, zentriert, Play-Pill volle Breite.

**Dos/Don'ts:** Tags benennen Wellenformen und Filter, nichts anderes. Beschreibung in zwei Zeilen. Nur das aktive Preset trägt `.preset-active` **und** `.active` auf dem Play-Pill. Keine Lösch-/Edit-Aktionen auf eingebauten Presets.

Statische Vorschau (hand-written from `src/components/PresetsSection.vue`, `src/styles/components/presets.css`); Font-Awesome-Icons durch Platzhalter ersetzt.
