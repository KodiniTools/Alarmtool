Alarmtool ist der Online-Alarmton-Generator von KodiniTools: zwölf Oszillatoren, globaler Filter, ADSR, Rhythmusmuster, Live-Recorder — als reine Browser-App. Die Oberfläche ist **Navy & Gold**: tiefes Marineblau als Grund, warmes Gold als einzige Markenfarbe, cremefarbene Schrift. Alles sitzt auf halbtransparenten „Glas"-Flächen mit weichem Blur. Das System beschreibt genau, was `src/styles/` der App definiert — keine Ergänzungen.

## Inhalt und Tonalität

- **Sprache:** Deutsch zuerst, Englisch als zweite Locale (`src/i18n/translations.js`). Jede UI-Zeichenkette existiert in beiden Sprachen; Layouts müssen beide Längen vertragen (die Player-Bar misst ihre Höhe deshalb zur Laufzeit).
- **Anrede:** Du-Form, kurz, technisch, direkt. Beispiele aus der App: „Reduziere die Lautstärke, bevor du abspielst — besonders mit Kopfhörern.", „Steuerung: Leertaste = Play/Pause | Esc = Stop | M = Mute | L = Loop".
- **Casing:** Satzschreibung für Labels und Buttons („Aufnahme starten", „Verstanden"); VERSALIEN nur für Eyebrows (`eyebrow`, `menu-label`, `status-label`) und Wellenform-Kürzel (SIN, SQR, SAW, TRI, PLS, ORG).
- **Fachbegriffe bleiben Fachbegriffe:** Hz, Q-Faktor, Attack/Decay/Sustain/Release, Tiefpass/Hochpass/Bandpass/Notch, Pan. Nicht umschreiben.
- **Keine Emojis in der Oberfläche.** Symbole kommen aus Font Awesome; Emojis gibt es nur in Repo-Dokumentation.
- **Status wird benannt, nicht nur gefärbt:** „Bereit / Läuft / Pausiert" steht neben dem Statuspunkt; Toasts tragen Icon und Text.

## Farbe

Zwei Themes, Dark ist Standard (`:root`), Light liegt auf `[data-theme='light']`. Umschalten animiert Hintergrund, Text, Rahmen und Schatten über `at-speed-slow`.

- **Grund:** Der `body` zeigt den 145°-Verlauf aus `at-bg` → `at-surface` → `at-panel` (Light: `at-bg` → Weiß → `at-elev` → `at-text-dim`). Flächen darüber sind *Alpha-Tints* der Grundfarben, nie deckend: `.section` = `at-surface` bei 85 % mit `backdrop-filter: blur(12px)`, Player-Shell 60 %, Preset-Karten 50 %, FAQ-Items und Inputs 40 %.
- **Text:** `at-text` für alles Primäre, `at-text-dim` für Hilfetexte und Beschreibungen, `at-muted` für Eyebrows, Meta und ruhende Icons. Info-Text (Untertitel, Tab-Labels, FAQ-Antworten) steht in `at-info-text`, **nie** in `at-info` — das dunkle Blau ist nur Füllfarbe.
- **Gold ist die Marke:** `at-primary` füllt aktive Tabs, den aktiven Play-Button, Slider-Daumen, Fortschrittsbalken und die 3-px-Linie oben auf jeder `.section` (Verlauf `at-primary` → `at-text`). Als Wash (`at-primary-tint`, 6–15 %) markiert es Hover, ausgewählte Zeilen, Icon-Kacheln, Badges und Chips. Auf Gold steht immer `at-primary-fg`.
- **Signalfarben:** `at-success` = läuft / Aufnahme / Erfolg, `at-danger` = Stop, Verwerfen, Gehörschutz, Fehler, `at-warning` (= Gold) = pausiert / Warnung, `at-info` (Füllung) / `at-info-text` (Text) = neutral-informativ. Die sechs Wellenformen haben feste Chip-Farben: SIN `at-success`, SQR `at-primary`, SAW `at-danger`, TRI `at-info-text`, PLS `at-wave-pulse`, ORG `at-wave-organ`.
- **Light-Theme-Regel:** Wo Dark Gold-Washes nutzt, nutzt Light oft Blau-Washes (`rgba(1,79,153,…)`): Preset-Tags, Preset-Play, Zeilen-Hover, Fokus-Halo. Gold bleibt für Füllungen (aktiver Tab, Primary-Button).
- **Kontrast-Hinweise (Quellwerte, unverändert):** Im Light-Theme erreicht `at-primary` als Text nur 2.3:1 auf `at-bg` (Preset-Banner, Track-Name, SQR-Chip) und `at-success`/`at-danger` als Text 1.8:1 / 2.8:1; `at-primary-fg` auf `at-primary` liegt bei 4.4:1. Im Dark-Theme fällt `at-on-danger` (Weiß) auf `at-danger` mit 3.1:1 durch und `at-muted` auf `at-elev` mit 3.9:1. Neue Oberflächen: Gold im Light-Theme nur als Füllung oder ≥ 24 px einsetzen, Text auf Rot in `at-on-danger-deep`.

## Typografie

- **Eine Schrift, ein Schnitt:** Supreme Regular (400) per `@font-face` aus `/fonts/Supreme-Regular.woff2`, dahinter `ui-sans-serif, system-ui, …`. Alle 500/600/700-Gewichte des Systems sind Browser-Synthese — Headlines deshalb nie über 700 setzen und auf Fallback-Fonts (Segoe UI, Roboto) prüfen. Die Schriftdatei liegt nicht im Repo (Host-Root); dieses System trägt keine Fontdatei.
- **Hierarchie über Größe und Tracking, kaum über Gewicht:** `app-title` 2 rem / 500, `h2` 1.75 rem / 600 mit 60-px-Goldunterstrich, `h2-narrow` 1.1 rem in schmalen Sektionen, `editor-title` 1.05 rem, `sidebar-title` 1 rem / 700. Headings tragen `letter-spacing: 0.02em` und im Dark-Theme einen 1-px-Textschatten.
- **Lauftext** 1 rem `body`; UI-Texte liegen zwischen 0.78 und 0.9 rem (`input`, `label`, `button`, `faq-question`); Hilfe `small-text` 0.8 rem in `at-text-dim`.
- **Eyebrows** (`eyebrow`, `menu-label`, `status-label`) sind 0.62–0.72 rem, 600–700, VERSALIEN, Tracking 0.06–0.08 em, `at-muted` mit goldenem Icon.
- **Zahlen:** Zeitanzeige in `time-display` (Mono, Tracking 0.04 em); Werte-Pills im Editor und `volume-pct` mit `font-variant-numeric: tabular-nums`.
- **Mobil:** Inputs ≤ 768 px auf 16 px (verhindert iOS-Zoom); Titel 1.5 → 1.3 rem; Tab-Labels ≤ 480 px ausgeblendet.

## Abstand, Form, Fläche

- **Skala** `space-1` … `space-8` (4–32 px, kein `space-7`). `space-2` ist der Standard-Inline-Abstand, `space-4` der Block-Abstand (Formgruppen, Karten-Padding), `space-6` das Sektions-Padding. Button-Paddings bleiben bewusst außerhalb der Skala (0.55 rem 1.1 rem; `btn-sm` 0.35 rem 0.7 rem; Pills 0.4 rem 0.9 rem).
- **Radien, drei Stufen plus Pill:** `at-radius` 12 px für Container (Sektion, Editor, Collapsible, Player, Tab-Leiste), `at-radius-sm` 8 px für Buttons in Gruppen (Tabs, Wellenform-, Verlaufs-, Aux-Buttons), `at-radius-xs` 6 px für Buttons, Inputs, Zeilen und Icon-Kacheln. Karten, Toasts und FAQ nutzen literal `radius-card` 10 px; Tags, Preset-Play und Gehörschutz-Button `radius-pill` 20 px; Badges 999 px; Chips `radius-chip` 4 px. Punkte und Slider-Daumen sind Kreise.
- **Rahmen statt Kanten:** Jede Fläche hat einen 1-px-Hairline aus `at-muted`-Tint (`at-hairline`, 8–25 %); Light-Theme nutzt Navy-Tints. Aktive Zustände verstärken den Rahmen zu `at-primary` (Wellenform-Button, Preset-Karte mit zusätzlichem 1-px-Ring).
- **Schatten sind navyfarben und weich:** `at-shadow-1` für Editor, `at-shadow-2` für Toasts, `shadow-section` für Sektionen, `shadow-player-bar` nach oben. Hover hebt um 1 px (`translateY(-1px)`) mit `shadow-hover`.
- **Glas:** `.section`, `.player-bar`, Toasts und die Gehörschutz-Warnung nutzen `backdrop-filter: blur(8–16px)` über Alpha-Grund.

## Zustände

- **Hover:** Gold-Wash (`at-primary-tint`) als Grund, Text zu `at-text`, 1 px Lift. Buttons zeigen zusätzlich einen Lichtstreifen (`::before`, 0.4 s).
- **Aktiv/ausgewählt:** Goldfüllung mit `at-primary-fg` (Tab, Play, Preset-Play) **oder** Gold-Wash 10–15 % mit `at-primary`-Text und -Rahmen (Wellenform-Button, Aux-Button, Listenzeile mit 3-px-Goldbalken links).
- **Fokus:** Buttons und Menüpunkte `outline: 2px solid at-primary` (Offset 2 px, in Listen −2 px). Inputs: Rahmen `at-primary` (Light: `at-info`) plus `shadow-focus`-Halo, kein Outline.
- **Deaktiviert:** nur Opazität, keine Farbänderung — `opacity-disabled-button` 0.45, Controls 0.4, Transport 0.35, Zeilen 0.55, ganzer Editor 0.65; `cursor: not-allowed`, kein Lift.
- **Läuft:** Statuspunkt `at-success` pulsiert (`duration-pulse`), Label grün; pausiert gelb/gold; gestoppt `at-muted`.

## Bewegung

`at-speed` 200 ms für alles Kleine (Hover, Chevron, Daumen), `at-speed-slow` 300 ms für Theme-Wechsel und das Aufklappen (`grid-template-rows: 0fr → 1fr`, ohne Höhenmessung). Toasts gleiten von rechts (`duration-toast`, mobil von unten). `prefers-reduced-motion` schaltet Collapsible- und Chevron-Transitions ab — neue Animationen daran anschließen.

## Ikonografie

- **Font Awesome 6 Solid** (`<i class="fas fa-…">`), lokal vom Host unter `/fontawesome/` geladen — nicht im Repo. Feste Zuordnung: Tabs `fa-filter`, `fa-wave-square`, `fa-microphone`, `fa-music`, `fa-question-circle`, `fa-blog`; Transport `fa-play` / `fa-pause` / `fa-stop`; Loop `fa-repeat`; Lautstärke `fa-volume-mute|down|up`; Toasts `fa-check-circle`, `fa-exclamation-circle`, `fa-exclamation-triangle`, `fa-info-circle`; Gehörschutz `fa-volume-high`; Speichern `fa-save`; Presets `fa-truck-medical`, `fa-industry` u. a.
- **Eigene Glyphen** liegen unter `assets/Icons/`: die sechs Wellenformen (40×20, Strich 1.5, `currentColor`) und Undo/Redo (24×24, Strich 2). Inline einsetzen, damit sie die Textfarbe erben.
- **Icon-Kacheln:** 26–28 px, `at-radius-xs`, Gold-Wash 12–14 %, Icon in `at-primary` (Collapsible-Header, Speichermenü); Preset-Icon 44 px bei `radius-card`.
- Die Vorschauen dieses Systems ersetzen Font-Awesome-Glyphen durch einfache Inline-SVG-Platzhalter, da die Schrift nicht geladen werden kann.

## Layout

- Container `max-width: 1400px`, Body-Padding `space-5`; schmale Tabs (Filter, Aufnahme, Presets, FAQ) auf `.section-narrow` 720 px; Tab-Leiste 720 px; Player-Bar und Gehörschutz-Warnung innen 960 px.
- Oszillatoren als Master-Detail: Sidebar 280 px (≤ 900 px: 240 px, ≤ 640 px: gestapelt) neben dem Editor; Parameter in zwei Spalten (`osc-params-grid`, Gap `space-2` × `space-6`), ≤ 640 px eine Spalte.
- Die Player-Bar ist `position: fixed` unten (`z-player-bar`), reserviert ihre gemessene Höhe als `--player-bar-height` und respektiert `safe-area-inset-bottom`; die Gehörschutz-Warnung hängt direkt darüber (`z-hearing-warning`), Toasts oben rechts (`z-toast`, mobil unten).
- Breakpoints: 900, 768, 640, 560, 520, 480, 420 px — jeweils Komponenten-lokal, keine globale Rasterdefinition.

## Nicht synchronisiert

- **Fonts:** `Supreme-Regular.woff2` wird vom Server-Root geladen und liegt nicht im Repo — `type.fonts` ist leer, Vorschauen fallen auf `system-ui` zurück.
- **Logo/Marke:** Kein Logo, Favicon oder OG-Bild im Repo (Host liefert `/favicon.ico`, `og-image.png`); der Name steht in reiner Schrift.
- **Font Awesome:** vom Host geladen, nicht enthalten.
- **Nicht als Token abbildbar:** `--at-gradient` (Verlauf) und `--at-border` (Composite) liegen in `components/bundle.css`; `--at-font-sans` wird dort auf `--font-sans` gemappt.
- **Lücke im Quellcode:** `.toggle-switch` / `.toggle-slider` werden in `OscillatorItem.vue` verwendet, haben aber keine Stilregeln (nur einen Transition-Eintrag in `base.css`) — der Schalter rendert als nackte Checkbox.
- **Komponenten:** statische Vorschauen (Route „Read-only": Markup mit den Klassen aus `bundle.css`, kein Build ausgeführt, kein `bundle.js`). Token-Notizen in `tokens.json` sind englisch wie die Quellkommentare.
