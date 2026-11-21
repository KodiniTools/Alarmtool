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
  // Deutsch (Landing) steht zusätzlich statisch in index.html; tests/localizedHtml.spec.ts
  // prüft, dass beide übereinstimmen.
  landing: {
    de: {
      title: 'Alarmton-Generator online – Alarmton erstellen | KodiniTools',
      description:
        'Eigenen Alarmton im Browser bauen: 12 Oszillatoren, 6 Wellenformen, ADSR-Hüllkurve, Filter und 14 Presets. Als WAV oder MP3 speichern. Kostenlos, ohne Anmeldung.',
    },
    en: {
      title: 'Alarm Sound Generator Online – Create Alarm Tones | KodiniTools',
      description:
        'Build your own alarm sound in the browser: 12 oscillators, 6 waveforms, ADSR envelope, filter and 14 presets. Save as WAV or MP3. Free, no sign-up.',
    },
  },
  app: {
    de: {
      title: 'Alarmtool – Alarmton mit 12 Oszillatoren erstellen | KodiniTools',
      description:
        'Alarmton im Browser bauen: 12 Oszillatoren mit sechs Wellenformen, Hüllkurve, Rhythmusmuster, Filter und Aufnahme als WAV oder MP3. Kostenlos, ohne Installation.',
    },
    en: {
      title: 'Alarm Tool – Build Alarm Sounds with 12 Oscillators | KodiniTools',
      description:
        'Build an alarm sound in your browser: 12 oscillators with six waveforms, envelope, rhythm pattern, filter and recording as WAV or MP3. Free, no installation.',
    },
  },
}

/** Sprachabhängige Angaben, die für beide Seiten gleich sind (Keywords, Vorschaubild, JSON-LD). */
export interface SiteMeta {
  keywords: string
  /** Dateiname des Vorschaubilds (1200 × 630) unter SITE_URL, liegt in public/. */
  image: string
  imageAlt: string
  appName: string
  appDescription: string
  browserRequirements: string
  featureList: string[]
}

export const SITE_META: Record<MetaLang, SiteMeta> = {
  de: {
    keywords:
      'Alarmton Generator, Alarmton erstellen, Sirene erzeugen, Online Synthesizer, Oszillator, ADSR-Hüllkurve, Weckton, Klingelton erstellen, WAV, MP3, kostenlos',
    image: 'og-image.png',
    imageAlt:
      'Startseite des Alarmtools: „Bau deinen eigenen Alarmton aus bis zu 12 Oszillatoren“ mit Vorschau der Oszillatoren',
    appName: 'Alarmtool – Online Alarmton-Generator',
    appDescription:
      'Alarmtöne direkt im Browser bauen: bis zu 12 Oszillatoren mit 6 Wellenformen, ADSR-Hüllkurve, Rhythmusmuster und globalem Filter. Aufnahme und Export als WAV oder MP3.',
    browserRequirements: 'Aktueller Browser mit Web Audio API (Chrome, Firefox, Safari, Edge)',
    featureList: [
      '12 Oszillatoren gleichzeitig',
      '6 Wellenformen: Sinus, Rechteck, Sägezahn, Dreieck, Puls und Orgel',
      'Frequenz, Lautstärke und Stereo-Panorama je Oszillator',
      'ADSR-Hüllkurve je Oszillator',
      'Rhythmusmuster aus An- und Aus-Zeiten in Millisekunden',
      'Globaler Filter: Tiefpass, Hochpass, Bandpass oder Notch',
      '14 fertige Alarm-Presets',
      'Live-Vorschau der Wellenformen',
      'Aufnahme als WebM, OGG oder WAV, Umwandlung in MP3 oder WAV',
      'Rückgängig und Wiederholen',
      'Einstellungen speichern, als JSON exportieren und importieren',
      'Deutsch und Englisch, heller und dunkler Modus',
      'Kostenlos, ohne Anmeldung, Klang entsteht lokal im Browser',
    ],
  },
  en: {
    keywords:
      'alarm sound generator, create alarm tone, siren generator, online synthesizer, oscillator, ADSR envelope, wake-up tone, ringtone maker, WAV, MP3, free',
    image: 'og-image-en.png',
    imageAlt:
      'Alarm Tool start page: “Build your own alarm sound from up to 12 oscillators” with a preview of the oscillators',
    appName: 'Alarm Tool – Online Alarm Sound Generator',
    appDescription:
      'Build alarm sounds right in your browser: up to 12 oscillators with 6 waveforms, ADSR envelope, rhythm pattern and global filter. Record and export as WAV or MP3.',
    browserRequirements: 'Current browser with Web Audio API (Chrome, Firefox, Safari, Edge)',
    featureList: [
      '12 simultaneous oscillators',
      '6 waveforms: sine, square, sawtooth, triangle, pulse and organ',
      'Frequency, volume and stereo pan per oscillator',
      'ADSR envelope per oscillator',
      'Rhythm pattern from on and off times in milliseconds',
      'Global filter: low-pass, high-pass, band-pass or notch',
      '14 ready-made alarm presets',
      'Live preview of the waveforms',
      'Recording as WebM, OGG or WAV, conversion to MP3 or WAV',
      'Undo and redo',
      'Save settings, export and import as JSON',
      'German and English, light and dark mode',
      'Free, no sign-up, sound is generated locally in the browser',
    ],
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
