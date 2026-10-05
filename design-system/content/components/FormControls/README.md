# FormControls

Label, Textfeld, Select, das Slider-plus-Zahl-Paar und der Toggle-Schalter, mit denen jeder Parameter eingestellt wird — nach `UiTextField`, `UiSelect` und dem Range-Slider des Collage Makers.

**Bausteine (Quelle `form.css`, `SliderInput.vue`):**
- `.form-label` — `label` 13 px / 500 in `ds-text-2`, 4 px über dem Control.
- `.form-control` — 40 px (`ds-control-lg`), Padding 0 12 px, `ds-surface-2`, `ds-border-strong`, `ds-radius-md`, 14 px. Fokus: Rahmen `ds-accent` plus `ds-focus-ring`. Platzhalter `ds-text-3`, `disabled` Opazität 0.6.
- `.form-select` — 36 px (`ds-control-md`), Gewicht 500, native Darstellung mit `color-scheme` des Themes.
- `.form-range` — 6-px-Spur in `ds-border-strong` (`ds-radius-full`), 14-px-Daumen in `ds-accent` mit 2-px-Rand in `ds-surface-1`; Fokus-Ring; auf Touch 8 px Spur und 20 px Daumen.
- `.slider-input-group` — Flex, Gap 8 px: Slider `flex: 1`, daneben ein 80-px-Zahlfeld (36 px hoch, zentriert, Tabellenziffern; 72 / 64 px auf kleinen Breiten).
- `.toggle-switch` / `.toggle-slider` — 36×20 Schalter: Spur `ds-border-strong`, Knopf 16 px in `ds-surface-1`; `:checked` färbt die Spur `ds-accent`; Fokus-Ring über das versteckte `<input>`.
- `.form-text` / `.small-text` — Hilfetext 13 px in `ds-text-3`, 4 px unter dem Control.

**Der Konsument liefert:** `<label for>` + Control mit `id`, Min/Max/Step auf beiden Eingaben des Paars identisch, den Wert beidseitig synchron (`SliderInput` mit `update:modelValue`). Hilfetext erklärt Einheit und sinnvollen Bereich.

**Dos/Don'ts:** Immer Label, nie nur Platzhalter. Zahlfeld nur zusammen mit Slider. ≤ 768 px bleibt die Schrift 16 px (iOS-Zoom). Deaktivieren über `disabled` auf beiden Eingaben; ganze Blöcke zusätzlich mit `.controls-disabled`.

Statische Vorschau (hand-written from `src/styles/components/form.css`, `FilterControl.vue`).
