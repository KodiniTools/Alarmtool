import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useSettingsStore } from '@/stores/settingsStore'

function memoryStorage(initial: Record<string, string> = {}) {
  const data: Record<string, string> = { ...initial }
  return {
    data,
    getItem: (k: string) => (k in data ? data[k] : null),
    setItem: (k: string, v: unknown) => {
      data[k] = String(v)
    },
  }
}

const blockedStorage = {
  getItem: () => {
    throw new DOMException('blocked', 'SecurityError')
  },
  setItem: () => {
    throw new DOMException('quota', 'QuotaExceededError')
  },
}

describe('settingsStore', () => {
  beforeEach(() => setActivePinia(createPinia()))
  afterEach(() => vi.unstubAllGlobals())

  it('reads valid stored preferences', () => {
    vi.stubGlobal('localStorage', memoryStorage({ locale: 'en', theme: 'light' }))
    const store = useSettingsStore()
    expect(store.currentLang).toBe('en')
    expect(store.currentTheme).toBe('light')
  })

  it('normalizes stored locales and rejects invalid stored values', () => {
    vi.stubGlobal('localStorage', memoryStorage({ locale: 'EN-us', theme: 'neon' }))
    let store = useSettingsStore()
    expect(store.currentLang).toBe('en')
    expect(store.currentTheme).toBe('dark')

    setActivePinia(createPinia())
    vi.stubGlobal('localStorage', memoryStorage({ locale: 'fr' }))
    store = useSettingsStore()
    expect(store.currentLang).toBe('de')
  })

  it('?lang=en wins over the stored language and is persisted', () => {
    const storage = memoryStorage({ locale: 'de' })
    vi.stubGlobal('localStorage', storage)
    vi.stubGlobal('location', { search: '?lang=en' })
    const store = useSettingsStore()
    expect(store.currentLang).toBe('en')
    expect(storage.data.locale).toBe('en')

    setActivePinia(createPinia())
    vi.stubGlobal('location', { search: '?lang=fr' })
    expect(useSettingsStore().currentLang).toBe('en')
  })

  it('falls back to defaults and keeps working when storage is blocked', () => {
    vi.stubGlobal('localStorage', blockedStorage)
    const store = useSettingsStore()
    expect(store.currentLang).toBe('de')
    expect(store.currentTheme).toBe('dark')

    expect(() => store.setLanguage('en')).not.toThrow()
    expect(() => store.setTheme('light')).not.toThrow()
    expect(store.currentLang).toBe('en')
    expect(store.currentTheme).toBe('light')
  })

  it('setters normalize, persist and ignore unsupported values', () => {
    const storage = memoryStorage()
    vi.stubGlobal('localStorage', storage)
    const store = useSettingsStore()

    store.setLanguage('en-GB')
    expect(store.currentLang).toBe('en')
    expect(storage.data.locale).toBe('en')

    store.setLanguage('xx')
    store.setLanguage(undefined)
    expect(store.currentLang).toBe('en')
    expect(storage.data.locale).toBe('en')

    store.setTheme('light')
    store.setTheme('neon')
    expect(store.currentTheme).toBe('light')
    expect(storage.data.theme).toBe('light')
  })
})
