// Seiten der App (Router) mit Pfad und SEO-Texten je Sprache.
// Ohne Vue- und Alias-Importe, weil vite.config.js daraus beim Build die
// statische Kopie app/index.html erzeugt.

export const SITE_URL = 'https://kodinitools.com/alarmtool/'

export type Page = 'landing' | 'app'
type MetaLang = 'de' | 'en'

export interface PageMeta {
  title: string
  description: string
}

/** Router-Pfad je Seite. Die App endet auf „/“, weil der Build dort eine statische index.html ablegt. */
export const PAGE_PATHS: Record<Page, string> = {
  landing: '/',
  app: '/app/',
}

export const PAGE_META: Record<Page, Record<MetaLang, PageMeta>> = {
  // Deutsch steht zusätzlich statisch in index.html
  landing: {
    de: {
      title: 'Online Alarmton Generator – Töne erzeugen, gestalten & exportieren | KodiniTools',
      description:
        'Erstelle und gestalte individuelle Alarmtöne direkt im Browser. Mehrere Oszillatoren, Filter, ADSR-Hüllkurve und Aufnahmefunktion – kostenlos, ohne Installation.',
    },
    en: {
      title: 'Online Alarm Sound Generator – Create, Shape & Export Tones | KodiniTools',
      description:
        'Create and shape custom alarm sounds right in your browser. Multiple oscillators, filters, ADSR envelope and recording – free, no installation.',
    },
  },
  app: {
    de: {
      title: 'Alarmtool – Alarmton mit 12 Oszillatoren erstellen | KodiniTools',
      description:
        'Alarmton im Browser bauen: 12 Oszillatoren mit sechs Wellenformen, Hüllkurve, Rhythmusmuster, Filter und Aufnahme als WAV oder MP3. Kostenlos, ohne Installation.',
    },
    en: {
      title: 'Alarm Tool – Build an Alarm Sound with 12 Oscillators | KodiniTools',
      description:
        'Build an alarm sound in your browser: 12 oscillators with six waveforms, envelope, rhythm pattern, filter and recording as WAV or MP3. Free, no installation.',
    },
  },
}

/** Seite zu einem Router-Pfad ('/app', '/app/' → app); Unbekanntes gilt als Landing-Page. */
export function pageFromPath(path: string | null | undefined): Page {
  const trimmed = (path || '/').replace(/\/+$/, '')
  return trimmed === '/app' ? 'app' : 'landing'
}

/** Absolute URL einer Seite ohne Sprachparameter, z. B. https://kodinitools.com/alarmtool/app/ */
export function pageUrl(page: Page): string {
  return SITE_URL + PAGE_PATHS[page].slice(1)
}
