# Alarmtool - Beispiel-Alarmtöne / Example Alarm Tones

Diese JSON-Dateien sind fertige Alarmton-Presets, die über die **Import-Funktion** in der App geladen werden können.
Sie zeigen die verschiedenen Möglichkeiten, die das Alarmtool bietet.

These JSON files are ready-to-use alarm tone presets that can be loaded via the **Import function** in the app.
They demonstrate the different capabilities of the Alarmtool.

---

## Verwendung / Usage

1. Öffne das Alarmtool im Browser
2. Klicke auf **Einstellungen importieren** (Import Settings)
3. Wähle eine der `.json`-Dateien aus diesem Ordner
4. Drücke **Play** zum Anhören

---

## Presets

### 1. `classic-emergency-siren.json` — Klassische Notfallsirene

Ein klassischer Zwei-Ton-Alarm, wie man ihn von Rettungsdiensten kennt. Zwei Sinuswellen
wechseln sich in einem typischen Hi-Lo-Muster ab (660 Hz / 880 Hz). Eine leise
Dreieck-Oberwelle bei 1320 Hz verleiht dem Ton zusätzliche Schärfe.

| Feature             | Wert                          |
|---------------------|-------------------------------|
| Aktive Oszillatoren | 3                             |
| Wellenformen        | Sine, Triangle                |
| Filter              | Lowpass 6000 Hz               |
| Muster              | Alternierend Hi-Lo            |
| Charakter           | Dringend, klassisch, laut     |

---

### 2. `industrial-warning-signal.json` — Industrielles Warnsignal

Ein schwerer, tieffrequenter Warnton, wie er in Fabriken oder bei Gefahrenmeldungen
eingesetzt wird. Sägezahn- und Rechteckwellen erzeugen einen rohen, aggressiven Klang.
Der Tiefpassfilter bei 3500 Hz mit erhöhtem Q erzeugt eine leichte Resonanzspitze.

| Feature             | Wert                          |
|---------------------|-------------------------------|
| Aktive Oszillatoren | 5                             |
| Wellenformen        | Sawtooth, Square, Triangle    |
| Filter              | Lowpass 3500 Hz, Q=2.5        |
| Muster              | Langsam pulsierend            |
| Charakter           | Schwer, bedrohlich, industriell |

---

### 3. `gentle-wake-up-alarm.json` — Sanfter Weckalarm

Ein angenehmer, harmonischer Weckton basierend auf einem C-Dur-Akkord (C5-E5-G5-C6)
mit langen Ein-/Ausblendzeiten (800-1500ms Attack, 600-1200ms Release). Die Töne
schwellen sanft an und klingen weich aus — ideal als Wecker oder Meditationstimer.

| Feature             | Wert                          |
|---------------------|-------------------------------|
| Aktive Oszillatoren | 5                             |
| Wellenformen        | Sine, Triangle                |
| Filter              | Lowpass 4000 Hz               |
| Muster              | Langsam, versetzt, fließend   |
| Charakter           | Sanft, harmonisch, warm       |

---

### 4. `heartbeat-monitor-alert.json` — Herzmonitor-Alarm

Simuliert den typischen Piepton eines medizinischen Monitors. Kurze, scharfe Impulse
(80ms an, 120ms aus, 80ms an, 700ms Pause) imitieren den Doppelschlag eines Herzschlags.
Der Bandpassfilter bei 1200 Hz fokussiert den Klang auf die typische Monitor-Frequenz.
Subtile Stereo-Pings links/rechts ergänzen den Hauptton.

| Feature             | Wert                          |
|---------------------|-------------------------------|
| Aktive Oszillatoren | 5                             |
| Wellenformen        | Sine, Triangle                |
| Filter              | Bandpass 1200 Hz, Q=3         |
| Muster              | Doppelpuls mit Pause          |
| Charakter           | Medizinisch, präzise, klinisch |

---

### 5. `scifi-stereo-sweep.json` — Sci-Fi Stereo-Sweep

Ein komplexer, futuristischer Alarmton, der das volle Stereopanorama nutzt.
Leicht verstimmte Sägezahnwellen (200/203 Hz) erzeugen einen Schwebungseffekt,
während schnelle Rechteck-Pulse und hohe Sinustöne im Stereofeld wandern.
Ein tiefer Dreieck-Basston (100 Hz) gibt dem Ganzen Fundament. 9 aktive Oszillatoren
zeigen die Leistungsfähigkeit des Tools bei komplexen Klanglandschaften.

| Feature             | Wert                          |
|---------------------|-------------------------------|
| Aktive Oszillatoren | 9                             |
| Wellenformen        | Sawtooth, Square, Sine, Triangle |
| Filter              | Highpass 150 Hz               |
| Muster              | Polyrhythmisch, versetzt      |
| Charakter           | Futuristisch, breit, komplex  |

---

## Parameter-Referenz

| Parameter   | Bereich      | Beschreibung                                    |
|-------------|-------------|-------------------------------------------------|
| `waveType`  | sine, square, sawtooth, triangle | Wellenform des Oszillators  |
| `frequency` | 50–2000 Hz  | Tonhöhe                                         |
| `volume`    | 0–1         | Lautstärke (0 = stumm, 1 = maximum)             |
| `pan`       | -1 bis 1    | Stereoposition (-1 = links, 1 = rechts)         |
| `attack`    | 0–2000 ms   | Einblendzeit beim Einschalten                   |
| `release`   | 0–2000 ms   | Ausblendzeit beim Ausschalten                   |
| `pattern`   | z.B. "300,200" | An/Aus-Zeiten in ms (gerade Anzahl Werte)    |

### Globaler Filter

| Parameter   | Bereich           | Beschreibung                              |
|-------------|-------------------|-------------------------------------------|
| `type`      | none, lowpass, highpass, bandpass, notch | Filtertyp         |
| `frequency` | 20–20000 Hz       | Grenzfrequenz / Mittenfrequenz            |
| `Q`         | 0.1–50            | Resonanz / Bandbreite                     |
