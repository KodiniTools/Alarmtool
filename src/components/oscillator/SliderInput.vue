<template>
  <div class="mb-3 param-container">
    <label class="form-label">{{ label }}</label>
    <div class="slider-input-group">
      <input
        :value="modelValue"
        type="range"
        class="form-range"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        @input="emit('update:modelValue', +$event.target.value)"
        @change="emit('change', +$event.target.value)"
      />
      <input
        :value="modelValue"
        type="number"
        class="form-control"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        @input="emit('update:modelValue', +$event.target.value)"
        @change="emit('change', +$event.target.value)"
      />
    </div>
  </div>
</template>

<script setup>
  defineProps({
    modelValue: { type: Number, required: true },
    label: { type: String, required: true },
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    step: { type: Number, default: 1 },
    disabled: { type: Boolean, default: false },
  })

  const emit = defineEmits(['update:modelValue', 'change'])
</script>
