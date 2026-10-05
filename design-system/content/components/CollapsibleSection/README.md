# CollapsibleSection

Das Sidebar-„Dropdown": eine `ds-surface-1`-Fläche mit 1-px-Rahmen und 10-px-Radius, Kopfzeile aus Icon-Kachel, halbfettem Titel, optionaler Zusammenfassung und Chevron; der Inhalt klappt ohne Höhenmessung auf und zu.

**Aufbau (Quelle `CollapsibleSection.vue`, `sidebar.css`):**
- `.collapsible` — `ds-surface-1`, `ds-border`, `ds-radius-md`, `overflow: hidden`.
- `.collapsible-header` — `<button>` volle Breite, mindestens 44 px (`ds-row-height`), Padding 8 / 12 px, Gap 8 px; Hover `ds-surface-2`; Fokus `ds-focus-ring` nach innen.
- `.collapsible-icon` — 28-px-Kachel (`ds-control-sm`), `ds-radius-sm`, `ds-accent-soft` mit Icon in `ds-accent`.
- `.collapsible-title` — 13 px / 600; `.collapsible-summary` rechts 12 px in `ds-text-3` mit Ellipsis; `.collapsible-chevron` in `ds-text-3`, dreht bei `--open` um 180° (`ds-duration`).
- `.collapsible-body` — Grid `0fr → 1fr` über `ds-duration-slow`; `.collapsible-inner` mit `min-height: 0; overflow: hidden`, geöffnet mit Trennlinie `ds-border` oben.

**Der Konsument liefert:** `title` (Pflicht), optional `icon` (Font-Awesome-Klasse), `summary` (aktuelle Auswahl), `defaultOpen`; den Inhalt als Slot. Die Komponente setzt `aria-expanded`, `aria-controls`, `role="region"` und `inert` auf den geschlossenen Körper.

**Dos/Don'ts:** Nur in der Oszillator-Sidebar und unter dem Filter (`.filter-save-options`, 20 px oben). Inhalt ohne eigenes Padding — Listen und Menüs bringen ihres mit. `prefers-reduced-motion` schaltet die Animation global ab.

Statische Vorschau (hand-written from `src/components/ui/CollapsibleSection.vue`, `src/styles/components/sidebar.css`).
