<template>
  <div class="mb-3 param-container">
    <label :for="inputId" class="form-label">{{ label }}</label>
    <div class="slider-input-group">
      <input
        :id="inputId"
        :value="modelValue"
        type="range"
        class="form-range"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        @input="emit('update:modelValue', +($event.target as HTMLInputElement).value)"
        @change="emit('change', +($event.target as HTMLInputElement).value)"
      />
      <input
        :value="modelValue"
        type="number"
        class="form-control"
        :aria-label="label"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        @input="emit('update:modelValue', +($event.target as HTMLInputElement).value)"
        @change="emit('change', +($event.target as HTMLInputElement).value)"
      />
    </div>
    <small v-if="help" class="form-text">{{ help }}</small>
  </div>
</template>

<script setup lang="ts">
  /**
   * Slider-plus-Zahlfeld-Paar (design-system/content/components/FormControls).
   * Das Label zeigt per `for` auf den Slider, das Zahlfeld trägt das Label als
   * aria-label. Beide Eingaben melden `update:modelValue` (bei jeder Eingabe)
   * und `change` (beim Loslassen bzw. Bestätigen) mit dem Wert als Zahl.
   */
  import { computed, useId } from 'vue'

  const props = defineProps({
    modelValue: { type: Number, required: true },
    label: { type: String, required: true },
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    step: { type: Number, default: 1 },
    disabled: { type: Boolean, default: false },
    /** Feste id des Sliders (z. B. für bestehende Tests oder Anker); sonst automatisch */
    id: { type: String, default: '' },
    /** Hilfetext unter dem Paar */
    help: { type: String, default: '' },
  })

  const emit = defineEmits<{ 'update:modelValue': [value: number]; change: [value: number] }>()

  const autoId = useId()
  const inputId = computed(() => props.id || autoId)
</script>
