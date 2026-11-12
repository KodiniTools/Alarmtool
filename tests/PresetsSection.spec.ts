// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

const restartAlarm = vi.fn()
const stopAlarm = vi.fn()
vi.mock('@/composables/usePlayer', () => ({ usePlayer: () => ({ restartAlarm, stopAlarm }) }))

import PresetsSection from '@/components/PresetsSection.vue'
import { useAlarmStore } from '@/stores/alarmStore'
import { PRESETS } from '@/data/presets'

const first = PRESETS[0]!

/** Buttons of the first preset card: [Abspielen, Bearbeiten, Aufnehmen]. */
function cardButtons(w: ReturnType<typeof mount>) {
  return w.findAll('.preset-card')[0]!.findAll('.preset-play button')
}

describe('PresetsSection – Bearbeiten und Aufnehmen', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('zeigt je Preset Abspielen, Bearbeiten und Aufnehmen', () => {
    const w = mount(PresetsSection)
    expect(cardButtons(w).map((b) => b.text())).toEqual(['Abspielen', 'Bearbeiten', 'Aufnehmen'])
  })

  it('Bearbeiten lädt das Preset ohne Abspielen und öffnet die Oszillatoren', async () => {
    const w = mount(PresetsSection)
    await cardButtons(w)[1]!.trigger('click')

    const store = useAlarmStore()
    expect(store.oscillators[0]!.frequency).toBe(first.data.oscillators[0]!.frequency)
    expect(restartAlarm).not.toHaveBeenCalled()
    expect(w.emitted('navigate')).toEqual([['oscillators']])
    expect(w.find('.preset-active-banner').exists()).toBe(true)
  })

  it('Bearbeiten startet einen laufenden Alarm mit dem neuen Preset neu', async () => {
    const store = useAlarmStore()
    store.isPlaying = true
    const w = mount(PresetsSection)
    await cardButtons(w)[1]!.trigger('click')

    expect(restartAlarm).toHaveBeenCalledTimes(1)
    expect(w.emitted('navigate')).toEqual([['oscillators']])
  })

  it('Aufnehmen spielt das Preset ab und öffnet die Aufnahme', async () => {
    const w = mount(PresetsSection)
    await cardButtons(w)[2]!.trigger('click')

    const store = useAlarmStore()
    expect(restartAlarm).toHaveBeenCalledTimes(1)
    expect(store.activePresetKey).toBe(first.nameKey)
    expect(w.emitted('navigate')).toEqual([['recording']])
  })
})
