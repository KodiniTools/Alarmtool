# Section

Das Panel, in dem jeder Tab-Inhalt liegt — nach `UiPanel`: flache `ds-surface-1`-Fläche, 1-px-Rahmen `ds-border`, 16-px-Radius, 20 px Innenabstand, Panel-Titel mit Trennlinie.

**Aufbau (Quelle `layout.css`, `base.css`):**
- `.section` — `ds-surface-1`, `ds-border`, `ds-radius-lg`, Padding `ds-space-5`, `ds-gap` (20 px) Abstand nach unten. Kein Schatten, kein Blur, keine Goldlinie.
- `.section > h2` — `panel-title` 16 px / 600, 12 px Abstand und Trennlinie `ds-border` darunter, 16 px bis zum Inhalt.
- `.section-narrow` — `max-width: 720px`, zentriert; für Filter, Aufnahme, Presets und FAQ. Die Oszillatoren nutzen die volle Containerbreite (1200 px).

**Der Konsument liefert:** genau eine `h2` als erstes Kind, dann Inhalt (Formgruppen, Listen, Karten).

**Responsiv:** ≤ 768 px Padding 16 px, Radius `ds-radius-md`; ≤ 480 px Padding 12 px.

**Dos/Don'ts:** Keine Sektion in Sektion; innere Flächen sind Editor, Collapsible oder Preset-Karte (gleiche Fläche, eigener Rahmen). Keine Akzentlinien oder Hintergrundbilder — der Rahmen trennt.

Statische Vorschau (hand-written from `src/styles/layout.css`, `App.vue`).
