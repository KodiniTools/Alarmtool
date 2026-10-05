# Toast

Die Benachrichtigung oben rechts: eine `at-panel`-Glaskarte mit 3-px-Farbkante links, Icon, Text, Schließen-Kreuz und einer schrumpfenden Fortschrittslinie als Countdown.

**Aufbau (Quelle `ToastContainer.vue`, `useToast.js`, `toast.css`):**
- `.toast-container` — `position: fixed`, 60 px von oben, 20 px von rechts, `z-toast`, Spalte mit `space-2` Gap, max 420 px; `aria-live="polite"`. ≤ 768 px unten über volle Breite.
- `.toast-item` — Flex `flex-start`, 0.65 rem Gap, `space-3` `space-4` Padding, `radius-card`, Grund `at-panel` (Light Weiß 95 %), Rahmen `at-border-color`, `at-shadow-2` + 1 px Ring, Blur 16 px; `role="alert"`. Ein: von rechts (`duration-toast`, `.toast-visible`), aus: `.toast-leaving` 0.3 s; mobil von unten.
- Typen: `.toast-success` (`at-success`, 3500 ms, `fa-check-circle`), `.toast-error` (`at-danger`, 6000 ms, `fa-exclamation-circle`), `.toast-warning` (`at-warning`, 5000 ms, `fa-exclamation-triangle`), `.toast-info` (`at-info`, 4000 ms, `fa-info-circle`). Die Farbe sitzt auf `border-left`, `.toast-icon` und `.toast-progress`. Light-Theme tauscht Erfolg zu `at-success-light-ui`.
- `.toast-body` — `toast-body` 0.82 rem in `at-text`; `.toast-close` `at-muted` bei 0.5 → 1 auf Hover; `.toast-progress` 2 px unten, `scaleX(1 → 0)` über die Dauer.

**Der Konsument liefert:** `useToast().show(message, { type, duration, icon })`; die Komponente stapelt, animiert und entfernt. `duration: 0` zeigt keine Fortschrittslinie und bleibt bis zum Schließen.

**Dos/Don'ts:** Ein Satz pro Toast. Fehler immer mit Grund („… fehlgeschlagen: …"). Kein Toast für Zustände, die der Player schon anzeigt (läuft/pausiert). `at-info`-Icon ist im Dark-Theme dunkel (2.3:1, Quellwert) — für neue Info-Toasts `at-info-text` erwägen.

Statische Vorschau (hand-written from `src/components/ToastContainer.vue`, `src/styles/components/toast.css`); Container hier `position: static`, Countdown eingefroren.
