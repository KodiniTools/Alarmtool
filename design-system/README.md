# Design System – Producer

Dieser Ordner erzeugt die Dateien des **Alarmtool Design Systems** (Claude-Artifact vom Typ „Design System", Link in `system.json`) aus dem echten Quellcode der App. Ein Befehl baut den kompletten Artifact-Ordner nach `design-system/dist/project/`; daraus wird das Artifact aktualisiert.

```bash
npm run design-system          # baut design-system/dist/
npm run design-system:check    # baut und bricht ab, wenn etwas unvollständig ist (für CI)
```

Keine zusätzlichen Abhängigkeiten – nur Node ≥ 18 und `git` (für den Commit-Hash).

## Was woher kommt

| Datei im Artifact | Quelle | erzeugt oder handgeschrieben |
| --- | --- | --- |
| `tokens.json` | `src/styles/tokens.css` (Werte) + `content/tokens.notes.json` (Notizen, abgeleitete Tokens, Textstile) | erzeugt |
| `components/bundle.css` | alle `@import`s aus `src/styles/main.css` außer `tokens.css`, unverändert, plus Prelude für `--at-font-sans`, `--at-gradient`, `--at-border` | erzeugt |
| `assets/Icons/*.svg` | `src/lib/waveforms.js` (`WAVE_TYPES[].svgPath`), `HistoryControls.vue` (`.history-icon`) | erzeugt |
| `design-system.json` (Index) | `system.json` + `assets.lock.json` | erzeugt |
| `README.md`, `components/*/README.md`, `components/*/preview.html`, `assets/Icons/README.md` | `content/` | handgeschrieben, 1:1 kopiert |
| `publish.json` (neben `project/`) | Build | Liste der zu sendenden Dateien und Assets |

**Regel:** Werte kommen immer aus dem Code, Texte immer aus `content/`. Ändert sich eine CSS-Variable, ändert sich `tokens.json` beim nächsten Build von selbst. Kommt eine neue Variable dazu, braucht sie eine Notiz in `content/tokens.notes.json` – `--check` schlägt sonst fehl. Literalwerte aus Komponenten-CSS (Hover-Töne, Hairlines, Radien wie 10 px) stehen als `extra`-Einträge in den Notizen und müssen von Hand nachgezogen werden.

## Ordner

```
design-system/
├── build.mjs            CLI
├── lib.mjs              reine Funktionen (Parser, Builder) – getestet in tests/designSystem.spec.js
├── system.json          Artifact-URL, Titel, Themes, Quellpfade, Komponenten-Liste
├── assets.lock.json     Blob-IDs der hochgeladenen Icons (+ SHA-256 des Inhalts)
├── content/             Brand Book, Komponenten-Docs und -Vorschauen, Token-Notizen
└── dist/                Build-Ausgabe (ignoriert)
```

### `content/tokens.notes.json`

Je Familie (`color`, `spacing`, `radius`, `shadow`, `duration`):

- `usage` – Verwendungsnotiz je CSS-Variable (Schlüssel = Variablenname ohne `--`).
- `extra` – zusätzliche Tokens mit `name`, `value`, `usage`, die nicht als Variable existieren (werden hinter den CSS-Tokens angehängt).
- `note` – optionaler Hinweis zur Familie.

Dazu `type` (Fonts, Mono-Stack, Textstile – der Sans-Stack kommt aus `--at-font-sans`), `zIndex` und `opacity` als komplette Familien.

### Vorschauen

`content/components/<Name>/preview.html` beginnt in Zeile 1 mit `<!-- @dsCard group="…" height=N -->` und nutzt die Klassen aus `bundle.css`. Die Seite lädt `tokens.css` (aus `tokens.json` kompiliert) und `bundle.css` vor. Font Awesome ist dort nicht verfügbar – Icons als Inline-SVG. `Cover/preview.html` ist das Titelbild; der Ordner bleibt ohne README.

## Artifact aktualisieren

Das Veröffentlichen übernimmt Claude (Claude Code oder claude.ai) mit dem Artifact-Werkzeug; CI kann nur bauen und prüfen. Ablauf in einer Claude-Session im Repo:

1. `npm run design-system` ausführen und `design-system/dist/publish.json` lesen.
2. Jedes Asset mit `status: "needs-upload"` als Asset zur Artifact-URL hochladen und in `assets.lock.json` `blob`, `size` (aus der Antwort) und `sha256` (aus `publish.json`) eintragen; dann erneut bauen.
3. Den Live-Index (`project/design-system.json`) lesen und die Schlüssel `assetGroups`, `title`, `libraries` sowie `lastChange` aus `dist/project/design-system.json` übernehmen; alle anderen Schlüssel (z. B. `sections`, `blobs`, `docs`, `createdOnFiles`) unverändert lassen.
4. Einen Publish-Aufruf an die URL aus `system.json` senden: `root` = `design-system/dist`, `file_path` = der zusammengeführte Index, `files` = die Einträge aus `publish.json › files` (SVGs sind Uploads, keine Dateien).

Kurzform als Auftrag an Claude: *„Design System aus `design-system/` neu bauen und das Artifact aktualisieren."*

## CI

Ein Workflow-Schritt `npm run design-system:check` stellt sicher, dass jede CSS-Variable eine Notiz hat, kein Wert unplatziert bleibt und `bundle.css` sauber ist. Veraltete Assets (Icon geändert, aber noch nicht hochgeladen) werden nur gewarnt. Läuft der Build in CI (`CI=1`), trägt `lastChange.via` das Präfix „CI ·", damit die Seite anzeigt, dass manuelle Änderungen überschrieben werden können.

## Bekannte Grenzen

- Schriftdatei (`/fonts/Supreme-Regular.woff2`), Font Awesome, Favicon und OG-Bild liegen auf dem Host, nicht im Repo – sie sind nicht Teil des Systems.
- `--at-gradient` und `--at-border` sind keine Tokens (Verlauf, Composite) und wandern in das Prelude von `bundle.css`; die Farbe aus `--at-border` wird als `at-border-color` abgeleitet.
- Komponenten sind statische Vorschauen auf Basis des Original-CSS; es gibt kein `bundle.js`.
