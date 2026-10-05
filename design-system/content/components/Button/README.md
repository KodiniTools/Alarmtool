# Button

Der Textbutton der App nach `UiButton` des Collage Makers: 36 px hoch, 10-px-Radius, 1-px-Rahmen, Icon links mit 8 px Abstand; Hover ändert nur die Farbe.

**Wann:** jede Aktion mit Text — Aufnahme starten, Download, Verwerfen, Zurücksetzen, Kopieren/Einfügen. Nicht für Transport (Play/Pause/Stop), Tabs oder Listenauswahl; die haben eigene Komponenten.

**Varianten (Quelle `button.css`):**
- `.btn-primary`, `.btn-success` — die einzige Goldfläche pro Ansicht: `ds-accent` mit `ds-on-accent`, Gewicht 600, Hover `ds-accent-hover`. Aufnahme starten, Speichern.
- `.btn-secondary`, `.btn-outline-secondary` — Standard: `ds-surface-2` mit `ds-border-strong`, Hover `ds-surface-3`. Download, Konvertieren, Zurücksetzen, Editor-Aktionen; als `<a download>` mit `.download-ready` auch für Links.
- `.btn-danger`, `.btn-outline-danger` — textbasiert: `ds-danger` auf transparentem Grund, Hover `ds-surface-2`. Verwerfen, Aufnahme löschen. Nie als Vollfläche.
- `.btn-sm` — 28 px, 6-px-Radius, `button-sm` 13 px; für Aktionen in Kopfzeilen und Konvertierung.

**Zustände:** Fokus über `ds-focus-ring` (kein Outline); `disabled` nur Opazität 0.45 und `cursor: not-allowed`. Kein Lift, kein Schatten, kein Lichtstreifen.

**Der Konsument liefert:** `<button>` oder `<a>`, Label in Satzschreibung, optional ein Icon-Element vor dem Text (`<i class="fas fa-…">`, 16 px).

**Dos/Don'ts:** Ein Primär-Button pro Panel. Icon-only-Aktionen sind Transport-/Aux-Buttons, nicht `.btn`. Keine zusätzlichen Farben; Status wird durch Text und Icon vermittelt.

Statische Vorschau (hand-written from `src/styles/components/button.css`); Font-Awesome-Icons durch Inline-SVG-Platzhalter ersetzt.
