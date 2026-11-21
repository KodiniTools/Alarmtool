// @vitest-environment jsdom
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { existsSync, statSync } from 'node:fs'
import { localizeIndexHtml, localizedFileName } from '@/lib/localizedHtml'
import { PAGE_META, SITE_META } from '@/lib/pageMeta'
import { OSCILLATOR_COUNT } from '@/lib/oscillatorDefaults'
import { WAVE_TYPES } from '@/lib/waveforms.js'
import { PRESETS } from '@/data/presets'

const SOURCE = readFileSync(resolve(__dirname, '../index.html'), 'utf8')
const BASE = 'https://kodinitools.com/alarmtool/'
const APP = `${BASE}app/`

const doc = (html: string) => new DOMParser().parseFromString(html, 'text/html')
const attr = (d: Document, selector: string, name: string) =>
  d.querySelector(selector)?.getAttribute(name)

describe('localizedFileName', () => {
  it('Deutsch bleibt index.html, Englisch wird index.en.html', () => {
    expect(localizedFileName('landing', 'de')).toBe('index.html')
    expect(localizedFileName('landing', 'en')).toBe('index.en.html')
    expect(localizedFileName('app', 'de')).toBe('app/index.html')
    expect(localizedFileName('app', 'en')).toBe('app/index.en.html')
  })
})

describe('localizeIndexHtml', () => {
  it('Landing Deutsch: Head bleibt deutsch mit Canonical ohne Parameter', () => {
    const d = doc(localizeIndexHtml(SOURCE, 'landing', 'de'))
    expect(d.documentElement.lang).toBe('de')
    expect(d.title).toBe(PAGE_META.landing.de.title)
    expect(attr(d, 'link[rel="canonical"]', 'href')).toBe(BASE)
    expect(attr(d, 'meta[property="og:locale"]', 'content')).toBe('de_DE')
  })

  it('Landing Englisch: lang, Titel, Beschreibung, Canonical, OG und Twitter', () => {
    const d = doc(localizeIndexHtml(SOURCE, 'landing', 'en'))
    const meta = PAGE_META.landing.en
    expect(d.documentElement.lang).toBe('en')
    expect(d.title).toBe(meta.title)
    expect(attr(d, 'meta[name="description"]', 'content')).toBe(meta.description)
    expect(attr(d, 'link[rel="canonical"]', 'href')).toBe(`${BASE}?lang=en`)
    expect(attr(d, 'meta[property="og:url"]', 'content')).toBe(`${BASE}?lang=en`)
    expect(attr(d, 'meta[name="twitter:url"]', 'content')).toBe(`${BASE}?lang=en`)
    expect(attr(d, 'meta[property="og:locale"]', 'content')).toBe('en_US')
    expect(attr(d, 'meta[property="og:locale:alternate"]', 'content')).toBe('de_DE')
    expect(attr(d, 'meta[property="og:title"]', 'content')).toBe(meta.title)
    expect(attr(d, 'meta[property="og:description"]', 'content')).toBe(meta.description)
    expect(attr(d, 'meta[name="twitter:title"]', 'content')).toBe(meta.title)
    expect(attr(d, 'meta[name="twitter:description"]', 'content')).toBe(meta.description)
  })

  it('hreflang ist in allen Fassungen gleich und zeigt auf die jeweilige Seite', () => {
    for (const [page, base] of [
      ['landing', BASE],
      ['app', APP],
    ] as const) {
      for (const lang of ['de', 'en'] as const) {
        const d = doc(localizeIndexHtml(SOURCE, page, lang))
        const links = [...d.querySelectorAll('link[rel="alternate"][hreflang]')].map((l) => [
          l.getAttribute('hreflang'),
          l.getAttribute('href'),
        ])
        expect(links).toEqual([
          ['de', base],
          ['en', `${base}?lang=en`],
          ['x-default', base],
        ])
      }
    }
  })

  it('App Deutsch: Canonical und Titel der App-Seite, Head bleibt deutsch', () => {
    const d = doc(localizeIndexHtml(SOURCE, 'app', 'de'))
    expect(d.documentElement.lang).toBe('de')
    expect(d.title).toBe(PAGE_META.app.de.title)
    expect(attr(d, 'link[rel="canonical"]', 'href')).toBe(APP)
    expect(attr(d, 'meta[property="og:locale"]', 'content')).toBe('de_DE')
  })

  it('App Englisch: Canonical mit ?lang=en und englischer Titel', () => {
    const d = doc(localizeIndexHtml(SOURCE, 'app', 'en'))
    expect(d.documentElement.lang).toBe('en')
    expect(d.title).toBe(PAGE_META.app.en.title)
    expect(attr(d, 'link[rel="canonical"]', 'href')).toBe(`${APP}?lang=en`)
  })

  it('JSON-LD: Name, Beschreibung, Funktionsliste und Bild je Sprache', () => {
    const jsonLd = (html: string) =>
      JSON.parse(doc(html).querySelector('script[type="application/ld+json"]')?.textContent ?? '')

    for (const lang of ['de', 'en'] as const) {
      const site = SITE_META[lang]
      const suffix = lang === 'en' ? '?lang=en' : ''
      const data = jsonLd(localizeIndexHtml(SOURCE, 'landing', lang))
      expect(data.name).toBe(site.appName)
      expect(data.description).toBe(site.appDescription)
      expect(data.featureList).toEqual(site.featureList)
      expect(data.image).toBe(BASE + site.image)
      expect(data.url).toBe(BASE + suffix)
      expect(data['@type']).toBe('WebApplication')
      expect(jsonLd(localizeIndexHtml(SOURCE, 'app', lang)).url).toBe(APP + suffix)
    }
    expect(SITE_META.en.featureList).toHaveLength(SITE_META.de.featureList.length)
  })

  it('index.html (Landing Deutsch) stimmt mit PAGE_META und SITE_META überein', () => {
    const squash = (html: string) => html.replace(/\s+/g, ' ')
    expect(squash(localizeIndexHtml(SOURCE, 'landing', 'de'))).toBe(squash(SOURCE))
  })

  it('Keywords und Vorschaubild folgen der Sprache; die Bilddateien liegen in public/', () => {
    for (const lang of ['de', 'en'] as const) {
      const site = SITE_META[lang]
      for (const page of ['landing', 'app'] as const) {
        const d = doc(localizeIndexHtml(SOURCE, page, lang))
        expect(attr(d, 'meta[name="keywords"]', 'content')).toBe(site.keywords)
        expect(attr(d, 'meta[property="og:image"]', 'content')).toBe(BASE + site.image)
        expect(attr(d, 'meta[name="twitter:image"]', 'content')).toBe(BASE + site.image)
        expect(attr(d, 'meta[property="og:image:alt"]', 'content')).toBe(site.imageAlt)
        expect(attr(d, 'meta[name="twitter:image:alt"]', 'content')).toBe(site.imageAlt)
        expect(attr(d, 'meta[property="og:title"]', 'content')).toBe(PAGE_META[page][lang].title)
      }
      const file = resolve(__dirname, '../public', site.image)
      expect(existsSync(file)).toBe(true)
      expect(statSync(file).size).toBeGreaterThan(10_000)
    }
  })

  it('Zahlen in den Metadaten passen zum Funktionsumfang', () => {
    const counts = [OSCILLATOR_COUNT, WAVE_TYPES.length, PRESETS.length]
    for (const lang of ['de', 'en'] as const) {
      const texts = [PAGE_META.landing[lang].description, SITE_META[lang].featureList.join(' | ')]
      for (const text of texts) {
        for (const count of counts) expect(text).toMatch(new RegExp(`\\b${count}\\b`))
      }
      expect(PAGE_META.app[lang].description).toMatch(new RegExp(`\\b${OSCILLATOR_COUNT}\\b`))
      for (const page of ['landing', 'app'] as const) {
        expect(PAGE_META[page][lang].title.length).toBeLessThanOrEqual(65)
        expect(PAGE_META[page][lang].description.length).toBeLessThanOrEqual(165)
      }
    }
  })

  it('SSI-Includes, App-Mount und Theme-Skript bleiben erhalten', () => {
    const html = localizeIndexHtml(SOURCE, 'landing', 'en')
    for (const snippet of [
      '<!--#include virtual="/partials/nav.html" -->',
      '<!--#include virtual="/partials/footer.html" -->',
      '<!--#include virtual="/partials/cookie-banner.html" -->',
      '<div id="app"></div>',
      "localStorage.getItem('theme')",
    ]) {
      expect(html).toContain(snippet)
    }
  })
})
