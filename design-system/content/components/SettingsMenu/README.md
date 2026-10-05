# SettingsMenu

Das Speicheroptionen-Menü: Gruppen mit VERSAL-Eyebrow, darunter Zeilen aus Gold-Icon-Kachel, Name und einzeiliger Beschreibung.

**Aufbau (Quelle `SettingsPanel.vue`, `settings.css`):**
- `.settings-menu` — Spalte, Gap und Padding `space-2`; lebt im Körper einer `CollapsibleSection`.
- `.settings-menu-group` — Spalte mit 2 px Gap; ab der zweiten Gruppe `space-2` oben und ein `at-hairline` als Trenner. `role="group"` mit `aria-label`.
- `.settings-menu-label` — `menu-label` 0.62 rem / 700, VERSALIEN, Tracking 0.08 em, `at-muted`.
- `.settings-menu-item` — `<button>` volle Breite, `space-2` Padding, Gap `space-3`, `at-radius-xs`; Hover Gold 10 %, aktiv 16 %, Fokus 2 px `at-primary` innen.
- `.settings-menu-icon` — 28 px Kachel, Gold 12 %, Icon `at-primary` 0.78 rem. `.settings-menu-name` 0.8 rem / 600, `.settings-menu-desc` 0.68 rem `at-muted`.
- `.settings-import-input` — visuell verstecktes `<input type="file">` für den Import.

**Der Konsument liefert:** Gruppen `{ labelKey, items[] }` mit `{ nameKey, descKey, icon, run }`; die Komponente rendert und ruft `run` auf. Aktionen der App: Speichern/Laden (LocalStorage), Exportieren/Importieren (JSON), Zurücksetzen.

**Dos/Don'ts:** Beschreibung maximal eine Zeile. Destruktive Einträge (Zurücksetzen) als eigene letzte Gruppe, nicht rot eingefärbt — die Bestätigung kommt per Toast. Keine Checkboxen oder Schalter im Menü.

Statische Vorschau (hand-written from `src/components/SettingsPanel.vue`, `src/styles/components/settings.css`).
