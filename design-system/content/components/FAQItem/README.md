# FAQItem

Das Frage-Antwort-Element im FAQ-Tab: ein natives `<details>` als Glaskarte, Frage mit goldenem Chevron rechts, Antwort in Info-Blau.

**Aufbau (Quelle `FAQSection.vue`, `faq.css`):**
- `.faq-item` — `<details>`, `space-3` Abstand, 1 px `at-muted` 20 % (Light Navy 10 %), `radius-card`, `at-surface` 40 % (Light `at-bg` 40 %), `overflow: hidden`. Hover: Rahmen Gold 30 % (Light Navy 35 %).
- `.faq-question` — `<summary>` als Flex space-between, `space-4` `space-5` Padding, `faq-question` 0.9 rem / 500 in `at-text`, kein Marker, `user-select: none`. Hover Gold 5 %. Das `<i>` (Chevron) ist `at-primary` 0.8 rem und dreht bei `[open]` um 180°.
- `.faq-answer` — `max-height: 0 → 500px` mit 0.3 s, Padding 0 `space-5` → unten `space-4`; `faq-answer` 0.85 rem, Zeilenhöhe 1.6, in `at-info-text`.

**Der Konsument liefert:** `faqData` als Liste `{ q, a }` mit i18n-Keys; die Komponente rendert `details` pro Eintrag. Mehrere können gleichzeitig offen sein.

**Responsiv:** ≤ 480 px Frage 0.85 rem mit 0.85 rem `space-4` Padding, Antwort 0.8 rem.

**Dos/Don'ts:** Antworten unter 500 px Höhe halten (Animationsgrenze) — längere Inhalte gehören in den Blog. Keine Links oder Buttons in der Frage. Antworten in `at-info-text`, nicht `at-text`, damit Frage und Antwort sich unterscheiden.

Statische Vorschau (hand-written from `src/components/FAQSection.vue`, `src/styles/components/faq.css`).
