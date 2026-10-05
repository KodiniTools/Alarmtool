# PresetCard

Die Preset-Karte: Icon-Kachel links, Name, Beschreibung, Tag-Pills und ein goldener Play-Pill, dazu das Banner über der Liste, das das aktive Preset nennt.

**Aufbau (Quelle `PresetsSection.vue`, `presets.js`, `presets.css`):**
- `.presets-intro` — `intro` 0.9 rem in `at-text-dim`, `space-6` darunter.
- `.preset-active-banner` — Flex space-between, `space-3` `space-5` Padding, `radius-card`, Gold 10 % mit Rahmen Gold 30 % (Light: Navy-Washes); `.preset-active-info` in `at-primary` mit `<strong>` in `at-text`; rechts `.btn-secondary.preset-reset-btn`.
- `.presets-grid` — Spalte, Gap `space-3`, scrollbar bis 65 vh mit dünner `at-muted`-Scrollbar und `scrollbar-gutter: stable`.
- `.preset-card` — Flex, Gap `space-4`, `space-4` `space-5` Padding, `radius-card`, `at-surface` 50 % (Light `at-bg` 45 %), Hairline. Hover: Rahmen Gold 30 %, 1 px Lift, Schatten. `.preset-active`: Rahmen `at-primary` + 1 px Goldring + Goldschimmer.
- `.preset-icon` — 44 px, `radius-card`, Gold 10 % (Light Navy 10 %), Icon `at-primary` 1.1 rem; ≤ 480 px 36 px.
- `.preset-name` (`preset-name`, ohne Unterstrich), `.preset-description` (`preset-description`, `at-text-dim`), `.preset-tags` mit `.preset-tag` (`tag`, `radius-pill`, Gold-Wash; Light: `at-info` auf Navy 8 %).
- `.preset-play` — Hairline oben, 0.6 rem Abstand; `.preset-play-btn` Pill 0.4 rem 0.9 rem, Gold 12 % mit Rahmen 30 %, `at-primary`-Text 0.8 rem / 600; `.active` Goldfüllung mit `at-primary-fg` und Glow (Light: `at-info` mit `at-on-info`).

**Der Konsument liefert:** Presets aus `PRESET_DEFINITIONS` (`id`, `nameKey`, `descKey`, `icon`, `tags[]`, `globalFilter`, `oscillators[]`); `activePreset` für Banner, Karte und Play-Zustand; `playPreset` übergibt an den Sticky-Player.

**Responsiv:** ≤ 768 px Karte als Spalte, zentriert, Play-Pill volle Breite.

**Dos/Don'ts:** Tags benennen Wellenformen und Filter, nichts anderes. Beschreibung in zwei Zeilen. Nur das aktive Preset trägt `.preset-active` **und** `.active` auf dem Play-Pill. Keine Lösch-/Edit-Aktionen auf eingebauten Presets.

Statische Vorschau (hand-written from `src/components/PresetsSection.vue`, `src/styles/components/presets.css`); Font-Awesome-Icons durch Platzhalter ersetzt.
