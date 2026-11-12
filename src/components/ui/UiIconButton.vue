<template>
  <UiButton :aria-label="label" :title="label">
    <slot />
  </UiButton>
</template>

<script setup>
  /**
   * Button nur mit Icon. `label` wird zu aria-label und title, damit die Aktion
   * für Screenreader und als Tooltip benannt ist. Alle UiButton-Props (variant,
   * size, disabled, href, …) fallen durch.
   */
  import UiButton from './UiButton.vue'

  defineProps({
    /** Zugänglicher Name der Aktion (Pflicht) */
    label: { type: String, required: true },
  })
</script>
