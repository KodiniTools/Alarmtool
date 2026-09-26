// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import App from '@/App.vue'
import { useAlarmStore } from '@/stores/alarmStore'
import { normalizeLang } from '@/i18n'

function mountApp() {
  const pinia = createPinia()
  setActivePinia(pinia)
  return shallowMount(App, { global: { plugins: [pinia] } })
}

describe('App.vue — SSI nav sync', () => {
  let wrapper

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
    expect(wrapper.find('.app-title').text()).not.toBe('app_title')
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

describe('normalizeLang', () => {
  it('maps locales to supported languages', () => {
    expect(normalizeLang('EN-gb')).toBe('en')
    expect(normalizeLang(' de ')).toBe('de')
    expect(normalizeLang('fr')).toBeNull()
    expect(normalizeLang(undefined)).toBeNull()
  })
})

describe('App.vue — save options', () => {
  it('offers the save options menu in the filter tab', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = shallowMount(App, {
      global: { plugins: [pinia], stubs: { CollapsibleSection: false } },
    })
    const filterTab = wrapper.find('.section-narrow')
    expect(filterTab.findComponent({ name: 'FilterControl' }).exists()).toBe(true)
    expect(filterTab.find('.filter-save-options').exists()).toBe(true)
    expect(filterTab.findComponent({ name: 'SettingsPanel' }).exists()).toBe(true)
    wrapper.unmount()
  })
})
