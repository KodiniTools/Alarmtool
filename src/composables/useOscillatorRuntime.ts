// Non-reactive module-level store for oscillator audio nodes and pattern execution state.
// Kept outside Vue's reactivity system to avoid Proxy overhead on Web Audio API objects
// and to prevent reactive updates from interfering with the audio thread.

/** Audio nodes and pattern state of one running oscillator. */
export interface OscRuntime {
  osc?: OscillatorNode
  gainNode?: GainNode
  panNode?: StereoPannerNode
  toneIsOn?: boolean
  patternIndex?: number
  patternSteps?: number[]
  patternTimeoutId?: ReturnType<typeof setTimeout> | null
}

const _runtime = new Map<number, OscRuntime>()

export function getOscRuntime(id: number): OscRuntime | null {
  return _runtime.get(id) ?? null
}

export function setOscRuntime(id: number, patch: Partial<OscRuntime>): void {
  const existing = _runtime.get(id) ?? {}
  _runtime.set(id, { ...existing, ...patch })
}

export function clearOscRuntime(id: number): void {
  _runtime.delete(id)
}

export function clearAllOscRuntime(): void {
  _runtime.clear()
}
