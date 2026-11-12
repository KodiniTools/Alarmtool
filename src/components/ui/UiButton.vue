<template>
  <RouterLink v-if="to" :class="classes" :to="to">
    <slot />
  </RouterLink>
  <a v-else-if="href" :class="classes" :href="href" :download="download || undefined">
    <slot />
  </a>
  <button v-else :type="type" :class="classes" :disabled="disabled">
    <slot />
  </button>
</template>

<script setup lang="ts">
  /**
   * Textbutton des Design Systems (siehe design-system/content/components/Button).
   * Rendert die globalen Klassen aus src/styles/components/button.css, damit der
   * Design-System-Export (bundle.css, preview.html) unverändert gilt.
   *
   * Mit `to` entsteht ein RouterLink (Seitenwechsel ohne Neuladen), mit `href` ein <a>
   * (z. B. Download-Link), sonst ein <button type="button">.
   * Weitere Attribute (id, title, class) und Listener (@click) fallen auf das Wurzelelement durch.
   */
  import { computed, type PropType } from 'vue'
  import { RouterLink, type RouteLocationRaw } from 'vue-router'

  export type ButtonVariant = 'primary' | 'secondary' | 'danger'
  export type ButtonSize = 'md' | 'sm'

  const props = defineProps({
    /** primary: einzige Akzentfläche je Ansicht · secondary: Standard · danger: textbasiert */
    variant: {
      type: String as PropType<ButtonVariant>,
      default: 'secondary',
      validator: (v: string) => ['primary', 'secondary', 'danger'].includes(v),
    },
    /** md: 36 px · sm: 28 px */
    size: {
      type: String as PropType<ButtonSize>,
      default: 'md',
      validator: (v: string) => ['md', 'sm'].includes(v),
    },
    /** HTML-Typ des Buttons; ohne Formular in der App immer 'button' */
    type: {
      type: String as PropType<'button' | 'submit' | 'reset'>,
      default: 'button',
      validator: (v: string) => ['button', 'submit', 'reset'].includes(v),
    },
    /** Router-Ziel; rendert einen RouterLink (hat Vorrang vor href) */
    to: { type: [String, Object] as PropType<RouteLocationRaw>, default: '' },
    /** Rendert einen Link statt eines Buttons */
    href: { type: String, default: '' },
    /** Dateiname für <a download>; nur zusammen mit href */
    download: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
  })

  const classes = computed(() => ['btn', `btn-${props.variant}`, { 'btn-sm': props.size === 'sm' }])
</script>
