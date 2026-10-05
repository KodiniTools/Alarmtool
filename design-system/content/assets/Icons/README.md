# Icons

Die acht eigenen Glyphen des Alarmtools, als Pfade aus dem Code kopiert (`src/lib/waveforms.js`, `src/components/oscillator/HistoryControls.vue`).

- **wave-sine … wave-organ** (40×20): die sechs Wellenformen SIN · SQR · SAW · TRI · PLS · ORG. In der App werden sie inline mit `stroke="currentColor"`, Strichstärke 1.5 und runden Enden gezeichnet; die Farbe folgt dem Text (`at-muted` ruhend, `at-primary` aktiv).
- **history-undo / history-redo** (24×24): Rückgängig/Wiederholen, Strichstärke 2.

Tinte: Die Dateien tragen `#7a8da0` (`at-muted`, Dark-Wert), weil `<img>` keine Farbe erbt. Für einen aktiven Zustand den Pfad inline einsetzen und `stroke="currentColor"` mit `at-primary` färben.

Alle übrigen Symbole der App (Play, Pause, Stop, Mikrofon, Filter, Zahnrad, Chevrons, Toast-Icons) kommen aus **Font Awesome 6 Solid** (`fas fa-…`), das die Host-Seite unter `/fontawesome/` ausliefert — nicht Teil des Repos und nicht in diesem System enthalten.
