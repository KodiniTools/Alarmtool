import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  
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
