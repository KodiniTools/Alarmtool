// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAlarmStore } from '@/stores/alarmStore'
import { useOscillators } from '@/composables/useOscillators'
import { useAudioContext } from '@/composables/useAudioContext'
import { useUndoRedo, _resetHistoryForTests } from '@/composables/useUndoRedo'
import { describeHistoryAction } from '@/lib/historyLabel'

const t = (key) => ({ osc_frequency: 'Frequenz', osc_title_prefix: 'Oszillator' })[key] ?? key

describe('useUndoRedo', () => {
  let store, osc, history

  beforeEach(() => {
    vi.useFakeTimers()
    setActivePinia(createPinia())
    _resetHistoryForTests()
    store = useAlarmStore()
    osc = useOscillators()
    history = useUndoRedo()
  })

  afterEach(() => vi.useRealTimers())

  it('merges a slider drag into one step and undoes/redoes it', () => {
    osc.updateOscillatorParameter(0, 'frequency', 500)
    osc.updateOscillatorParameter(0, 'frequency', 600)
    osc.updateOscillatorParameter(0, 'frequency', 700)
    vi.advanceTimersByTime(500)

    expect(history.undoCount.value).toBe(1)
    expect(history.nextUndoAction.value).toEqual({ labelKey: 'osc_frequency', oscId: 0 })

    expect(history.undo()).toEqual({ labelKey: 'osc_frequency', oscId: 0 })
    expect(store.oscillators[0].frequency).toBe(440)
    expect(history.canRedo.value).toBe(true)

    history.redo()
    expect(store.oscillators[0].frequency).toBe(700)
  })

  it('does not record changes that keep the same value', () => {
    osc.updateOscillatorParameter(0, 'frequency', 440)
    osc.updateOscillatorParameter(0, 'enabled', true)
    vi.advanceTimersByTime(500)
    expect(history.canUndo.value).toBe(false)
  })

  it('drops a batch that ends where it started', () => {
    osc.updateOscillatorParameter(1, 'volume', 0.9)
    osc.updateOscillatorParameter(1, 'volume', 0.5)
    vi.advanceTimersByTime(500)
    expect(history.canUndo.value).toBe(false)
  })

  it('records different parameters as separate steps, even within the batch window', () => {
    osc.updateOscillatorParameter(2, 'frequency', 880)
    osc.updateOscillatorParameter(2, 'pan', -0.5)
    expect(history.undoCount.value).toBe(2)

    history.undo()
    expect(store.oscillators[2]).toMatchObject({ frequency: 880, pan: 0 })
    history.undo()
    expect(store.oscillators[2]).toMatchObject({ frequency: 440, pan: 0 })
  })

  it('withHistory groups many changes into one step and skips no-ops', () => {
    history.withHistory({ labelKey: 'osc_paste', oscId: 3 }, () => {
      osc.updateOscillatorParameter(3, 'enabled', true)
      osc.updateOscillatorParameter(3, 'waveType', 'square')
      osc.updateOscillatorParameter(3, 'pattern', '100,100')
    })
    expect(history.undoCount.value).toBe(1)

    history.undo()
    expect(store.oscillators[3]).toMatchObject({
      enabled: false,
      waveType: 'sine',
      pattern: '1500,300',
    })

    // A no-op transaction neither adds a step nor clears the redo stack.
    history.withHistory({ labelKey: 'settings_load' }, () => {})
    expect(history.canUndo.value).toBe(false)
    expect(history.canRedo.value).toBe(true)
  })

  it('a new change clears the redo stack', () => {
    osc.updateOscillatorParameter(0, 'frequency', 500)
    history.undo()
    expect(history.canRedo.value).toBe(true)
    osc.updateOscillatorParameter(0, 'volume', 0.2)
    expect(history.canRedo.value).toBe(false)
  })

  it('undoes filter changes made before any audio context exists', () => {
    const { updateFilter } = useAudioContext()
    history.recordChange({ labelKey: 'tab_filter' })
    updateFilter({ type: 'lowpass', frequency: 2000, Q: 1 })
    expect(store.filterSettings.type).toBe('lowpass')

    history.undo()
    expect(store.filterSettings).toEqual({ type: 'none', frequency: 1000, Q: 1 })
  })
})

describe('describeHistoryAction', () => {
  it('builds a readable label', () => {
    expect(describeHistoryAction({ labelKey: 'osc_frequency', oscId: 3 }, t)).toBe(
      'Frequenz · Oszillator 4'
    )
    expect(describeHistoryAction({ labelKey: 'x', detailKey: 'y' }, t)).toBe('x · y')
    expect(describeHistoryAction(null, t)).toBe('')
  })
})
