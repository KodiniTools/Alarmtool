# PlayerBar

Der immer sichtbare Player am unteren Rand: Statuszeile (Punkt, Label, Titel, Zeit), 4-px-Fortschrittslinie, Transport-Gruppe als Segment-Control, Loop, Stumm und Lautstärke — als festes `ds-surface-1`-Band mit Trennlinie oben und `ds-shadow-overlay` (Toolbar).

**Aufbau (Quelle `PlayerControl.vue`, `App.vue`, `player.css`):**
- `.player-bar` — `position: fixed; bottom: 0`, `ds-z-player`, Padding 12 / 20 px plus `safe-area-inset-bottom`, `ds-surface-1`, Rahmen `ds-border` oben, `ds-shadow-overlay`. `App.vue` misst die Höhe und schreibt `--player-bar-height`. `.player-bar__inner` 960 px.
- `.player` — Standalone-Shell (`ds-surface-1`, `ds-border`, `ds-radius-lg`); innerhalb der Bar flach, `.player-hint` versteckt.
- `.player-status-bar` — Flex space-between: `.player-status-dot` 8 px (`ds-text-3` → `ds-success` pulsierend → `ds-warning`), `.player-status-label` (`eyebrow`, Farbe folgt dem Status), `.player-track-name` (13 px / 500 in `ds-text-2`, Noten-Icon `ds-accent`, nur während Wiedergabe), `.player-time-display` (`time-display`, Mono, `ds-text-2`).
- `.player-progress-track` — 4 px, `ds-border-strong`, `ds-radius-full`; `.player-progress-fill` `ds-accent`, 30-s-Zyklus.
- `.player-transport` — Segment-Control: 36 px, `ds-surface-0`, `ds-border`, `ds-radius-md`, 2 px Innenabstand; `.transport-btn` 32 px breit, `ds-radius-sm`, `ds-text-2`; Hover `ds-surface-2`; `--play.--active` als Primär in `ds-accent` / `ds-on-accent` („an" wird primär gezeigt); `disabled` 0.45.
- `.player-aux-btn` — Icon-Button sekundär: 36 px, `ds-surface-2`, `ds-border-strong`, `ds-radius-md`; Hover `ds-surface-3`; `--active` (gedrückt) Rahmen und Icon `ds-accent`; `aria-pressed`.
- `.player-volume-group` — Stumm-Button, 72-px-`.form-range` (0.45 bei stumm), `.player-volume-pct` (12 px, Tabellenziffern, `ds-text-3`). ≤ 520 px: 52 px Slider, Prozent versteckt.

**Der Konsument liefert:** nichts außer dem Store — Status, Zeit, Lautstärke, Loop/Mute und das Preset-Label kommen aus `useAlarmStore`/`usePlayer`; Tastatur: Leertaste, Esc, M, L.

**Dos/Don'ts:** Nur eine Player-Bar pro Seite, immer unten. Transport-Icons sind Play / Pause / Stop in dieser Reihenfolge; der Play-Button ist während der Wiedergabe deaktiviert **und** golden. Zusatzfunktionen sind `.player-aux-btn`, nie in der Transport-Gruppe.

Statische Vorschau (hand-written from `src/components/PlayerControl.vue`, `src/styles/components/player.css`); hier mit `position: relative`.
