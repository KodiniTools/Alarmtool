# Tabs

Die Hauptnavigation der App: eine 720 px breite, abgedunkelte Leiste mit Icon-Text-Buttons, von denen genau einer golden hervorgehoben ist.

**Aufbau (Quelle `layout.css`, `App.vue`):**
- `.tabs` — Flex, Gap `space-2`, Padding `space-1`, `at-radius`, Grund `at-bg` bei 50 % (Light: `at-text-dim` 40 %), weicher Schatten, zentriert, `space-8` Abstand nach unten.
- `.tab-btn` — transparent, `at-radius-sm`, 0.6 rem × `space-5` Padding, Text `tab` 0.9 rem / 500 in `at-info-text`, Icon-Gap 0.4 rem. Hover: Gold-Wash, `at-text`, 1 px Lift.
- `.tab-btn.active` — `at-primary` auf `at-primary-fg` mit `shadow-tab-active`.
- `.tab-btn--link` — gleicher Look für einen externen Link (Blog), `margin-left: auto` schiebt ihn ans Ende, Fokus-Outline 2 px `at-primary`.

**Der Konsument liefert:** je Tab ein `<button>` mit Icon (`<i class="fas …">`) und `<span>`-Label; den aktiven Tab per `.active`. Reihenfolge der App: Filter · Oszillatoren · Aufnahme · Presets · FAQ · Blog. Der Inhalt darunter wird per `v-show` gewechselt, der Player bleibt sichtbar.

**Responsiv:** ≤ 768 px horizontal scrollbar ohne Scrollbar, Padding `space-2` `space-3`, Schrift 0.8 rem; ≤ 480 px nur Icons (`span` ausgeblendet, Icon 1 rem).

**Dos/Don'ts:** Maximal eine Leiste pro Seite. Keine Badges oder Zähler auf Tabs. Externe Ziele nur über `.tab-btn--link` mit `target="_blank" rel="noopener noreferrer"`.

Statische Vorschau (hand-written from `src/styles/layout.css`, `App.vue`).
