// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { createMemoryHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import { createAppRouter } from '@/router'
import { PAGE_META, PAGE_PATHS, pageFromPath, pageUrl } from '@/lib/pageMeta'
import { useSettingsStore } from '@/stores/settingsStore'

describe('Router', () => {
  it('zeigt die Landing-Page unter / und die App unter /app/', async () => {
    const router = createAppRouter(createMemoryHistory())
    await router.push('/')
    expect(router.currentRoute.value.name).toBe('landing')
    await router.push(PAGE_PATHS.app)
    expect(router.currentRoute.value.name).toBe('app')
    await router.push('/app')
    expect(router.currentRoute.value.name).toBe('app')
  })

  it('leitet unbekannte Pfade auf die Landing-Page um', async () => {
    const router = createAppRouter(createMemoryHistory())
    await router.push('/gibt-es-nicht')
    expect(router.currentRoute.value.name).toBe('landing')
  })
})

describe('pageMeta', () => {
  it('ordnet Pfade den Seiten zu', () => {
    expect(pageFromPath('/')).toBe('landing')
    expect(pageFromPath('/app')).toBe('app')
    expect(pageFromPath('/app/')).toBe('app')
    expect(pageFromPath('/application')).toBe('landing')
    expect(pageFromPath(undefined)).toBe('landing')
  })

  it('baut absolute URLs je Seite', () => {
    expect(pageUrl('landing')).toBe('https://kodinitools.com/alarmtool/')
    expect(pageUrl('app')).toBe('https://kodinitools.com/alarmtool/app/')
  })

  it('hat für jede Seite Titel und Beschreibung in DE und EN', () => {
    for (const page of Object.values(PAGE_META)) {
      for (const lang of ['de', 'en'] as const) {
        expect(page[lang].title).toMatch(/KodiniTools$/)
        expect(page[lang].description.length).toBeGreaterThan(50)
        expect(page[lang].description.length).toBeLessThanOrEqual(170)
      }
    }
  })
})

describe('settingsStore — Kopf je Seite', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    document.head.innerHTML = ''
  })

  it('setzt Canonical, Titel und hreflang beim Wechsel auf die App-Seite', async () => {
    const store = useSettingsStore()
    store.setPage('app')
    await Promise.resolve()
    expect(document.title).toBe(PAGE_META.app.de.title)
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://kodinitools.com/alarmtool/app/'
    )

    store.setLanguage('en')
    await Promise.resolve()
    expect(document.title).toBe(PAGE_META.app.en.title)
    expect(
      document.querySelector('link[rel="alternate"][hreflang="en"]')?.getAttribute('href')
    ).toBe('https://kodinitools.com/alarmtool/app/?lang=en')

    store.setPage('landing')
    await Promise.resolve()
    expect(document.title).toBe(PAGE_META.landing.en.title)
  })

  it('ignoriert unbekannte Seiten', () => {
    const store = useSettingsStore()
    store.setPage('blog')
    expect(store.currentPage).toBe('landing')
  })
})
