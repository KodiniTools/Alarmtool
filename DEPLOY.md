# Deployment

Das Alarmtool wird per **Server-Pull-Skript** deployt: Der Server holt sich
den Stand von `main`, baut die SPA und synchronisiert das Ergebnis nach
`/var/www/kodinitools.com/alarmtool/`. GitHub braucht dafür **keinen** Zugriff
auf den Server (kein SSH-Key, keine Secrets).

## Einmalige Einrichtung auf dem Server

Voraussetzungen: `git`, `node`/`npm`, `rsync`, `flock`.

```bash
# Repo an einen festen Ort klonen (nicht in den Web-Ordner!)
sudo git clone https://github.com/KodiniTools/Alarmtool.git /opt/alarmtool
cd /opt/alarmtool

# Erstes Deploy manuell auslösen und testen
sudo ./deploy.sh --force
```

Danach sollte `/var/www/kodinitools.com/alarmtool/` `index.html` und `assets/`
enthalten.

## Automatisch per Cron

Alle 5 Minuten prüfen und nur bei neuer Version bauen:

```cron
*/5 * * * * /opt/alarmtool/deploy.sh >> /var/log/alarmtool-deploy.log 2>&1
```

(z. B. via `sudo crontab -e`). Das Skript ist idempotent – ohne neuen Commit
auf `main` tut es nichts.

## Manuell neu deployen

```bash
/opt/alarmtool/deploy.sh          # baut nur bei neuer Version
/opt/alarmtool/deploy.sh --force  # baut in jedem Fall neu
```

## Hinweise

- Der Ziel-Pfad und der Branch sind oben in `deploy.sh` konfigurierbar.
- `assets/` wird mit `--delete` synchronisiert (alte, gehashte Chunks werden
  entfernt); der Rest ohne `--delete`, damit manuell abgelegte Dateien wie
  `og-image.png` erhalten bleiben.
- `favicon.ico` liegt im Document-Root `/var/www/kodinitools.com/public` und
  wird vom Deploy nicht angefasst.

## Seiten und URLs

- `/alarmtool/` – Landing-Page (Vue Router, `src/views/LandingPage.vue`)
- `/alarmtool/app/` – das eigentliche Tool (`src/views/AppPage.vue`)

Der Build legt zusätzlich `dist/app/index.html` ab (Kopie der `index.html` mit
Canonical/Titel der App-Seite, siehe `localizedPageCopies()` in `vite.config.js`). Dadurch
funktionieren Neuladen und Direktaufruf von `/alarmtool/app/` ohne Rewrite-Regel im
Webserver, und die SSI-Includes werden wie auf der Startseite verarbeitet. `deploy.sh`
kopiert den Ordner mit dem restlichen Build-Output (`rsync … dist/`).

## Englisch serverseitig (`?lang=en`)

Der Build erzeugt zu jeder Seite eine englische Fassung mit englischem Head:

| URL                       | Datei               | `<html lang>` | Canonical                 |
| ------------------------- | ------------------- | ------------- | ------------------------- |
| `/alarmtool/`             | `index.html`        | `de`          | `/alarmtool/`             |
| `/alarmtool/?lang=en`     | `index.en.html`     | `en`          | `/alarmtool/?lang=en`     |
| `/alarmtool/app/`         | `app/index.html`    | `de`          | `/alarmtool/app/`         |
| `/alarmtool/app/?lang=en` | `app/index.en.html` | `en`          | `/alarmtool/app/?lang=en` |

In der englischen Fassung sind außerdem Titel, Beschreibung, `og:*`, `twitter:*` und JSON-LD
englisch; hreflang (de, en, x-default = de) ist in allen Fassungen gleich. Erzeugt
werden die Dateien von `src/lib/localizedHtml.ts`. `deploy.sh` kopiert sie mit dem
übrigen Build-Output, eine Änderung am Skript ist nicht nötig.

Damit nginx bei `?lang=en` die englische Datei ausliefert, **einmalig** auf dem
Server ergänzen:

```nginx
# im http-Block (z. B. /etc/nginx/conf.d/alarmtool-lang.conf):
map $arg_lang $alarmtool_index {
    default        index.html;
    "~*^en(-|$)"   index.en.html;   # en, EN, en-US
}

# im server-Block von kodinitools.com, in der bestehenden location /alarmtool/
# (SSI bleibt wie bisher aktiv):
location /alarmtool/ {
    index $alarmtool_index;
    # … bestehende Direktiven unverändert lassen
}
```

Danach `sudo nginx -t && sudo systemctl reload nginx`. Ohne die Regel ändert sich
nichts: nginx liefert weiter `index.html` aus, und die App stellt wie bisher erst
per JavaScript auf Englisch um.

Prüfen (ohne JavaScript, wie ein Crawler):

```bash
curl -s 'https://kodinitools.com/alarmtool/?lang=en' | grep -E '<html lang|<title>|canonical'
curl -s 'https://kodinitools.com/alarmtool/app/?lang=en' | grep -E '<html lang|<title>|canonical'
curl -s 'https://kodinitools.com/alarmtool/' | grep -E '<html lang|canonical'   # bleibt de
```
