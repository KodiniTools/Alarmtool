# HearingWarning

Der einmalige Gehörschutz-Hinweis: ein rot getöntes Glasband direkt über der Player-Bar mit Lautsprecher-Icon, fettem Titel in `at-danger`, Erklärtext und einem roten „Verstanden"-Pill.

**Aufbau (Quelle `HearingWarning.vue`, `hearing-warning.css`):**
- `.hearing-warning` — `position: fixed`, `bottom` = `var(--player-bar-height)` (inline gesetzt), `z-hearing-warning`, `space-5` seitlich, `pointer-events: none` außen; `role="alert"`.
- `.hearing-warning__inner` — 960 px zentriert, `space-2` Abstand zur Bar, Flex mit `space-3` Gap, `space-3` `space-4` Padding, 12 px Radius, Grund `at-hearing-ground` (rotgetönt, 92 %), Rahmen `at-danger` 40 % (Light `rgba(200,60,60,.35)`), Schatten, Blur 12 px.
- `.hearing-warning__icon` — 1.1 rem `at-danger` (`fa-volume-high`); `.hearing-warning__title` `hearing-title` 0.82 rem / 700 in `at-danger`; `.hearing-warning__text` `hearing-text` 0.78 rem in `at-text`.
- `.hearing-warning__dismiss` — Pill 0.4 rem 0.9 rem, `at-danger` Füllung und Rahmen, Ink `at-on-danger-deep` (5.8:1), 0.78 rem / 600; Hover `brightness(1.08)` + 1 px Lift. ≤ 560 px volle Breite unter dem Text.
- Ein-/Ausblenden über die Vue-Transition `hearing-warning` (0.25 s, 12 px von unten).

**Der Konsument liefert:** nichts — die Komponente liest `localStorage['alarmToolHearingAck']` und zeigt sich bis zum Klick auf „Verstanden"; ohne Storage (privater Modus) erscheint sie bei jedem Besuch.

**Dos/Don'ts:** Text ist Sicherheitsinformation — nicht kürzen, beide Sprachen pflegen. Nur ein Dismiss, kein „Später". Der Hinweis deckt nie Header oder Listen; er klebt an der Player-Bar.

Statische Vorschau (hand-written from `src/components/HearingWarning.vue`, `src/styles/components/hearing-warning.css`); hier `position: static`.
