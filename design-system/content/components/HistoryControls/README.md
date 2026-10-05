# HistoryControls

Die Undo/Redo-Leiste oben in der Sidebar: zwei goldgerahmte Buttons mit eigener Pfeil-Glyphe, Schrittzähler als Eck-Badge und einer Zeile, die den letzten Schritt benennt.

**Aufbau (Quelle `HistoryControls.vue`, `sidebar.css`, `historyLabel.js`):**
- `.history` — Spalte, Gap `space-2`; `role="toolbar"` mit `aria-label`.
- `.history-buttons` — zweispaltiges Grid, Gap `space-2`.
- `.history-btn` — 0.5 rem Padding, `at-radius-sm`, Gold 10 % mit Rahmen Gold 35 % (Light: Weiß mit Navy 18 %), Text `history-button` 0.76 rem / 600 in `at-text`. Hover Gold 20 % + Rahmen `at-primary`; aktiv 1 px nach unten; Fokus 2 px `at-primary` Offset 2; `disabled` 0.4.
- `.history-icon` — 16 px, `stroke: currentColor`, Strich 2 (Pfade unter `assets/Icons/history-*.svg`).
- `.history-count` — absolut −7 px oben rechts, 999-px-Pill `at-primary` / `at-primary-fg`, `history-count` 0.62 rem / 700, Ring 2 px in `at-bg`; nur sichtbar, wenn es Schritte gibt.
- `.history-caption` — 0.7 rem `at-muted`, Ellipsis, `aria-live="polite"`; `.history-caption-key` fett („Zuletzt:").

**Der Konsument liefert:** `canUndo`/`canRedo`, Zähler, den beschreibenden Text des nächsten Schritts (`describeHistoryAction`) und die Handler. Tastenkürzel liegen im Composable `useUndoRedo`.

**Dos/Don'ts:** Beide Buttons immer zusammen zeigen, auch wenn einer deaktiviert ist. Label nicht abkürzen — Ellipsis übernimmt das. Keine dritte Aktion (z. B. „Verlauf löschen") in dieser Leiste.

Statische Vorschau (hand-written from `src/components/oscillator/HistoryControls.vue`, `src/styles/components/sidebar.css`).
