// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import OscillatorScope from '@/components/oscillator/OscillatorScope.vue'
import { useAlarmStore } from '@/stores/alarmStore'

/** Zeichenaufrufe eines Canvas-Kontexts mitschreiben (jsdom hat kein Canvas). */
function fakeContext() {
  const calls: { lineTo: [number, number][]; strokes: number; strokeStyles: string[] } = {
    lineTo: [],
    strokes: 0,
    strokeStyles: [],
  }
  const ctx = new Proxy(
    {},
    {
      get(target: Record<string, unknown>, prop: string) {
        if (prop === 'lineTo') return (x: number, y: number) => calls.lineTo.push([x, y])
        if (prop === 'stroke') return () => calls.strokes++
        if (prop in target) return target[prop]
        return () => {}
      },
      set(target: Record<string, unknown>, prop: string, value: unknown) {
        if (prop === 'strokeStyle') calls.strokeStyles.push(String(value))
        target[prop] = value
        return true
      },
    }
  )
  return { ctx, calls }
}

let fake: ReturnType<typeof fakeContext>

function mountScope() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = mount(OscillatorScope, { global: { plugins: [pinia] }, attachTo: document.body })
  return { wrapper, store: useAlarmStore() }
}

describe('OscillatorScope (Visualizer)', () => {
  beforeEach(() => {
    localStorage.clear()
    fake = fakeContext()
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
      () => fake.ctx as unknown as CanvasRenderingContext2D
    )
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(600)
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(200)
    // Reduzierte Bewegung: zeichnet synchron bei jeder Änderung statt per Animation
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce') }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
  })

  it('liegt auf einer dunklen Insel und zeichnet Kurven auf das Canvas', () => {
    const { wrapper, store } = mountScope()
    expect(wrapper.attributes('data-theme')).toBe('dark')
    expect(wrapper.find('canvas').exists()).toBe(true)
    expect(fake.calls.strokes).toBeGreaterThan(0)
    const active = store.oscillators.filter((o) => o.enabled).length
    // Stimmen plus Eintrag „Summe“
    expect(wrapper.findAll('.osc-viz__legend li')).toHaveLength(active + 1)
    wrapper.unmount()
  })

  it('zeichnet nach jeder Änderung an einem Oszillator neu und anders', async () => {
    const { wrapper, store } = mountScope()
    const osc = store.oscillators[0]
    const snapshot = () => JSON.stringify(fake.calls.lineTo.slice(0, 1500))

    for (const change of [
      () => (osc.waveType = 'sawtooth'),
      () => (osc.frequency = osc.frequency + 157),
      () => (osc.volume = 0.15),
    ]) {
      const before = snapshot()
      fake.calls.lineTo.length = 0
      change()
      await wrapper.vm.$nextTick()
      expect(snapshot()).not.toBe(before)
    }

    const count = wrapper.findAll('.osc-viz__legend li').length
    osc.enabled = false
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.osc-viz__legend li')).toHaveLength(count - 1)
    expect(wrapper.find('canvas').attributes('aria-label')).not.toContain('1 SAW')
    wrapper.unmount()
  })

  it('zeigt einen Hinweis statt Canvas, wenn kein Oszillator aktiv ist', async () => {
    const { wrapper, store } = mountScope()
    store.oscillators.forEach((o) => (o.enabled = false))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.osc-viz__empty').exists()).toBe(true)
    expect(wrapper.find('canvas').exists()).toBe(false)
    wrapper.unmount()
  })

  it('zeigt während der Wiedergabe den Status „Wiedergabe“', async () => {
    const { wrapper, store } = mountScope()
    expect(wrapper.find('.osc-viz__live').exists()).toBe(false)
    store.isPlaying = true
    store.currentTime = 500
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.osc-viz__live').exists()).toBe(true)
    wrapper.unmount()
  })

  it('kommt ohne Canvas-Unterstützung aus', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    const { wrapper } = mountScope()
    expect(wrapper.find('canvas').exists()).toBe(true)
    wrapper.unmount()
  })
})
