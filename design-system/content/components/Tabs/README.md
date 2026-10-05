# Tabs

Die Hauptnavigation als Segment-Control nach `UiSegmentedControl`: eine 720 px breite Leiste auf `ds-surface-0` mit 1-px-Rahmen, darin Icon-Text-Optionen, von denen genau eine als `ds-surface-1`-Fläche mit `ds-border-strong` hervorsteht.

**Aufbau (Quelle `layout.css`, `App.vue`):**
- `.tabs` — Flex, Gap und Padding 2 px, `ds-radius-md`, zentriert, 24 px Abstand nach unten.
- `.tab-btn` — 32 px hoch (`ds-control-md` minus Innenabstand), `flex: 1`, Padding 0 12 px, `ds-radius-sm`, transparenter 1-px-Rahmen, `tab` 13 px / 500 in `ds-text-2`, Icon-Gap 8 px. Hover: Text `ds-text`. Fokus: `ds-focus-ring`.
- `.tab-btn.active` — `ds-surface-1`, Rahmen `ds-border-strong`, Text `ds-text`. Kein Gold: Gold bleibt der Primäraktion vorbehalten.
- `.tab-btn--link` — gleicher Look für den externen Blog-Link, `margin-left: auto`, feste Breite.

**Der Konsument liefert:** je Tab ein `<button>` mit Icon (`<i class="fas …">`) und `<span>`-Label; den aktiven Tab per `.active`. Reihenfolge der App: Filter · Oszillatoren · Aufnahme · Presets · FAQ · Blog.

**Responsiv:** ≤ 768 px horizontal scrollbar ohne Scrollbalken, Optionen in Inhaltsbreite, 12 px; ≤ 480 px nur Icons.

**Dos/Don'ts:** Maximal eine Leiste pro Seite. Keine Badges auf Tabs. Externe Ziele nur über `.tab-btn--link` mit `target="_blank" rel="noopener noreferrer"`.

Statische Vorschau (hand-written from `src/styles/layout.css`, `App.vue`).
