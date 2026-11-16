// Statische Sprach-/Seitenfassungen der gebauten index.html, damit Crawler ohne
// JavaScript schon im HTML die richtige Sprache, Titel, Beschreibung und Canonical
// sehen. Ohne Vue- und Alias-Importe, weil vite.config.js die Funktion beim Build lädt.
import { PAGE_META, SITE_URL, pageUrl, type Page } from './pageMeta'
import { localizedUrl } from '../utils/localeSeo'

export type HtmlLang = 'de' | 'en'

/** Ausgabedatei je Seite und Sprache; Deutsch bleibt die Standard-index.html. */
export function localizedFileName(page: Page, lang: HtmlLang): string {
  const dir = page === 'app' ? 'app/' : ''
  return `${dir}${lang === 'en' ? 'index.en.html' : 'index.html'}`
}

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Ersetzt das content-Attribut eines <meta>-Tags, erkannt an name/property. */
function setMetaContent(html: string, attr: 'name' | 'property', key: string, value: string) {
  const pattern = new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[^"]*(")`)
  return html.replace(pattern, (_m, start: string, end: string) => `${start}${value}${end}`)
}

/**
 * Erzeugt aus der deutschen Landing-index.html die Fassung für Seite und Sprache.
 * - Seite: alle Links auf SITE_URL (Canonical, hreflang, og:url, JSON-LD) zeigen auf die Seite.
 * - Titel und Beschreibung der Seite in der Sprache.
 * - Englisch zusätzlich: <html lang="en">, Canonical/og:url/twitter:url mit ?lang=en,
 *   og:locale en_US sowie Open-Graph-/Twitter-Titel und -Beschreibung.
 * hreflang bleibt in allen Fassungen gleich (de, en, x-default = de).
 */
export function localizeIndexHtml(sourceHtml: string, page: Page, lang: HtmlLang): string {
  const base = pageUrl(page)
  const meta = PAGE_META[page][lang]
  const title = escapeHtml(meta.title)
  const description = escapeHtml(meta.description)

  let html = sourceHtml
    .replaceAll(`"${SITE_URL}"`, `"${base}"`)
    .replaceAll(`"${SITE_URL}?lang=en"`, `"${base}?lang=en"`)
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${title}</title>`)
  html = setMetaContent(html, 'name', 'description', description)

  if (lang === 'de') return html

  const canonical = localizedUrl(base, lang)
  html = html
    .replace(/<html\s+lang="[^"]*"/, '<html lang="en"')
    .replace(
      /(<link\s+rel="canonical"\s+href=")[^"]*(")/,
      (_m, start: string, end: string) => `${start}${canonical}${end}`
    )
  html = setMetaContent(html, 'property', 'og:url', canonical)
  html = setMetaContent(html, 'name', 'twitter:url', canonical)
  html = setMetaContent(html, 'property', 'og:locale', 'en_US')
  html = setMetaContent(html, 'property', 'og:locale:alternate', 'de_DE')
  html = setMetaContent(html, 'property', 'og:title', title)
  html = setMetaContent(html, 'property', 'og:description', description)
  html = setMetaContent(html, 'name', 'twitter:title', title)
  html = setMetaContent(html, 'name', 'twitter:description', description)
  return html
}
