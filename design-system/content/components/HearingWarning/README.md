# HearingWarning

Der einmalige Gehörschutz-Hinweis als Callout nach `UiCallout`/`UiToast`: `ds-surface-1`-Band direkt über der Player-Bar, 3-px-Kante links in `ds-danger`, Lautsprecher-Icon in `ds-danger`, halbfetter Titel, Erklärtext und ein kleiner Sekundär-Button „Verstanden".

**Aufbau (Quelle `HearingWarning.vue`, `hearing-warning.css`):**
- `.hearing-warning` — `position: fixed`, `bottom` = `var(--player-bar-height)` (inline gesetzt), `calc(ds-z-player − 1)`, 20 px seitlich, `pointer-events: none` außen; `role="alert"`.
- `.hearing-warning__inner` — 960 px zentriert, 8 px Abstand zur Bar, Flex mit 12 px Gap, Padding 12 / 12 / 12 / 16 px, `ds-border` plus `border-left: 3px ds-danger`, `ds-radius-md`, `ds-surface-1`, `ds-shadow-overlay`.
- `.hearing-warning__icon` — 20 px (`ds-icon-md`) in `ds-danger` (`fa-volume-high`); `.hearing-warning__title` 13 px / 600 in `ds-text`; `.hearing-warning__text` 13 px in `ds-text-2`.
- `.hearing-warning__dismiss` — Sekundär-Button 28 px (`ds-surface-2`, `ds-border-strong`, `ds-radius-sm`, 13 px / 500); Hover `ds-surface-3`; Fokus `ds-focus-ring`. ≤ 560 px volle Breite unter dem Text.
- Ein-/Ausblenden über die Vue-Transition `hearing-warning` (`ds-duration-slow`, 8 px von unten).

**Der Konsument liefert:** nichts — die Komponente liest `localStorage['alarmToolHearingAck']` und zeigt sich bis zum Klick auf „Verstanden"; ohne Storage (privater Modus) erscheint sie bei jedem Besuch.

**Dos/Don'ts:** Text ist Sicherheitsinformation — nicht kürzen, beide Sprachen pflegen. Nur ein Dismiss, kein „Später". Danger bleibt Text, Icon und Kante — nie Button-Füllung.

Statische Vorschau (hand-written from `src/components/HearingWarning.vue`, `src/styles/components/hearing-warning.css`); hier `position: static`.
