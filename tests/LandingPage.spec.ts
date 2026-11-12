// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import LandingPage from '@/views/LandingPage.vue'
import { createAppRouter } from '@/router'
import { useAlarmStore } from '@/stores/alarmStore'
import { OSCILLATOR_COUNT } from '@/lib/oscillatorDefaults'
import { PRESETS } from '@/data/presets'

async function mountLanding() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = createAppRouter(createMemoryHistory())
  await router.push('/')
  const wrapper = mount(LandingPage, { global: { plugins: [pinia, router] } })
  await flushPromises()
  return { wrapper, router }
}

describe('LandingPage', () => {
  beforeEach(() => localStorage.clear())

  it('zeigt Überschrift, Hero-Bild und alle Abschnitte ohne rohe Schlüssel', async () => {
    const { wrapper } = await mountLanding()
    expect(wrapper.find('h1').text()).toContain('12 Oszillatoren')
    expect(wrapper.find('.lp-visual[role="img"]').attributes('aria-label')).toMatch(/Oszillator/)
    expect(wrapper.findAll('.lp-feature')).toHaveLength(6)
    expect(wrapper.findAll('.lp-step')).toHaveLength(3)
    expect(wrapper.text()).not.toMatch(/\blp_[a-z0-9_]+/)
  })

  it('zeichnet vier aktive und einen ausgeschalteten Oszillator plus Summe', async () => {
    const { wrapper } = await mountLanding()
    expect(wrapper.findAll('.lp-osc:not(.lp-osc--mix)')).toHaveLength(5)
    expect(wrapper.findAll('.lp-osc--off')).toHaveLength(1)
    for (const path of wrapper.findAll('.lp-wave')) {
      expect(path.attributes('d')).toMatch(/^M[\d.]+,[\d.]+( L[\d.]+,[\d.]+)+$/)
    }
    expect(wrapper.findAll('.lp-gate').length).toBeGreaterThan(0)
  })

  it('leitet die Fakten aus der Konfiguration ab', async () => {
    const { wrapper } = await mountLanding()
    const values = wrapper.findAll('.lp-fact dt').map((dt) => dt.text())
    expect(values).toEqual([String(OSCILLATOR_COUNT), '6', String(PRESETS.length), '0'])
  })

  it('führt mit dem Start-Button zur App', async () => {
    const { wrapper, router } = await mountLanding()
    const cta = wrapper.find('a.btn-primary')
    expect(cta.attributes('href')).toBe('/app/')
    await cta.trigger('click')
    // Die App-Seite wird lazy geladen
    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe('app'), { timeout: 5000 })
  })

  it('wechselt die Sprache mit dem Store', async () => {
    const { wrapper } = await mountLanding()
    useAlarmStore().setLanguage('en')
    await flushPromises()
    expect(wrapper.find('h1').text()).toContain('12 oscillators')
    expect(wrapper.find('a.btn-primary').text()).toContain('Create alarm sound')
  })
})
