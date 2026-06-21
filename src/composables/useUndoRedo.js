import { reactive, computed } from 'vue'
import { useAlarmStore } from '@/stores/alarmStore'
import { useOscillators } from './useOscillators'
import { useAudioContext } from './useAudioContext'

const MAX_HISTORY = 50

const state = reactive({
  undoStack: [],
  redoStack: [],
  isApplying: false,
  debounceTimer: null,
  hasPendingSnapshot: false,
})

function captureSnapshot() {
  const store = useAlarmStore()
  return {
    filter: {
      type: store.filterSettings.type,
      frequency: store.filterSettings.frequency,
      Q: store.filterSettings.Q,
    },
    oscillators: store.oscillators.map((osc) => ({
      enabled: osc.enabled,
      waveType: osc.waveType,
      frequency: osc.frequency,
      volume: osc.volume,
      pan: osc.pan,
      attack: osc.attack,
      decay: osc.decay,
      sustain: osc.sustain,
      release: osc.release,
      pattern: osc.pattern,
    })),
  }
}

function applySnapshot(snapshot) {
  const store = useAlarmStore()
  const { updateOscillatorParameter, parsePattern } = useOscillators()
  const { updateFilter } = useAudioContext()

  state.isApplying = true

  if (snapshot.filter) {
    updateFilter(snapshot.filter)
  }

  snapshot.oscillators.forEach((oscSnap, index) => {
    const current = store.oscillators[index]

    if (current.enabled !== oscSnap.enabled) {
      updateOscillatorParameter(index, 'enabled', oscSnap.enabled)
    }

    if (current.waveType !== oscSnap.waveType) {
      updateOscillatorParameter(index, 'waveType', oscSnap.waveType)
    }
    if (current.frequency !== oscSnap.frequency) {
      updateOscillatorParameter(index, 'frequency', oscSnap.frequency)
    }
    if (current.volume !== oscSnap.volume) {
      updateOscillatorParameter(index, 'volume', oscSnap.volume)
    }
    if (current.pan !== oscSnap.pan) {
      updateOscillatorParameter(index, 'pan', oscSnap.pan)
    }
    if (current.attack !== oscSnap.attack) {
      store.updateOscillator(index, { attack: oscSnap.attack })
    }
    if (current.decay !== oscSnap.decay) {
      store.updateOscillator(index, { decay: oscSnap.decay })
    }
    if (current.sustain !== oscSnap.sustain) {
      store.updateOscillator(index, { sustain: oscSnap.sustain })
    }
    if (current.release !== oscSnap.release) {
      store.updateOscillator(index, { release: oscSnap.release })
    }
    if (current.pattern !== oscSnap.pattern) {
      store.updateOscillator(index, { pattern: oscSnap.pattern })
      parsePattern(index)
    }
  })

  state.isApplying = false
}

export function useUndoRedo() {
  const canUndo = computed(() => state.undoStack.length > 0)
  const canRedo = computed(() => state.redoStack.length > 0)
  const undoCount = computed(() => state.undoStack.length)
  const redoCount = computed(() => state.redoStack.length)

  function recordChange() {
    if (state.isApplying) return

    if (!state.hasPendingSnapshot) {
      // First change in a batch: save the "before" state
      const snapshot = captureSnapshot()
      state.undoStack.push(snapshot)

      if (state.undoStack.length > MAX_HISTORY) {
        state.undoStack.shift()
      }

      // Clear redo stack on new change
      state.redoStack.splice(0, state.redoStack.length)
      state.hasPendingSnapshot = true
    }

    // Reset debounce timer
    if (state.debounceTimer) {
      clearTimeout(state.debounceTimer)
    }

    state.debounceTimer = setTimeout(() => {
      state.hasPendingSnapshot = false
      state.debounceTimer = null
    }, 400)
  }

  function undo() {
    if (state.undoStack.length === 0) return

    // Flush any pending debounce
    if (state.debounceTimer) {
      clearTimeout(state.debounceTimer)
      state.debounceTimer = null
      state.hasPendingSnapshot = false
    }

    const currentState = captureSnapshot()
    state.redoStack.push(currentState)

    const previousState = state.undoStack.pop()
    applySnapshot(previousState)
  }

  function redo() {
    if (state.redoStack.length === 0) return

    // Flush any pending debounce
    if (state.debounceTimer) {
      clearTimeout(state.debounceTimer)
      state.debounceTimer = null
      state.hasPendingSnapshot = false
    }

    const currentState = captureSnapshot()
    state.undoStack.push(currentState)

    const nextState = state.redoStack.pop()
    applySnapshot(nextState)
  }

  function clear() {
    state.undoStack.splice(0, state.undoStack.length)
    state.redoStack.splice(0, state.redoStack.length)
    state.hasPendingSnapshot = false
    if (state.debounceTimer) {
      clearTimeout(state.debounceTimer)
      state.debounceTimer = null
    }
  }

  return {
    canUndo,
    canRedo,
    undoCount,
    redoCount,
    recordChange,
    undo,
    redo,
    clear,
  }
}
