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
