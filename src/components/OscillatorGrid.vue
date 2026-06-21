<template>
  <div class="osc-master-detail">
    <!-- Left: List panel -->
    <aside class="osc-list-panel">
      <div class="osc-list-header">
        <h2 class="osc-list-title">{{ t('osc_title') }}</h2>
        <div class="undo-redo-controls">
          <button
            class="btn btn-secondary undo-redo-btn"
            :disabled="!canUndo"
            :title="`${t('osc_undo')} (Ctrl+Z)${canUndo ? ' (' + undoCount + ')' : ''}`"
            @click="handleUndo"
          >
            <i class="fas fa-undo"></i>
            <span v-if="canUndo" class="undo-redo-count">{{ undoCount }}</span>
          </button>
          <button
            class="btn btn-secondary undo-redo-btn"
            :disabled="!canRedo"
            :title="`${t('osc_redo')} (Ctrl+Y)${canRedo ? ' (' + redoCount + ')' : ''}`"
            @click="handleRedo"
          >
            <i class="fas fa-redo"></i>
            <span v-if="canRedo" class="undo-redo-count">{{ redoCount }}</span>
          </button>
        </div>
      </div>

      <nav class="osc-list">
        <OscillatorListRow
          v-for="(osc, index) in store.oscillators"
          :key="index"
          :oscillator-id="index"
          :oscillator="osc"
          :selected="selectedId === index"
          @select="selectedId = index"
          @toggle-enabled="handleToggleEnabled(index, $event)"
        />
      </nav>
    </aside>

    <!-- Right: Editor panel -->
    <div class="osc-editor-panel">
      <OscillatorItem
        v-if="selectedOscillator"
        :key="selectedId"
        :oscillator-id="selectedId"
        :oscillator="selectedOscillator"
      />
      <div v-else class="osc-editor-placeholder">
        <i class="fas fa-wave-square"></i>
        <p>{{ t('osc_editor_placeholder') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useAlarmStore } from '@/stores/alarmStore'
  import { useUndoRedo } from '@/composables/useUndoRedo'
  import { useOscillators } from '@/composables/useOscillators'
  import { useToast } from '@/composables/useToast'
  import { translations } from '@/i18n/translations'
  import OscillatorItem from './OscillatorItem.vue'
  import OscillatorListRow from './oscillator/OscillatorListRow.vue'

  const store = useAlarmStore()
  const { canUndo, canRedo, undoCount, redoCount, undo, redo } = useUndoRedo()
  const { updateOscillatorParameter } = useOscillators()
  const toast = useToast()

  const t = (key) => translations[store.currentLang]?.[key] ?? key

  const selectedId = ref(0)
  const selectedOscillator = computed(() => store.oscillators[selectedId.value] ?? null)

  function handleToggleEnabled(index, value) {
    updateOscillatorParameter(index, 'enabled', value)
    if (!store.oscillators[index].enabled && selectedId.value !== index) return
  }

  function handleUndo() {
    undo()
    toast.info('toast_undo')
  }

  function handleRedo() {
    redo()
    toast.info('toast_redo')
  }

  function handleKeyboard(event) {
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

  onMounted(() => document.addEventListener('keydown', handleKeyboard))
  onUnmounted(() => document.removeEventListener('keydown', handleKeyboard))
</script>
