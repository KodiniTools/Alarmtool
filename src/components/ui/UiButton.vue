<template>
  <a v-if="href" :class="classes" :href="href" :download="download || undefined">
    <slot />
  </a>
  <button v-else :type="type" :class="classes" :disabled="disabled">
    <slot />
  </button>
</template>

<script setup>
  /**
   * Textbutton des Design Systems (siehe design-system/content/components/Button).
   * Rendert die globalen Klassen aus src/styles/components/button.css, damit der
   * Design-System-Export (bundle.css, preview.html) unverändert gilt.
   *
   * Mit `href` entsteht ein <a> (z. B. Download-Link), sonst ein <button type="button">.
   * Weitere Attribute (id, title, class) und Listener (@click) fallen auf das Wurzelelement durch.
   */
  import { computed } from 'vue'

  const props = defineProps({
    /** primary: einzige Akzentfläche je Ansicht · secondary: Standard · danger: textbasiert */
    variant: {
      type: String,
      default: 'secondary',
      validator: (v) => ['primary', 'secondary', 'danger'].includes(v),
    },
    /** md: 36 px · sm: 28 px */
    size: {
      type: String,
      default: 'md',
      validator: (v) => ['md', 'sm'].includes(v),
    },
    /** HTML-Typ des Buttons; ohne Formular in der App immer 'button' */
    type: {
      type: String,
      default: 'button',
      validator: (v) => ['button', 'submit', 'reset'].includes(v),
    },
    /** Rendert einen Link statt eines Buttons */
    href: { type: String, default: '' },
    /** Dateiname für <a download>; nur zusammen mit href */
    download: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
  })

  const classes = computed(() => ['btn', `btn-${props.variant}`, { 'btn-sm': props.size === 'sm' }])
</script>
