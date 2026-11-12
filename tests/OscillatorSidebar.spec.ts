// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import OscillatorGrid from '@/components/OscillatorGrid.vue'
import { _resetHistoryForTests } from '@/composables/useUndoRedo'
import { useAlarmStore } from '@/stores/alarmStore'

function mountGrid() {
  const pinia = createPinia()
  setActivePinia(pinia)
  _resetHistoryForTests()
  return mount(OscillatorGrid, { global: { plugins: [pinia] }, attachTo: document.body })
}

describe('OscillatorGrid sidebar', () => {
  beforeEach(() => localStorage.clear())

  it('shows the oscillator list open and save options collapsed', () => {
    const wrapper = mountGrid()
    const headers = wrapper.findAll('.collapsible-header')
    expect(headers).toHaveLength(2)
    expect(headers[0].attributes('aria-expanded')).toBe('true')
    expect(headers[1].attributes('aria-expanded')).toBe('false')
    expect(wrapper.findAll('.osc-list-row')).toHaveLength(12)
    wrapper.unmount()
  })

  it('toggles the save options dropdown', async () => {
    const wrapper = mountGrid()
    const saveHeader = wrapper.findAll('.collapsible-header')[1]
    await saveHeader.trigger('click')
    expect(saveHeader.attributes('aria-expanded')).toBe('true')
    expect(wrapper.findAll('.settings-menu-item')).toHaveLength(4)
    wrapper.unmount()
  })

  it('undo/redo buttons revert a toggle and follow keyboard shortcuts', async () => {
    const wrapper = mountGrid()
    const store = useAlarmStore()
    const [undoBtn, redoBtn] = wrapper.findAll('.history-btn')
    expect(undoBtn.attributes('disabled')).toBeDefined()

    await wrapper.findAll('.osc-row-toggle')[5].trigger('click')
    expect(store.oscillators[5].enabled).toBe(true)
    expect(undoBtn.attributes('disabled')).toBeUndefined()
    expect(wrapper.find('.history-caption').text()).toContain('Oszillator 6')

    await undoBtn.trigger('click')
    expect(store.oscillators[5].enabled).toBe(false)
    expect(redoBtn.attributes('disabled')).toBeUndefined()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true }))
    expect(store.oscillators[5].enabled).toBe(true)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true }))
    expect(store.oscillators[5].enabled).toBe(false)
    wrapper.unmount()
  })
})
