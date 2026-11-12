// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import OscillatorScope from '@/components/oscillator/OscillatorScope.vue'
import { useAlarmStore } from '@/stores/alarmStore'

function mountScope() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = mount(OscillatorScope, { global: { plugins: [pinia] } })
  return { wrapper, store: useAlarmStore() }
}

describe('OscillatorScope', () => {
  beforeEach(() => localStorage.clear())

  it('zeichnet je aktivem Oszillator eine Spur plus Summe', () => {
    const { wrapper, store } = mountScope()
    const activeCount = store.oscillators.filter((o) => o.enabled).length
    expect(activeCount).toBeGreaterThan(0)
    expect(wrapper.findAll('.osc-scope__lane--wave .osc-scope__layer')).toHaveLength(activeCount)
    expect(wrapper.findAll('.osc-scope__legend li')).toHaveLength(activeCount)
    expect(wrapper.find('.osc-scope__mix').attributes('d')).toMatch(/^M/)
  })

  it('reagiert sofort auf Wellenform, Frequenz, Lautstärke, Muster und Ein/Aus', async () => {
    const { wrapper, store } = mountScope()
    const mix = () => wrapper.find('.osc-scope__mix').attributes('d')
    const area = () => wrapper.find('.osc-scope__area').attributes('d')
    const osc = store.oscillators[0]

    let before = mix()
    osc.waveType = 'square'
    await wrapper.vm.$nextTick()
    expect(mix()).not.toBe(before)
    expect(wrapper.find('.osc-scope__layer').classes()).toContain('osc-wave-chip--square')

    before = mix()
    osc.frequency = osc.frequency + 123
    await wrapper.vm.$nextTick()
    expect(mix()).not.toBe(before)

    before = mix()
    osc.volume = 0.1
    await wrapper.vm.$nextTick()
    expect(mix()).not.toBe(before)

    const areaBefore = area()
    osc.pattern = '100,400'
    await wrapper.vm.$nextTick()
    expect(area()).not.toBe(areaBefore)

    const count = wrapper.findAll('.osc-scope__legend li').length
    osc.enabled = false
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.osc-scope__legend li')).toHaveLength(count - 1)
  })

  it('zeigt einen Hinweis, wenn kein Oszillator aktiv ist', async () => {
    const { wrapper, store } = mountScope()
    store.oscillators.forEach((o) => (o.enabled = false))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.osc-scope__empty').exists()).toBe(true)
    expect(wrapper.find('svg').exists()).toBe(false)
  })

  it('zeigt die Abspielposition nur während der Wiedergabe', async () => {
    const { wrapper, store } = mountScope()
    expect(wrapper.find('.osc-scope__playhead').exists()).toBe(false)
    store.isPlaying = true
    store.currentTime = 500
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.osc-scope__playhead').exists()).toBe(true)
    expect(wrapper.find('.osc-scope__live').exists()).toBe(true)
  })
})
