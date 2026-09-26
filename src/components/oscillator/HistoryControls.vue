<template>
  <div class="history" role="toolbar" :aria-label="t('history_title')">
    <div class="history-buttons">
      <button
        type="button"
        class="history-btn"
        :disabled="!canUndo"
        :title="undoTitle"
        :aria-label="undoTitle"
        @click="handleUndo"
      >
        <svg class="history-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 14 4 9l5-5" />
          <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
        </svg>
        <span class="history-label">{{ t('osc_undo') }}</span>
        <span v-if="canUndo" class="history-count">{{ undoCount }}</span>
      </button>
      <button
        type="button"
        class="history-btn"
        :disabled="!canRedo"
        :title="redoTitle"
        :aria-label="redoTitle"
        @click="handleRedo"
      >
        <svg class="history-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="m15 14 5-5-5-5" />
          <path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13" />
        </svg>
        <span class="history-label">{{ t('osc_redo') }}</span>
        <span v-if="canRedo" class="history-count">{{ redoCount }}</span>
      </button>
    </div>
    <p class="history-caption" aria-live="polite">
      <template v-if="canUndo">
        <span class="history-caption-key">{{ t('history_last') }}:</span>
        {{ describeHistoryAction(nextUndoAction, t) }}
      </template>
      <template v-else>{{ t('history_empty') }}</template>
    </p>
  </div>
</template>

<script setup>
  import { computed, onMounted, onUnmounted } from 'vue'
  import { useUndoRedo } from '@/composables/useUndoRedo'
  import { useToast } from '@/composables/useToast'
  import { useI18n } from '@/i18n'
  import { describeHistoryAction } from '@/lib/historyLabel'

  const { canUndo, canRedo, undoCount, redoCount, nextUndoAction, nextRedoAction, undo, redo } =
    useUndoRedo()
  const toast = useToast()
  const { t } = useI18n()

  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
  const modKey = computed(() => (isMac ? '⌘' : t('key_ctrl')))

  const undoTitle = computed(() => {
    const shortcut = `(${modKey.value}+Z)`
    return canUndo.value
      ? `${t('osc_undo')}: ${describeHistoryAction(nextUndoAction.value, t)} ${shortcut}`
      : `${t('osc_undo')} ${shortcut}`
  })

  const redoTitle = computed(() => {
    const shortcut = `(${modKey.value}+Y)`
    return canRedo.value
      ? `${t('osc_redo')}: ${describeHistoryAction(nextRedoAction.value, t)} ${shortcut}`
      : `${t('osc_redo')} ${shortcut}`
  })

  function handleUndo() {
    const action = undo()
    if (action) toast.info(`${t('toast_undo')} ${describeHistoryAction(action, t)}`, { raw: true })
  }

  function handleRedo() {
    const action = redo()
    if (action) toast.info(`${t('toast_redo')} ${describeHistoryAction(action, t)}`, { raw: true })
  }

  // Global shortcuts: Ctrl/⌘+Z = undo, Ctrl/⌘+Y or Ctrl/⌘+Shift+Z = redo.
  // Ignored while typing so native text undo keeps working in inputs.
  function handleKeyboard(event) {
    const tag = event.target?.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
    if (!event.ctrlKey && !event.metaKey) return

    const key = event.key.toLowerCase()
    if (key === 'z' && !event.shiftKey) {
      event.preventDefault()
      if (canUndo.value) handleUndo()
    } else if (key === 'y' || (key === 'z' && event.shiftKey)) {
      event.preventDefault()
      if (canRedo.value) handleRedo()
    }
  }

  onMounted(() => document.addEventListener('keydown', handleKeyboard))
  onUnmounted(() => document.removeEventListener('keydown', handleKeyboard))
</script>
