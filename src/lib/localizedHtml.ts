// Statische Sprach-/Seitenfassungen der gebauten index.html, damit Crawler ohne
// JavaScript schon im HTML die richtige Sprache, Titel, Beschreibung und Canonical
// sehen. Ohne Vue- und Alias-Importe, weil vite.config.js die Funktion beim Build lädt.
import { PAGE_META, SITE_META, SITE_URL, pageUrl, type Page } from './pageMeta'
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

const JSON_LD_PATTERN = /(<script type="application\/ld\+json">)([\s\S]*?)(\n?[ \t]*<\/script>)/

/**
 * Überschreibt Felder im JSON-LD-Block. Fehlt der Block, bleibt das HTML unverändert;
 * ungültiges JSON bricht den Build ab, statt unbemerkt falsche Daten auszuliefern.
 */
function patchJsonLd(html: string, patch: Record<string, unknown>): string {
  return html.replace(JSON_LD_PATTERN, (_m, open: string, body: string, close: string) => {
    const data = { ...(JSON.parse(body) as Record<string, unknown>), ...patch }
    const json = JSON.stringify(data, null, 2).replace(/</g, '\\u003c').replace(/^/gm, '      ')
    return `${open}\n${json}${close}`
  })
}

/**
 * Erzeugt aus der deutschen Landing-index.html die Fassung für Seite und Sprache.
 * - Seite: alle Links auf SITE_URL (Canonical, hreflang, og:url, JSON-LD) zeigen auf die Seite.
 * - Titel und Beschreibung der Seite in der Sprache, auch für Open Graph und Twitter.
 * - Keywords, Vorschaubild samt Alt-Text und JSON-LD (Name, Beschreibung, Funktionsliste)
 *   in der Sprache aus SITE_META.
 * - Englisch zusätzlich: <html lang="en">, Canonical/og:url/twitter:url mit ?lang=en und
 *   og:locale en_US.
 * hreflang bleibt in allen Fassungen gleich (de, en, x-default = de).
 */
export function localizeIndexHtml(sourceHtml: string, page: Page, lang: HtmlLang): string {
  const base = pageUrl(page)
  const meta = PAGE_META[page][lang]
  const site = SITE_META[lang]
  const title = escapeHtml(meta.title)
  const description = escapeHtml(meta.description)
  const canonical = localizedUrl(base, lang)
  const image = SITE_URL + site.image
  const imageAlt = escapeHtml(site.imageAlt)

  let html = sourceHtml
    .replaceAll(`"${SITE_URL}"`, `"${base}"`)
    .replaceAll(`"${SITE_URL}?lang=en"`, `"${base}?lang=en"`)
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${title}</title>`)
  html = setMetaContent(html, 'name', 'description', description)
  html = setMetaContent(html, 'name', 'keywords', escapeHtml(site.keywords))
  html = setMetaContent(html, 'property', 'og:title', title)
  html = setMetaContent(html, 'property', 'og:description', description)
  html = setMetaContent(html, 'property', 'og:image', image)
  html = setMetaContent(html, 'property', 'og:image:alt', imageAlt)
  html = setMetaContent(html, 'name', 'twitter:title', title)
  html = setMetaContent(html, 'name', 'twitter:description', description)
  html = setMetaContent(html, 'name', 'twitter:image', image)
  html = setMetaContent(html, 'name', 'twitter:image:alt', imageAlt)

  if (lang === 'en') {
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
  }

  return patchJsonLd(html, {
    name: site.appName,
    description: site.appDescription,
    url: canonical,
    image,
    browserRequirements: site.browserRequirements,
    featureList: site.featureList,
  })
}
