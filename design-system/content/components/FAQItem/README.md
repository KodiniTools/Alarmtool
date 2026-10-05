# FAQItem

Das Frage-Antwort-Element im FAQ-Tab: ein natives `<details>` als flache `ds-surface-1`-Karte mit 1-px-Rahmen, Frage mit Chevron rechts, Antwort in `ds-text-2`.

**Aufbau (Quelle `FAQSection.vue`, `faq.css`):**
- `.faq-item` — `<details>`, 8 px Abstand, `ds-border`, `ds-radius-md`, `ds-surface-1`, `overflow: hidden`. Hover: Rahmen `ds-border-strong`.
- `.faq-question` — `<summary>` als Flex space-between, Padding 12 / 16 px, 14 px / 500 in `ds-text`, kein Marker, `user-select: none`. Hover `ds-surface-2`; Fokus `ds-focus-ring` nach innen. Das Chevron (`<i>`) ist `ds-text-3`, 12 px, dreht bei `[open]` um 180°.
- `.faq-answer` — `max-height: 0 → 500px` über `ds-duration-slow`, Padding 0 16 px → unten 16 px; 13 px, Zeilenhöhe 1.5, `ds-text-2`.

**Der Konsument liefert:** `faqData` als Liste `{ q, a }` mit i18n-Keys; die Komponente rendert `details` pro Eintrag. Mehrere können gleichzeitig offen sein.

**Responsiv:** ≤ 480 px Frage 13 px mit 12 px Padding.

**Dos/Don'ts:** Antworten unter 500 px Höhe halten (Animationsgrenze) — längere Inhalte gehören in den Blog. Keine Links oder Buttons in der Frage.

Statische Vorschau (hand-written from `src/components/FAQSection.vue`, `src/styles/components/faq.css`).
