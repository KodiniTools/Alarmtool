import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

vi.stubGlobal('localStorage', {
  getItem: () => null,
  setItem: () => {},
})

const { useAlarmStore } = await import('@/stores/alarmStore')
const { usePlayerStore } = await import('@/stores/playerStore')
const { useRecorderStore } = await import('@/stores/recorderStore')
const { translate } = await import('@/i18n')

describe('alarmStore facade', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('creates 12 oscillators with the first 3 enabled', () => {
    const store = useAlarmStore()
    expect(store.oscillators).toHaveLength(12)
    expect(store.oscillators.filter((o) => o.enabled).map((o) => o.id)).toEqual([0, 1, 2])
    expect(store.oscillators[5]).toMatchObject({ frequency: 440, pattern: '1500,300' })
  })

  it('forwards reads and writes to the domain stores', () => {
    const store = useAlarmStore()
    store.isPlaying = true
    store.volume = 0.3
    store.remainingTime = 1000
    expect(usePlayerStore().isPlaying).toBe(true)
    expect(usePlayerStore().volume).toBe(0.3)
    expect(useRecorderStore().remainingTime).toBe(1000)

    usePlayerStore().isMuted = true
    expect(store.isMuted).toBe(true)
  })

  it('keeps audio node refs writable', () => {
    const store = useAlarmStore()
    const fake = {}
    store.audioCtx = fake
    expect(store.audioCtx).toBe(fake)
    store.audioCtx = null
  })

  it('updates filter settings and oscillators', () => {
    const store = useAlarmStore()
    expect(store.filterSettings).toEqual({ type: 'none', frequency: 1000, Q: 1 })
    store.updateFilterSettings({ type: 'lowpass' })
    expect(store.filterSettings.type).toBe('lowpass')
    store.updateOscillator(4, { frequency: 880 })
    expect(store.oscillators[4].frequency).toBe(880)
  })
})

describe('translate', () => {
  it('returns the translation or falls back to the key', () => {
    expect(translate('en', 'preset_play')).not.toBe('preset_play')
    expect(translate('en', 'does_not_exist')).toBe('does_not_exist')
    expect(translate('xx', 'preset_play')).toBe('preset_play')
  })
})
