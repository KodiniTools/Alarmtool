# Icons

Die acht eigenen Glyphen des Alarmtools, als Pfade aus dem Code kopiert (`src/lib/waveforms.js`, `src/components/oscillator/HistoryControls.vue`).

- **wave-sine … wave-organ** (40×20): die sechs Wellenformen SIN · SQR · SAW · TRI · PLS · ORG. In der App werden sie inline mit `stroke="currentColor"`, Strichstärke 1.5 und runden Enden gezeichnet; die Farbe folgt dem Text (`ds-text-2` ruhend, `ds-text` aktiv).
- **history-undo / history-redo** (24×24): Rückgängig/Wiederholen, Strichstärke `ds-icon-stroke` 1.75 (Lucide-Stil).

Tinte: Die Dateien tragen `#8593a8` (`ds-text-3`, Dark-Wert), weil `<img>` keine Farbe erbt. Inline einsetzen und `stroke="currentColor"` nutzen, damit Hover und Aktiv-Zustand die Farbe steuern.

Alle übrigen Symbole der App (Play, Pause, Stop, Mikrofon, Filter, Chevrons, Toast-Icons) kommen aus **Font Awesome 6 Solid** (`fas fa-…`), das die Host-Seite unter `/fontawesome/` ausliefert — nicht Teil des Repos und nicht in diesem System enthalten. Icon-Größen: `ds-icon-sm` 16 in Buttons und Zeilen, `ds-icon-md` 20 freistehend.
