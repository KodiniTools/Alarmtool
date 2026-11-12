import { reactive, computed } from 'vue'
import { useAlarmStore } from '@/stores/alarmStore'
import { useOscillators } from './useOscillators'
import { useAudioContext } from './useAudioContext'
import { pickOscParams, type FilterSettings, type OscParams } from '@/lib/oscillatorDefaults'
import type { HistoryAction } from '@/lib/historyLabel'

export type { HistoryAction }

const MAX_HISTORY = 50
const BATCH_WINDOW_MS = 400

/** Full sound state to restore: filter plus every oscillator's on/off and sound parameters. */
export interface SoundSnapshot {
  filter: FilterSettings
  oscillators: (OscParams & { enabled: boolean })[]
}

export interface HistoryEntry {
  snapshot: SoundSnapshot
  action: HistoryAction
}

interface HistoryState {
  undoStack: HistoryEntry[]
  redoStack: HistoryEntry[]
  isApplying: boolean
  batchDepth: number
  debounceTimer: ReturnType<typeof setTimeout> | null
  /** Action of the running slider/typing batch, or null. */
  pendingAction: HistoryAction | null
}

const state = reactive<HistoryState>({
  undoStack: [],
  redoStack: [],
  isApplying: false,
  batchDepth: 0,
  debounceTimer: null,
  pendingAction: null,
})

function captureSnapshot(): SoundSnapshot {
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

function snapshotsEqual(a: SoundSnapshot, b: SoundSnapshot): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

function sameAction(a: HistoryAction | null, b: HistoryAction | null): boolean {
  return (
    !!a && !!b && a.labelKey === b.labelKey && a.oscId === b.oscId && a.detailKey === b.detailKey
  )
}

/** Live-audio parameters go through the coordinator so running nodes follow. */
const LIVE_PARAMS = ['enabled', 'waveType', 'frequency', 'pan'] as const
const STORE_PARAMS = ['volume', 'attack', 'decay', 'sustain', 'release'] as const

function applySnapshot(snapshot: SoundSnapshot) {
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

      for (const param of LIVE_PARAMS) {
        if (current[param] !== oscSnap[param]) {
          updateOscillatorParameter(index, param, oscSnap[param])
        }
      }
      for (const param of STORE_PARAMS) {
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

function pushUndo(entry: HistoryEntry) {
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
 */
function recordChange(action: HistoryAction = {}) {
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
 */
function withHistory<T>(action: HistoryAction, fn: () => T): T {
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
function travel(from: HistoryEntry[], to: HistoryEntry[]): HistoryAction | null {
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
    /** Returns the undone action, or null. */
    undo: () => travel(state.undoStack, state.redoStack),
    /** Returns the redone action, or null. */
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
