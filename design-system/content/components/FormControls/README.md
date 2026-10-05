# FormControls

Label, Textfeld, Select und das Slider-plus-Zahl-Paar, mit denen jeder Parameter der App eingestellt wird.

**Bausteine (Quelle `form.css`, `SliderInput.vue`):**
- `.form-label` — `label`-Stil 0.85 rem / 500, `at-text`, Block über dem Control, 0.4 rem Abstand.
- `.form-control`, `.form-select` — volle Breite, 0.55 rem 0.85 rem Padding, `at-radius-xs`, Grund `at-surface` bei 40 % (Light: Weiß 90 %), Rahmen `at-border-color`. Fokus: Rahmen `at-primary` (Light `at-info`) plus `shadow-focus`, Grund 60 %; kein Outline.
- `.form-range` — 4-px-Spur in `at-muted` 25 %, runder 14-px-Daumen in `at-primary` mit `shadow-thumb`; Hover skaliert 1.15. In `.section-narrow` 3 px Spur / 12 px Daumen.
- `.slider-input-group` — Flex, 10 px Gap: Slider `flex: 1`, daneben ein 80-px-`.form-control` (65 px ≤ 768, 55 px ≤ 480). Im Oszillator-Editor wird die Zahl zur zentrierten Pill mit Tabellenziffern.
- `.form-text` / `.small-text` — Hilfetext 0.8 rem in `at-text-dim`, 0.2 rem unter dem Control.
- `.param-container`, `.control-group` — `space-4` Abstand nach unten.

**Der Konsument liefert:** `<label for>` + Control mit `id`, Min/Max/Step **auf beiden** Eingaben des Paars identisch, den Wert beidseitig synchron (in der App `v-model.number` bzw. `SliderInput` mit `update:modelValue`). Hilfetext erklärt Einheit und sinnvollen Bereich.

**Dos/Don'ts:** Immer Label, nie nur Placeholder. Number-Input nur zusammen mit Slider. ≤ 768 px bleibt die Schrift 16 px (iOS-Zoom). Deaktivieren über `disabled` auf beiden Eingaben; die App dimmt zusätzlich den ganzen Block mit `.controls-disabled`.

Statische Vorschau (hand-written from `src/styles/components/form.css`, `FilterControl.vue`).
