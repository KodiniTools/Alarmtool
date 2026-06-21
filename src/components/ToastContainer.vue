<template>
  <div class="toast-container" aria-live="polite" aria-atomic="true">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast-item"
      :class="[
        `toast-${toast.type}`,
        { 'toast-visible': toast.visible, 'toast-leaving': toast.leaving },
      ]"
      role="alert"
    >
      <div class="toast-icon">
        <i :class="toast.icon"></i>
      </div>
      <div class="toast-body">
        {{ toast.message }}
      </div>
      <button class="toast-close" aria-label="Close" @click="dismiss(toast.id)">
        <i class="fas fa-times"></i>
      </button>
      <div
        v-if="toast.duration > 0"
        class="toast-progress"
        :style="{ animationDuration: toast.duration + 'ms' }"
        :class="{ 'toast-progress-running': toast.visible && !toast.leaving }"
      ></div>
    </div>
  </div>
</template>

<script setup>
  import { useToast } from '@/composables/useToast'

  const { toasts, dismiss } = useToast()
</script>
