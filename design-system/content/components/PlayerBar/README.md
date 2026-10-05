# PlayerBar

Der immer sichtbare Player am unteren Rand: Statuszeile (Punkt, Label, Titel, Zeit), 3-px-Fortschrittslinie, Transport-Gruppe, Loop, Stumm und Lautstärke — als festes Glasband über allen Tabs.

**Aufbau (Quelle `PlayerControl.vue`, `App.vue`, `player.css`):**
- `.player-bar` — `position: fixed; bottom: 0`, `z-player-bar`, `space-3` `space-5` Padding plus `safe-area-inset-bottom`, Grund `at-bg` 82 % (Light `at-bg` 85 %), Hairline oben, `shadow-player-bar`, Blur 12 px. `App.vue` misst die Höhe und schreibt `--player-bar-height`, das der Container unten reserviert. `.player-bar__inner` 960 px.
- `.player` — Standalone-Shell (`at-surface` 60 %, `at-radius`, Hairline, Blur 8 px); **innerhalb** der Bar wird sie flach (kein Grund, Rahmen, Padding) und `.player-hint` ist versteckt.
- `.player-status-bar` — Flex space-between: `.player-status-dot` 8 px (`at-muted` → `at-success` pulsierend → `at-warning`), `.player-status-label` (`status-label`, VERSALIEN, Farbe folgt dem Status: „Bereit / Läuft / Pausiert"), `.player-track-name` (`track-name`, `at-primary`, nur während Wiedergabe), `.player-time-display` (`time-display`, Mono).
- `.player-progress-track` — 3 px, `at-muted` 20 %; `.player-progress-fill` `at-primary`, 30-s-Zyklus, `width`-Transition 0.25 s linear.
- `.player-transport` — 10-px-Gruppe, 3 px Padding, `at-scrim` 40 %; `.transport-btn` 32 px, `radius-transport` 7 px, `at-muted`; Hover Gold 10 %; `--play.--active` Gold auf `at-primary-fg`; `disabled` 0.35.
- `.player-aux-btn` — 32 px, `at-radius-sm`, `at-scrim` 30 %, Hairline; `--active` Gold 15 % mit `at-primary`-Text und Rahmen 40 %; `aria-pressed`.
- `.player-volume-group` — Stumm-Button, 72-px-Slider (`accent-color: at-primary`, 0.35 bei stumm), `.player-volume-pct` (Tabellenziffern, 2.8ch). ≤ 520 px: 52 px Slider, Prozent versteckt.

**Der Konsument liefert:** nichts außer dem Store — Status, Zeit, Lautstärke, Loop/Mute und das Preset-Label kommen aus `useAlarmStore`/`usePlayer`; Tastatur: Leertaste, Esc, M, L.

**Dos/Don'ts:** Nur eine Player-Bar pro Seite, immer unten, immer über dem Inhalt. Transport-Icons sind Play / Pause / Stop in dieser Reihenfolge; der Play-Button ist während der Wiedergabe deaktiviert **und** golden. Keine weiteren Buttons in die Transport-Gruppe; Zusatzfunktionen sind `.player-aux-btn`.

Statische Vorschau (hand-written from `src/components/PlayerControl.vue`, `src/styles/components/player.css`); hier mit `position: relative`.
