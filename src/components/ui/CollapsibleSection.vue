<template>
  <section class="collapsible" :class="{ 'collapsible--open': isOpen }">
    <button
      :id="headerId"
      type="button"
      class="collapsible-header"
      :aria-expanded="isOpen"
      :aria-controls="bodyId"
      @click="isOpen = !isOpen"
    >
      <span v-if="icon" class="collapsible-icon"><i :class="icon" aria-hidden="true"></i></span>
      <span class="collapsible-title">{{ title }}</span>
      <span v-if="summary" class="collapsible-summary">{{ summary }}</span>
      <i class="fas fa-chevron-down collapsible-chevron" aria-hidden="true"></i>
    </button>
    <div
      :id="bodyId"
      class="collapsible-body"
      role="region"
      :aria-labelledby="headerId"
      :inert="!isOpen"
    >
      <div class="collapsible-inner">
        <slot />
      </div>
    </div>
  </section>
</template>

<script setup>
  import { ref } from 'vue'
  import { uniqueId } from '@/lib/uid'

  const props = defineProps({
    title: { type: String, required: true },
    icon: { type: String, default: '' },
    /** Short text shown next to the title (e.g. the current selection). */
    summary: { type: String, default: '' },
    defaultOpen: { type: Boolean, default: false },
  })

  const isOpen = ref(props.defaultOpen)
  const id = uniqueId('collapsible')
  const headerId = `${id}-header`
  const bodyId = `${id}-body`
</script>
