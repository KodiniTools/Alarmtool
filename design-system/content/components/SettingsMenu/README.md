# SettingsMenu

Das Speicheroptionen-Menü: Gruppen mit VERSAL-Eyebrow in `ds-text-3`, darunter Zeilen aus Icon-Kachel (`ds-accent-soft`), Name und einzeiliger Beschreibung; Hover `ds-surface-3`.

**Aufbau (Quelle `SettingsPanel.vue`, `settings.css`):**
- `.settings-menu` — Spalte, Gap und Padding 8 px; lebt im Körper einer `CollapsibleSection`.
- `.settings-menu-group` — Spalte mit 2 px Gap; ab der zweiten Gruppe 8 px oben und eine Trennlinie `ds-border`. `role="group"` mit `aria-label`.
- `.settings-menu-label` — `eyebrow` 12 px / 600, VERSALIEN, Tracking 0.06 em, `ds-text-3`.
- `.settings-menu-item` — `<button>` volle Breite, Padding 8 px, Gap 12 px, `ds-radius-sm`; Hover `ds-surface-3`, aktiv `ds-surface-2`, Fokus `ds-focus-ring`.
- `.settings-menu-icon` — 28-px-Kachel, `ds-radius-sm`, `ds-accent-soft`, Icon `ds-accent` 13 px. `.settings-menu-name` 13 px / 600, `.settings-menu-desc` 12 px `ds-text-3`.
- `.settings-import-input` — visuell verstecktes `<input type="file">` für den Import.

**Der Konsument liefert:** Gruppen `{ labelKey, items[] }` mit `{ nameKey, descKey, icon, run }`. Aktionen der App: Speichern/Laden (LocalStorage), Exportieren/Importieren (JSON), Zurücksetzen.

**Dos/Don'ts:** Beschreibung maximal eine Zeile. Destruktive Einträge (Zurücksetzen) als eigene letzte Gruppe, nicht rot eingefärbt — die Bestätigung kommt per Toast. Keine Checkboxen oder Schalter im Menü.

Statische Vorschau (hand-written from `src/components/SettingsPanel.vue`, `src/styles/components/settings.css`).
