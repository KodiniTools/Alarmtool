<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-links">
        <a href="/impressum">Impressum</a>
        <a href="/datenschutz">Datenschutz</a>
        <button class="cookie-settings-btn" @click="$emit('openCookieSettings')">
          Cookie-Einstellungen
        </button>
      </div>
      <div class="footer-copyright">
        &copy; {{ currentYear }} Alarm Tool
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

defineEmits(['openCookieSettings'])

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.app-footer {
  background-color: var(--bg-secondary, #1a1a2e);
  color: var(--text-secondary, #b0b0b0);
  padding: 1.5rem;
  margin-top: 2rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.footer-links a,
.cookie-settings-btn {
  color: var(--text-secondary, #b0b0b0);
  text-decoration: none;
  transition: color 0.2s;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
}

.footer-links a:hover,
.cookie-settings-btn:hover {
  color: var(--primary-color, #4a9eff);
}

.footer-copyright {
  font-size: 0.85rem;
}
</style>
