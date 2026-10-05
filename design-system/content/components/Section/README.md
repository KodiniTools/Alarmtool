# Section

Die Glaskarte, in der jeder Tab-Inhalt liegt: Goldlinie oben, 85 % `at-surface` mit Blur, 12-px-Radius, `space-6` Innenabstand.

**Aufbau (Quelle `layout.css`, `base.css`):**
- `.section` — `backdrop-filter: blur(12px)`, Rahmen 1 px Gold bei 8 % (Light: Navy 10 %), `shadow-section`, `overflow: hidden`, `space-5` Abstand nach unten. `::before` zeichnet die 3-px-Linie `at-primary` → `at-text`.
- `h2` darin — `h2`-Stil 1.75 rem / 600, `space-6` darunter, `::after` setzt einen 60 × 2 px Goldunterstrich.
- `.section-narrow` — `max-width: 720px`, zentriert; `h2` wird `h2-narrow` (1.1 rem, `space-4`), Slider werden feiner (3 px Spur, 12 px Daumen).

**Der Konsument liefert:** genau eine `h2` als erstes Kind, dann Inhalt (Formgruppen, Listen, Karten). Breite Sektion nur für den Oszillator-Master-Detail; alle anderen Tabs sind `.section-narrow`.

**Responsiv:** ≤ 768 px Padding 1.1 rem, Radius 10 px; ≤ 480 px Padding 0.85 rem, `at-radius-sm`.

**Dos/Don'ts:** Keine Sektion in Sektion. Keine zusätzliche Linie oder Hintergrundfarbe — `.section` ist die einzige Karte erster Ordnung; innere Flächen nutzen Editor, Collapsible oder Preset-Karte. Die Goldlinie nicht entfernen, sie ist das Erkennungsmerkmal.

Statische Vorschau (hand-written from `src/styles/layout.css`, `App.vue`).
