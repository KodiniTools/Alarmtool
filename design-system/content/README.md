Alarmtool ist der Online-Alarmton-Generator von KodiniTools: zwölf Oszillatoren, globaler Filter, ADSR, Rhythmusmuster, Live-Recorder — als reine Browser-App. Die Oberfläche läuft auf den **KodiniTools-Tokens v2**, die sie mit dem Collage Maker und dem Playlist Generator teilt: flache Flächen in vier Stufen, Text in drei Stufen, ein einziger Akzent (Gold), 1-px-Rahmen, drei Radien, 150 ms Motion. Keine Gradients, kein Blur, keine Kartenschatten, keine Hover-Lifts. Die Werte werden im Collage Maker gepflegt (`src/design-system/tokens-v2.css`) und nach `src/styles/tokens.css` übernommen.

## Inhalt und Tonalität

- **Sprache:** Deutsch zuerst, Englisch als zweite Locale (`src/i18n/translations.js`). Jede UI-Zeichenkette existiert in beiden Sprachen; Layouts müssen beide Längen vertragen (die Player-Bar misst ihre Höhe deshalb zur Laufzeit).
- **Anrede:** Du-Form, kurz, technisch, direkt. Beispiele aus der App: „Reduziere die Lautstärke, bevor du abspielst — besonders mit Kopfhörern.", „Steuerung: Leertaste = Play/Pause | Esc = Stop | M = Mute | L = Loop".
- **Casing:** Satzschreibung für Labels und Buttons („Aufnahme starten", „Verstanden"); VERSALIEN nur für Eyebrows (`eyebrow`) und Wellenform-Kürzel (SIN, SQR, SAW, TRI, PLS, ORG).
- **Fachbegriffe bleiben Fachbegriffe:** Hz, Q-Faktor, Attack/Decay/Sustain/Release, Tiefpass/Hochpass/Bandpass/Notch, Pan.
- **Keine Emojis in der Oberfläche.** Symbole kommen aus Font Awesome; Emojis gibt es nur in Repo-Dokumentation.
- **Status wird benannt, nicht nur gefärbt:** „Bereit / Läuft / Pausiert" steht neben dem Statuspunkt; Toasts tragen Icon und Text; Wellenform-Chips tragen das Kürzel.

## Farbe

Zwei Themes, Dark ist Standard (`:root`), Light liegt auf `html[data-theme='light']` und wird von der SSI-Navigation oder dem Pre-Paint-Skript in `index.html` gesetzt. Alle Variablen wechseln mit dem Theme; Komponenten kennen keine festen Farbwerte.

- **Vier Flächen, flach und deckend:** `ds-surface-0` ist die Seite, `ds-surface-1` jedes Panel (`.section`, Editor, Collapsible, Karten, Player-Bar, Toasts), `ds-surface-2` alles Eingebbare oder Chip-artige (Inputs, Sekundär-Buttons, Wellenform-Buttons, Tags, Zähler), `ds-surface-3` der Hover auf Zeilen, Menüpunkten und Sekundär-Buttons. Flächen werden durch `ds-border` getrennt, nie durch Schatten oder Transparenz.
- **Drei Textstufen:** `ds-text` für Überschriften, Buttons, Eingaben und Zeilennamen; `ds-text-2` für Labels, Untertitel, Beschreibungen, FAQ-Antworten und ruhende Icon-Buttons; `ds-text-3` für Eyebrows, Meta, Platzhalter, Hilfetexte und Chevrons. Alle drei erreichen auf `ds-surface-0` bis `ds-surface-2` mindestens 4.6:1 in beiden Themes.
- **Gold ist die einzige Aktionsfarbe.** `ds-accent` als Vollfläche nur für die Primäraktion (`.btn-primary`, `.btn-success`), den aktiven Play-Button, das aktive Preset-Play und den Verlaufszähler — eine Goldfläche pro Ansicht. Darauf steht immer `ds-on-accent`. Als Markierung: Slider-Daumen, Fortschrittsbalken, Fokus-Ring, Auswahlrahmen, der 3-px-Balken der gewählten Zeile, kleine Icon-Akzente neben Text.
- **Auswahl und aktive Fläche:** `ds-accent-soft` als Grund plus `ds-accent` als Rahmen — gewählte Listenzeile, aktiver Wellenform-Button, Preset-Banner, aktive Preset-Karte. Icon-Kacheln in Sidebar und Speichermenü nutzen denselben Wash.
- **Status:** `ds-success` = läuft / Erfolg, `ds-warning` = pausiert / Warnung, `ds-danger` = Stop, Verwerfen, Gehörschutz, Fehler, `ds-info` = neutral. Status erscheint als Text, Icon, Statuspunkt oder 3-px-Kante links an Toast und Gehörschutz-Hinweis — nie als Button-Füllung. Destruktive Buttons sind `ds-danger`-Text auf flacher Fläche.
- **Wellenformen** haben feste Chip-Inks auf `ds-surface-2`: SIN `ds-success`, SQR `ds-accent`, SAW `ds-danger`, TRI `ds-info`, PLS `ds-warning`, ORG `ds-text-2`.
- **Kontrast-Hinweise (Quellwerte, unverändert):** Im Light-Theme erreicht `ds-accent` als Text oder Icon nur 2.6:1 auf `ds-surface-1` — Gold dort nur als Füllung oder neben Text einsetzen (SQR-Chip, Icon-Akzente sind davon betroffen). `ds-warning` und `ds-danger` liegen als 12-px-Chip auf `ds-surface-2` im Light-Theme bei 4.3:1.

## Typografie

- **Eine Schrift, drei echte Schnitte:** Supreme 400, 500 und 700 liegen im Repo (`src/assets/fonts/`) und werden gebündelt; `ds-font-sans` fällt auf `sans-serif` zurück. Gewicht 600 (`ds-weight-semibold`) wird aus 700 synthetisiert — Panel-Titel und Chips nutzen es trotzdem, wie im Collage Maker. Mono (`ds-font-mono`) nur für die Zeitanzeige.
- **Sieben Stufen:** 12 `xs` (Chips, Meta, Eyebrows) · 13 `sm` (Labels, Hilfe, Beschreibungen, kleine Buttons, Tabs) · 14 `md` (Buttons, Felder, Fragen, Preset-Namen) · 16 `lg` (Body, Panel-Titel) · 20 `xl` (Abschnittstitel) · 24 `2xl` (Seitentitel `page-title`) · 32 `3xl` (Hero, in der App nur das Platzhalter-Icon). Zeilenhöhe 1.5, ab 24 px 1.25 mit Tracking −0.01 em.
- **Hierarchie über Größe und Gewicht:** `page-title` 24/700, `panel-title` 16/600 mit Trennlinie darunter, `button` 14/500 (Primär 600), `label` 13/500 in `ds-text-2`, `eyebrow` 12/600 VERSALIEN in `ds-text-3`. Keine Textschatten, kein Tracking über 0.06 em.
- **Zahlen:** Zeit in `time-display` (Mono); Zahlfelder, Zähler und Prozent mit `font-variant-numeric: tabular-nums`.
- **Mobil:** Eingaben ≤ 768 px auf 16 px (verhindert iOS-Zoom); Seitentitel 20 px; Tab-Labels ≤ 480 px ausgeblendet (nur Icons).

## Abstand, Form, Fläche

- **4er-Raster** `ds-space-1` … `ds-space-16`. `ds-space-2` ist der Inline-Gap (Icon zu Text, Zeilen), `ds-space-3` das Kopfzeilen-Padding, `ds-space-4` das Button- und Karten-Padding, `ds-space-5` das Panel-Padding, `ds-gap` (20 px) der Abstand zwischen Panels. Innenabstände von Segment-Controls sind 2 px.
- **Control-Höhen:** `ds-control-sm` 28 (kleine Buttons, Pills, Icon-Kacheln) · `ds-control-md` 36 (Buttons, Selects, Icon-Buttons, Tab-Leiste, Transport-Gruppe) · `ds-control-lg` 40 (Textfelder). Listenzeilen und Kopfzeilen mindestens 44 px.
- **Drei Radien plus Pill:** `ds-radius-sm` 6 für Controls, Chips und Segmente (Tabs, Transport, Zeilen, Menüpunkte, `.btn-sm`), `ds-radius-md` 10 für Felder, Buttons und Karten (Inputs, `.btn`, Wellenform-Buttons, Preset-Karten, FAQ, Toasts, Collapsible), `ds-radius-lg` 16 für Panels (`.section`, Editor, Player-Shell), `ds-radius-full` für Tags, Preset-Play, Badges, Slider- und Toggle-Spuren. Kreise nur für Punkte, Daumen und Toggle-Knopf.
- **Ein Rahmen:** 1 px `ds-border` um jede Fläche; Felder und Sekundär-Buttons tragen `ds-border-strong`. Hover auf Karten wechselt den Rahmen zu `ds-border-strong`, auf Wellenform-Buttons zu `ds-accent`.
- **Schatten nur für Overlays:** `ds-shadow-overlay` auf Player-Bar, Toasts und Gehörschutz-Hinweis. Panels, Karten und Buttons bleiben flach. Keine Gradients, kein `backdrop-filter`.

## Zustände

- **Hover** ändert nur Farbe, nie Größe oder Position: Sekundär-Buttons und Zeilen zu `ds-surface-3`, Primär zu `ds-accent-hover`, Karten-Rahmen zu `ds-border-strong`, Textbuttons (Tabs, Transport, Chevrons) zu `ds-text`.
- **Aktiv / gewählt:** entweder Goldfüllung mit `ds-on-accent` (Play, Preset-Play, Primär) oder `ds-accent-soft` plus `ds-accent`-Rahmen (Wellenform, Preset-Karte, Zeile). Segment-Controls (Tabs, Transport) zeigen die aktive Option als `ds-surface-1` mit `ds-border-strong`; der Play-Button als einzige Ausnahme in Gold. Umschalter (Loop, Mute) zeigen „an" über `ds-accent`-Rahmen und -Text.
- **Fokus:** immer `ds-focus-ring` als `box-shadow` (2 px Abstand in `ds-surface-0`, 2 px `ds-accent`), `outline: none`. Inputs färben zusätzlich den Rahmen `ds-accent`. In Listen und Kopfzeilen `inset`.
- **Deaktiviert:** nur Opazität, keine Farbänderung — Buttons und Controls 0.45, Felder 0.6, Zeilen 0.55, ganzer Editor 0.65; `cursor: not-allowed`.
- **Läuft / pausiert / bereit:** Statuspunkt in `ds-success` (pulsierend), `ds-warning`, `ds-text-3`; Label in derselben Farbe.

## Bewegung

`ds-duration` 150 ms für Hover, Fokus, Chevron, Toggle; `ds-duration-slow` 250 ms für Theme-Wechsel, Aufklappen (`grid-template-rows: 0fr → 1fr`), Toast- und Hinweis-Einblendung (16 px seitlich bzw. 8 px von unten). Easing immer `ds-ease`. `prefers-reduced-motion` setzt alle Transitions und Animationen global auf 0.01 ms.

## Ikonografie

- **Font Awesome 6 Solid** (`<i class="fas fa-…">`), vom Host unter `/fontawesome/` geladen — nicht im Repo. Zuordnung: Tabs `fa-filter`, `fa-wave-square`, `fa-microphone`, `fa-music`, `fa-question-circle`, `fa-blog`; Transport `fa-play` / `fa-pause` / `fa-stop`; Loop `fa-repeat`; Lautstärke `fa-volume-mute|down|up`; Toasts `fa-check-circle`, `fa-exclamation-circle`, `fa-exclamation-triangle`, `fa-info-circle`; Gehörschutz `fa-volume-high`; Speichern `fa-save`.
- **Eigene Glyphen** unter `assets/Icons/`: die sechs Wellenformen (40×20, Strich 1.5, `currentColor`) und Undo/Redo (24×24, Strich `ds-icon-stroke` 1.75, Lucide-Stil). Inline einsetzen, damit sie die Textfarbe erben.
- **Größen:** `ds-icon-sm` 16 in Buttons, Zeilen und Toasts; `ds-icon-md` 20 freistehend (Preset-Kachel, Gehörschutz). Icon-Kacheln 28 px (`ds-control-sm`) in `ds-accent-soft` mit `ds-accent`-Icon; Preset-Kachel 40 px in `ds-surface-2`.
- Die Vorschauen dieses Systems ersetzen Font-Awesome-Glyphen durch einfache Inline-SVG-Platzhalter.

## Layout

- Container `ds-container` 1200 px, Body-Padding `ds-space-5`; schmale Tabs (Filter, Aufnahme, Presets, FAQ) auf `.section-narrow` 720 px; Tab-Leiste 720 px; Player-Bar und Gehörschutz-Hinweis innen 960 px.
- Jede Ansicht ist ein Panel (`.section`) mit Panel-Titel und Trennlinie; Oszillatoren als Master-Detail: Sidebar 280 px (≤ 900 px: 240 px, ≤ 640 px: gestapelt) neben dem Editor-Panel, Parameter in zwei Spalten, ≤ 640 px eine.
- Die Player-Bar ist `position: fixed` unten (`ds-z-player`), reserviert ihre gemessene Höhe als `--player-bar-height`; der Gehörschutz-Hinweis hängt direkt darüber; Toasts oben rechts (`ds-z-toast`), mobil über der Player-Bar — anders als im Collage Maker (unten rechts), weil dort kein Player liegt.
- Breakpoints: 900, 768, 640, 560, 520, 480, 420 px — komponenten-lokal; die Token-Breakpoints 480/768/1024 gelten für neue Media Queries.

## Nicht synchronisiert

- **Font Awesome, Favicon, OG-Bild** liegen auf dem Host, nicht im Repo.
- **Tokens:** Quelle ist der Collage Maker (`src/design-system/tokens-v2.css`, Stand 9dc4eca); `src/styles/tokens.css` ist die Kopie. Lokal ergänzt: `@font-face` für Supreme und `color-scheme`.
- **Nicht als Token abbildbar:** `ds-focus-ring` (Composite mit `var()`), `ds-ease` und die Typo-Skala (`ds-text-*`, `ds-weight-*`, `ds-leading*`, `ds-tracking-*`) liegen in `components/bundle.css`.
- **Komponenten:** statische Vorschauen (Markup mit den Klassen aus `bundle.css`, kein `bundle.js`). Die Collage-Maker-Primitives (`UiButton`, `UiPanel`, `UiSegmentedControl`, …) sind nicht übernommen; die Alarmtool-Klassen bilden sie als CSS nach.
