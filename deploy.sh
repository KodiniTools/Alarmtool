#!/usr/bin/env bash
#
# Server-seitiges Deploy für das Alarmtool.
#
# Holt den aktuellen Stand von origin/main, baut die SPA und synchronisiert
# das Ergebnis nach /var/www/kodinitools.com/alarmtool/.
# Gedacht für den Aufruf per Cron (idempotent: baut nur bei Änderungen) oder
# manuell mit "--force".
#
# Voraussetzungen auf dem Server: git, node/npm, rsync, flock.
#
set -euo pipefail

# ── Konfiguration ──────────────────────────────────────────────────────────
BRANCH="main"
TARGET="/var/www/kodinitools.com/alarmtool"
LOCK="/tmp/alarmtool-deploy.lock"
# Repo = Ordner, in dem dieses Skript liegt (nach dem Klonen des Repos).
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# ───────────────────────────────────────────────────────────────────────────

FORCE=0
[ "${1:-}" = "--force" ] && FORCE=1

# Nur eine Instanz gleichzeitig laufen lassen (Cron-Überlappung verhindern).
exec 9>"$LOCK"
if ! flock -n 9; then
  echo "$(date -Is) Deploy läuft bereits – überspringe."
  exit 0
fi

cd "$REPO_DIR"

git fetch --quiet origin "$BRANCH"
LOCAL="$(git rev-parse HEAD)"
REMOTE="$(git rev-parse "origin/$BRANCH")"

# Nichts tun, wenn keine neue Version UND das Ziel bereits gebaut ist
# (der Ziel-Check erzwingt den allerersten Deploy nach frischem Klon).
if [ "$LOCAL" = "$REMOTE" ] && [ "$FORCE" -eq 0 ] && [ -f "$TARGET/index.html" ]; then
  exit 0
fi

echo "$(date -Is) Deploye $REMOTE ..."
git reset --hard "origin/$BRANCH"

npm ci
npm run build

mkdir -p "$TARGET/assets"

# 1) Gehashte Build-Assets: mit --delete, damit alte Chunks entfernt werden
#    (dieser Ordner enthält ausschließlich Build-Output).
rsync -a --delete dist/assets/ "$TARGET/assets/"

# 2) Restlicher Build-Output (index.html, sitemap.xml, ...): OHNE --delete,
#    damit manuell abgelegte Dateien wie og-image.png erhalten bleiben.
rsync -a --exclude 'assets/' dist/ "$TARGET/"

echo "$(date -Is) Deploy fertig: $REMOTE"
