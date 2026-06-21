// Non-reactive module-level store for oscillator audio nodes and pattern execution state.
// Kept outside Vue's reactivity system to avoid Proxy overhead on Web Audio API objects
// and to prevent reactive updates from interfering with the audio thread.

// Map<oscId, { osc, gainNode, panNode, toneIsOn, patternIndex, patternSteps, patternTimeoutId }>
const _runtime = new Map()

export function getOscRuntime(id) {
  return _runtime.get(id) ?? null
}

export function setOscRuntime(id, patch) {
  const existing = _runtime.get(id) ?? {}
  _runtime.set(id, { ...existing, ...patch })
}

export function clearOscRuntime(id) {
  _runtime.delete(id)
}

export function clearAllOscRuntime() {
  _runtime.clear()
}

export function hasOscRuntime(id) {
  return _runtime.has(id) && _runtime.get(id).osc !== null
}

export function getAllOscRuntimeIds() {
  return [..._runtime.keys()]
}
