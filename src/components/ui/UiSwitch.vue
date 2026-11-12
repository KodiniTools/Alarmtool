<template>
  <label class="toggle-switch" :title="title || undefined">
    <input
      :checked="modelValue"
      type="checkbox"
      role="switch"
      :aria-label="label"
      :disabled="disabled"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span class="toggle-slider"></span>
  </label>
</template>

<script setup lang="ts">
  /**
   * Ein/Aus-Schalter (36 × 20 px, Stile .toggle-switch in form.css).
   * Natives Checkbox-Input mit role="switch"; `label` benennt es für Screenreader.
   */
  defineProps({
    modelValue: { type: Boolean, required: true },
    /** Zugänglicher Name (Pflicht) */
    label: { type: String, required: true },
    /** Tooltip; Standard: keiner */
    title: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
  })

  const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>
