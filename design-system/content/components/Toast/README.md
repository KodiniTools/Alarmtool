# Toast

Die Benachrichtigung nach `UiToast` des Collage Makers: `ds-surface-1`-Karte mit 1-px-Rahmen, 3-px-Statuskante links, Icon in Statusfarbe, Text, Schließen-Button und einer dünnen Countdown-Linie; `ds-shadow-overlay` als einziger Schatten.

**Aufbau (Quelle `ToastContainer.vue`, `useToast.js`, `toast.css`):**
- `.toast-container` — `position: fixed`, 64 px von oben, 20 px von rechts, `ds-z-toast`, Spalte mit 8 px Gap, max 400 px; `aria-live="polite"`. ≤ 768 px über der Player-Bar, volle Breite. (Collage Maker: unten rechts — hier liegt dort der Player.)
- `.toast-item` — Flex center, Gap 12 px, Padding 12 / 12 / 12 / 16 px, `ds-border`, `border-left: 3px` in Statusfarbe, `ds-radius-md`, `ds-surface-1`, `ds-shadow-overlay`; `role="alert"`. Ein/Aus über Opazität und 16 px seitlich (`ds-duration-slow`, mobil von unten).
- Typen: `.toast-success` (`ds-success`, 3500 ms, `fa-check-circle`), `.toast-error` (`ds-danger`, 6000 ms, `fa-exclamation-circle`), `.toast-warning` (`ds-warning`, 5000 ms, `fa-exclamation-triangle`), `.toast-info` (`ds-info`, 4000 ms, `fa-info-circle`). Die Farbe sitzt auf Kante, `.toast-icon` (16 px) und `.toast-progress`.
- `.toast-body` — 13 px in `ds-text`; `.toast-close` 28-px-Ghost-Button in `ds-text-2`, Hover `ds-surface-2`; `.toast-progress` 2 px unten, `scaleX(1 → 0)` über die Dauer.

**Der Konsument liefert:** `useToast().show(message, { type, duration, icon })`; die Komponente stapelt, animiert und entfernt. `duration: 0` zeigt keine Countdown-Linie und bleibt bis zum Schließen.

**Dos/Don'ts:** Ein Satz pro Toast. Fehler immer mit Grund. Kein Toast für Zustände, die der Player schon anzeigt (läuft/pausiert).

Statische Vorschau (hand-written from `src/components/ToastContainer.vue`, `src/styles/components/toast.css`); Container hier `position: static`, Countdown eingefroren.
