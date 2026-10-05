# CollapsibleSection

Das Sidebar-„Dropdown": eine dunkle Glasfläche mit Icon-Kachel, fettem Titel, optionaler Zusammenfassung und Chevron, deren Inhalt ohne Höhenmessung auf- und zuklappt.

**Aufbau (Quelle `CollapsibleSection.vue`, `sidebar.css`):**
- `.collapsible` — `at-bg` 40 % (Light: Weiß 65 % mit `at-shadow-1`), 1 px `at-hairline`, `at-radius`, `overflow: hidden`.
- `.collapsible-header` — `<button>` volle Breite, `space-3` `space-4` Padding, Gap `space-2`; Hover Gold-Wash 6 %, Fokus 2 px `at-primary` nach innen.
- `.collapsible-icon` — 26 px Kachel, `at-radius-xs`, Gold 14 %, Icon `at-primary` 0.75 rem.
- `.collapsible-title` — `collapsible-title` 0.8 rem / 700; `.collapsible-summary` rechts in `at-muted` 0.7 rem mit Ellipsis; `.collapsible-chevron` dreht bei `--open` um 180°.
- `.collapsible-body` — Grid `0fr → 1fr` über `at-speed-slow`; `.collapsible-inner` mit `min-height: 0; overflow: hidden`, bei geöffnet ein Hairline oben.

**Der Konsument liefert:** `title` (Pflicht), optional `icon` (Font-Awesome-Klasse), `summary` (aktuelle Auswahl), `defaultOpen`; den Inhalt als Slot. Die Komponente setzt `aria-expanded`, `aria-controls`, `role="region"` und `inert` auf den geschlossenen Körper.

**Dos/Don'ts:** Nur in der Oszillator-Sidebar und unter dem Filter (`.filter-save-options`, `space-5` oben). Inhalt ohne eigenes Padding — Listen und Menüs bringen ihres mit. `prefers-reduced-motion` schaltet die Animation ab; nicht überschreiben.

Statische Vorschau (hand-written from `src/components/ui/CollapsibleSection.vue`, `src/styles/components/sidebar.css`).
