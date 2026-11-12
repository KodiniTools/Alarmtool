// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import App from '@/App.vue'
import AppPage from '@/views/AppPage.vue'
import { useAlarmStore } from '@/stores/alarmStore'
import { normalizeLang } from '@/i18n'

function mountApp() {
  const pinia = createPinia()
  setActivePinia(pinia)
  return shallowMount(App, { global: { plugins: [pinia] } })
}

describe('App.vue — SSI nav sync', () => {
  let wrapper: ReturnType<typeof mountApp> | null = null

  beforeEach(() => {
    localStorage.clear()
    document.documentElement.setAttribute('lang', 'de')
    document.documentElement.removeAttribute('data-theme')
  })

  afterEach(() => wrapper?.unmount())

  it('adopts lang and data-theme set by the nav before mount', () => {
    document.documentElement.setAttribute('lang', 'en')
    document.documentElement.setAttribute('data-theme', 'light')
    wrapper = mountApp()
    const store = useAlarmStore()
    expect(store.currentLang).toBe('en')
    expect(store.currentTheme).toBe('light')
    expect(localStorage.getItem('locale')).toBe('en')
    expect(wrapper.findComponent({ name: 'RouterView' }).exists()).toBe(true)
  })

  it('ignores an unsupported lang attribute', () => {
    document.documentElement.setAttribute('lang', 'fr')
    wrapper = mountApp()
    expect(useAlarmStore().currentLang).toBe('de')
  })

  it('follows locale-changed / theme-changed events and ignores invalid ones', async () => {
    wrapper = mountApp()
    const store = useAlarmStore()

    window.dispatchEvent(new CustomEvent('locale-changed', { detail: { locale: 'en-US' } }))
    expect(store.currentLang).toBe('en')

    window.dispatchEvent(new CustomEvent('locale-changed', { detail: { locale: 'xx' } }))
    window.dispatchEvent(new CustomEvent('locale-changed', {}))
    expect(store.currentLang).toBe('en')

    window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme: 'light' } }))
    expect(store.currentTheme).toBe('light')
  })

  it('removes its listeners on unmount', () => {
    wrapper = mountApp()
    const store = useAlarmStore()
    wrapper.unmount()
    wrapper = null
    window.dispatchEvent(new CustomEvent('locale-changed', { detail: { locale: 'en' } }))
    expect(store.currentLang).toBe('de')
  })
})

function mountAppPage() {
  const pinia = createPinia()
  setActivePinia(pinia)
  return shallowMount(AppPage, { global: { plugins: [pinia] } })
}

describe('AppPage.vue — tab switch from presets', () => {
  it('opens the tab a section asks for via navigate', async () => {
    const wrapper = mountAppPage()
    const sections = () => wrapper.findAll('.tab-content > .section')
    const visibleIndex = () => sections().findIndex((s) => s.isVisible())
    expect(visibleIndex()).toBe(0)

    wrapper.findComponent({ name: 'PresetsSection' }).vm.$emit('navigate', 'recording')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.tab-btn.active').text()).toContain('Aufnahme')
    wrapper.unmount()
  })
})

describe('normalizeLang', () => {
  it('maps locales to supported languages', () => {
    expect(normalizeLang('EN-gb')).toBe('en')
    expect(normalizeLang(' de ')).toBe('de')
    expect(normalizeLang('fr')).toBeNull()
    expect(normalizeLang(undefined)).toBeNull()
  })
})

describe('AppPage.vue — save options', () => {
  it('offers the save options menu in the filter tab', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = shallowMount(AppPage, {
      global: { plugins: [pinia], stubs: { CollapsibleSection: false } },
    })
    const filterTab = wrapper.find('.section-narrow')
    expect(filterTab.findComponent({ name: 'FilterControl' }).exists()).toBe(true)
    expect(filterTab.find('.filter-save-options').exists()).toBe(true)
    expect(filterTab.findComponent({ name: 'SettingsPanel' }).exists()).toBe(true)
    wrapper.unmount()
  })
})

describe('AppPage.vue — Start-Link', () => {
  it('führt aus der Tab-Leiste zurück zur Landing-Page', async () => {
    const { mount, flushPromises } = await import('@vue/test-utils')
    const { createMemoryHistory } = await import('vue-router')
    const { createAppRouter } = await import('@/router')
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createAppRouter(createMemoryHistory())
    await router.push('/app/')
    const wrapper = mount(AppPage, {
      global: {
        plugins: [pinia, router],
        stubs: {
          FilterControl: true,
          OscillatorGrid: true,
          OscillatorScope: true,
          RecorderControl: true,
          PresetsSection: true,
          FAQSection: true,
          PlayerControl: true,
          SettingsPanel: true,
        },
      },
    })
    const home = wrapper.find('.tabs a.tab-btn--home')
    expect(home.attributes('href')).toBe('/')
    expect(home.text()).toBe('Start')
    expect(wrapper.find('.tabs').element.firstElementChild).toBe(home.element)
    await home.trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('landing')
    wrapper.unmount()
  })
})
