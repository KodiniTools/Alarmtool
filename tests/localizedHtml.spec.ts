// @vitest-environment jsdom
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { localizeIndexHtml, localizedFileName } from '@/lib/localizedHtml'
import { PAGE_META } from '@/lib/pageMeta'

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
