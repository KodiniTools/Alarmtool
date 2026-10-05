# HistoryControls

Die Undo/Redo-Leiste oben in der Sidebar: zwei Sekundär-Buttons mit eigener Pfeil-Glyphe, Schrittzähler als Eck-Badge in Gold und einer Zeile, die den letzten Schritt benennt.

**Aufbau (Quelle `HistoryControls.vue`, `sidebar.css`, `historyLabel.js`):**
- `.history` — Spalte, Gap 8 px; `role="toolbar"` mit `aria-label`.
- `.history-buttons` — zweispaltiges Grid, Gap 8 px.
- `.history-btn` — 36 px (`ds-control-md`), Padding 0 12 px, `ds-radius-md`, `ds-surface-2` mit `ds-border-strong`, Text 13 px / 500 in `ds-text`. Hover `ds-surface-3`; Fokus `ds-focus-ring`; `disabled` 0.45. Kein Lift.
- `.history-icon` — 16 px (`ds-icon-sm`), `stroke: currentColor`, Strich `ds-icon-stroke` 1.75 (Pfade unter `assets/Icons/history-*.svg`).
- `.history-count` — absolut −7 px oben rechts, 18-px-Pill `ds-accent` / `ds-on-accent`, 12 px / 600, Ring 2 px in `ds-surface-1`; nur sichtbar, wenn es Schritte gibt.
- `.history-caption` — 12 px `ds-text-3`, Ellipsis, `aria-live="polite"`; `.history-caption-key` halbfett („Zuletzt:").

**Der Konsument liefert:** `canUndo`/`canRedo`, Zähler, den beschreibenden Text des nächsten Schritts (`describeHistoryAction`) und die Handler. Tastenkürzel liegen im Composable `useUndoRedo`.

**Dos/Don'ts:** Beide Buttons immer zusammen zeigen, auch wenn einer deaktiviert ist. Label nicht abkürzen — Ellipsis übernimmt das. Keine dritte Aktion in dieser Leiste.

Statische Vorschau (hand-written from `src/components/oscillator/HistoryControls.vue`, `src/styles/components/sidebar.css`).
