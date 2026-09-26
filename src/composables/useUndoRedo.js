import { reactive, computed } from 'vue'
import { useAlarmStore } from '@/stores/alarmStore'
import { useOscillators } from './useOscillators'
import { useAudioContext } from './useAudioContext'
import { pickOscParams } from '@/lib/oscillatorDefaults'

const MAX_HISTORY = 50
const BATCH_WINDOW_MS = 400

/**
 * @typedef {object} HistoryAction
 * @property {string} [labelKey]  translation key naming the change (e.g. 'osc_frequency')
 * @property {number} [oscId]     affected oscillator, if any
 * @property {string} [detailKey] extra translation key (e.g. a preset name)
 *
 * @typedef {object} HistoryEntry
 * @property {object} snapshot    full sound state to restore
 * @property {HistoryAction} action
 */

const state = reactive({
  /** @type {HistoryEntry[]} */
  undoStack: [],
  /** @type {HistoryEntry[]} */
  redoStack: [],
  isApplying: false,
  batchDepth: 0,
  debounceTimer: null,
  /** Action of the running slider/typing batch, or null. */
  pendingAction: null,
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
      ...pickOscParams(osc),
    })),
  }
}

function snapshotsEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

function sameAction(a, b) {
  return (
    !!a && !!b && a.labelKey === b.labelKey && a.oscId === b.oscId && a.detailKey === b.detailKey
  )
}

function applySnapshot(snapshot) {
  const store = useAlarmStore()
  const { updateOscillatorParameter, parsePattern } = useOscillators()
  const { updateFilter } = useAudioContext()

  state.isApplying = true
  try {
    if (snapshot.filter) {
      updateFilter(snapshot.filter)
    }

    snapshot.oscillators.forEach((oscSnap, index) => {
      const current = store.oscillators[index]

      // Live-audio parameters go through the coordinator so running nodes follow.
      for (const param of ['enabled', 'waveType', 'frequency', 'pan']) {
        if (current[param] !== oscSnap[param]) {
          updateOscillatorParameter(index, param, oscSnap[param])
        }
      }
      for (const param of ['volume', 'attack', 'decay', 'sustain', 'release']) {
        if (current[param] !== oscSnap[param]) {
          store.updateOscillator(index, { [param]: oscSnap[param] })
        }
      }
      if (current.pattern !== oscSnap.pattern) {
        store.updateOscillator(index, { pattern: oscSnap.pattern })
        parsePattern(index)
      }
    })
  } finally {
    state.isApplying = false
  }
}

function pushUndo(entry) {
  state.undoStack.push(entry)
  if (state.undoStack.length > MAX_HISTORY) {
    state.undoStack.shift()
  }
  state.redoStack.splice(0, state.redoStack.length)
}

/** Drops the newest undo entry if it would not change anything. */
function pruneNoOp() {
  const top = state.undoStack[state.undoStack.length - 1]
  if (top && snapshotsEqual(top.snapshot, captureSnapshot())) {
    state.undoStack.pop()
  }
}

function endBatch() {
  if (state.debounceTimer) {
    clearTimeout(state.debounceTimer)
    state.debounceTimer = null
  }
  if (state.pendingAction) {
    state.pendingAction = null
    pruneNoOp()
  }
}

/**
 * Call right BEFORE changing the sound state. Consecutive changes of the same
 * kind (e.g. dragging one slider) within BATCH_WINDOW_MS form a single step.
 * @param {HistoryAction} [action]
 */
function recordChange(action = {}) {
  if (state.isApplying || state.batchDepth > 0) return

  if (!sameAction(state.pendingAction, action)) {
    endBatch()
    pushUndo({ snapshot: captureSnapshot(), action })
    state.pendingAction = action
  }

  if (state.debounceTimer) clearTimeout(state.debounceTimer)
  state.debounceTimer = setTimeout(endBatch, BATCH_WINDOW_MS)
}

/**
 * Runs `fn` as ONE undoable step (e.g. paste, preset load, import). Nested
 * recordChange calls are ignored; nothing is recorded if `fn` changes nothing.
 * @template T
 * @param {HistoryAction} action
 * @param {() => T} fn
 * @returns {T}
 */
function withHistory(action, fn) {
  if (state.isApplying || state.batchDepth > 0) return fn()

  endBatch()
  const before = captureSnapshot()
  state.batchDepth++
  try {
    return fn()
  } finally {
    state.batchDepth--
    if (!snapshotsEqual(before, captureSnapshot())) {
      pushUndo({ snapshot: before, action })
    }
  }
}

/**
 * Moves one step from `from` to `to`, skipping entries that equal the current
 * state. Returns the action that was undone/redone, or null.
 */
function travel(from, to) {
  endBatch()
  const current = captureSnapshot()

  let entry = from.pop()
  while (entry && snapshotsEqual(entry.snapshot, current)) {
    entry = from.pop()
  }
  if (!entry) return null

  to.push({ snapshot: current, action: entry.action })
  applySnapshot(entry.snapshot)
  return entry.action
}

export function useUndoRedo() {
  const canUndo = computed(() => state.undoStack.length > 0)
  const canRedo = computed(() => state.redoStack.length > 0)
  const undoCount = computed(() => state.undoStack.length)
  const redoCount = computed(() => state.redoStack.length)
  const nextUndoAction = computed(() => state.undoStack.at(-1)?.action ?? null)
  const nextRedoAction = computed(() => state.redoStack.at(-1)?.action ?? null)

  return {
    canUndo,
    canRedo,
    undoCount,
    redoCount,
    nextUndoAction,
    nextRedoAction,
    recordChange,
    withHistory,
    /** @returns {HistoryAction | null} the undone action */
    undo: () => travel(state.undoStack, state.redoStack),
    /** @returns {HistoryAction | null} the redone action */
    redo: () => travel(state.redoStack, state.undoStack),
  }
}

/** Test helper — resets the module-level history. */
export function _resetHistoryForTests() {
  endBatch()
  state.undoStack.splice(0)
  state.redoStack.splice(0)
  state.batchDepth = 0
  state.isApplying = false
}
