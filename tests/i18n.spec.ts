import { describe, it, expect } from 'vitest'
import { translations } from '@/i18n/translations'
import de from '@/i18n/de'
import en from '@/i18n/en'

describe('Übersetzungen', () => {
  it('stellt beide Sprachen über translations bereit', () => {
    expect(Object.keys(translations).sort()).toEqual(['de', 'en'])
    expect(translations.de).toBe(de)
    expect(translations.en).toBe(en)
  })

  it('hat in beiden Sprachen dieselben Schlüssel', () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(de).sort())
  })

  it('hat keine leeren Texte', () => {
    for (const [lang, dict] of Object.entries(translations)) {
      for (const [key, value] of Object.entries(dict)) {
        expect(typeof value, `${lang}.${key}`).toBe('string')
        expect(value.trim(), `${lang}.${key}`).not.toBe('')
      }
    }
  })
})
