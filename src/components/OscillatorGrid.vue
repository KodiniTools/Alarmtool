<template>
  <div>
    <div class="osc-header-row">
      <h2>{{ t('osc_title') }}</h2>
      <div class="undo-redo-controls">
        <button
          class="btn btn-secondary undo-redo-btn"
          :disabled="!canUndo"
          :title="`${t('osc_undo')} (Ctrl+Z)${canUndo ? ' (' + undoCount + ')' : ''}`"
          @click="handleUndo"
        >
          <i class="fas fa-undo"></i>
          <span class="undo-redo-label">{{ t('osc_undo') }}</span>
          <span v-if="canUndo" class="undo-redo-count">{{ undoCount }}</span>
        </button>
        <button
          class="btn btn-secondary undo-redo-btn"
          :disabled="!canRedo"
          :title="`${t('osc_redo')} (Ctrl+Y)${canRedo ? ' (' + redoCount + ')' : ''}`"
          @click="handleRedo"
        >
          <i class="fas fa-redo"></i>
          <span class="undo-redo-label">{{ t('osc_redo') }}</span>
          <span v-if="canRedo" class="undo-redo-count">{{ redoCount }}</span>
        </button>
      </div>
    </div>
    <div class="oscillators-grid">
      <OscillatorItem
        v-for="(osc, index) in store.oscillators"
        :key="index"
        :oscillator-id="index"
        :oscillator="osc"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useAlarmStore } from '@/stores/alarmStore'
import { useUndoRedo } from '@/composables/useUndoRedo'
import { useToast } from '@/composables/useToast'
import { translations } from '@/i18n/translations'
import OscillatorItem from './OscillatorItem.vue'

const store = useAlarmStore()
const { canUndo, canRedo, undoCount, redoCount, undo, redo } = useUndoRedo()
const toast = useToast()

const t = (key) => translations[store.currentLang]?.[key] || key

function handleUndo() {
  undo()
  toast.info('toast_undo')
}

function handleRedo() {
  redo()
  toast.info('toast_redo')
}

function handleKeyboard(event) {
  // Ignore if typing in an input/textarea/select
  const tag = event.target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

  if ((event.ctrlKey || event.metaKey) && !event.shiftKey && event.key === 'z') {
    event.preventDefault()
    if (canUndo.value) handleUndo()
  } else if (
    ((event.ctrlKey || event.metaKey) && event.key === 'y') ||
    ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'z') ||
    ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'Z')
  ) {
    event.preventDefault()
    if (canRedo.value) handleRedo()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyboard)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyboard)
})
</script>
