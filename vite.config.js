import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { PAGE_META, SITE_URL, pageUrl } from './src/lib/pageMeta'

const escapeHtml = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/**
 * Legt eine Kopie der gebauten index.html unter app/index.html ab. So liefert der
 * Webserver /alarmtool/app/ auch beim Neuladen oder Direktaufruf ohne Rewrite-Regel
 * aus (inkl. SSI-Includes). Canonical, hreflang, Titel und Beschreibung zeigen in der
 * Kopie auf die App-Seite; zur Laufzeit übernimmt settingsStore.
 */
function appPageCopy() {
  const appUrl = pageUrl('app')
  const meta = PAGE_META.app.de
  return {
    name: 'alarmtool-app-page-copy',
    enforce: 'post',
    apply: 'build',
    generateBundle(_options, bundle) {
      const index = bundle['index.html']
      if (!index || index.type !== 'asset') return
      const html = String(index.source)
        .replaceAll(`"${SITE_URL}"`, `"${appUrl}"`)
        .replaceAll(`"${SITE_URL}?lang=en"`, `"${appUrl}?lang=en"`)
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(meta.title)}</title>`)
        .replace(
          /(<meta\s+name="description"\s+content=")[^"]*(")/,
          `$1${escapeHtml(meta.description)}$2`
        )
      this.emitFile({ type: 'asset', fileName: 'app/index.html', source: html })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), appPageCopy()],
  
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
