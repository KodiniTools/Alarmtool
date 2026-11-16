import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { localizeIndexHtml, localizedFileName } from './src/lib/localizedHtml'

/** Zusätzlich zur deutschen Landing-Seite (index.html) erzeugte Fassungen. */
const LOCALIZED_PAGES = [
  { page: 'landing', lang: 'en' },
  { page: 'app', lang: 'de' },
  { page: 'app', lang: 'en' },
]

/**
 * Legt statische Fassungen der gebauten index.html ab:
 * - app/index.html: /alarmtool/app/ funktioniert beim Neuladen oder Direktaufruf ohne
 *   Rewrite-Regel (inkl. SSI-Includes).
 * - index.en.html, app/index.en.html: englischer Head (lang, Titel, Beschreibung,
 *   Canonical) für ?lang=en; der Webserver liefert sie per nginx-Regel aus (DEPLOY.md).
 * Zur Laufzeit übernimmt settingsStore den Head.
 */
function localizedPageCopies() {
  return {
    name: 'alarmtool-localized-page-copies',
    enforce: 'post',
    apply: 'build',
    generateBundle(_options, bundle) {
      const index = bundle['index.html']
      if (!index || index.type !== 'asset') return
      const source = String(index.source)
      for (const { page, lang } of LOCALIZED_PAGES) {
        this.emitFile({
          type: 'asset',
          fileName: localizedFileName(page, lang),
          source: localizeIndexHtml(source, page, lang),
        })
      }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), localizedPageCopies()],
  
  // WICHTIG: Base-Path für das Deployment unter /alarmtool/
  // Dies stellt sicher, dass alle Assets korrekt geladen werden
  base: '/alarmtool/',
  
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  
  // Build-Konfiguration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    
    // Source Maps für einfacheres Debugging (optional, in Production ausschalten)
    sourcemap: false,
    
    // Chunk-Größen-Warnung
    chunkSizeWarningLimit: 1000,
    
    // Optimierte Rollup-Optionen
    rollupOptions: {
      output: {
        // Automatische Chunk-Aufteilung für besseres Caching
        manualChunks(id) {
          // Vue in separatem Chunk
          if (id.includes('node_modules/vue')) {
            return 'vendor-vue';
          }
          // Andere node_modules in vendor chunk
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
  
  // Development Server Konfiguration
  server: {
    port: 5173,
    host: true,
    open: true
  },
  
  // Preview Server (für lokales Testen des Production Builds)
  preview: {
    port: 4173,
    host: true
  }
})
