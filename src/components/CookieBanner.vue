<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="showBanner || showSettings" class="cookie-overlay">
        <div class="cookie-banner" :class="{ 'settings-mode': showSettings }">
          <div v-if="!showSettings" class="banner-content">
            <h3>Cookie-Einstellungen</h3>
            <p>
              Wir verwenden Cookies, um Ihre Erfahrung zu verbessern.
              Sie können wählen, welche Cookies Sie akzeptieren möchten.
            </p>
            <div class="banner-actions">
              <button class="btn btn-secondary" @click="openSettings">
                Einstellungen
              </button>
              <button class="btn btn-primary" @click="acceptAll">
                Alle akzeptieren
              </button>
            </div>
          </div>

          <div v-else class="settings-content">
            <h3>Cookie-Einstellungen</h3>
            <div class="cookie-options">
              <div class="cookie-option">
                <label>
                  <input type="checkbox" checked disabled />
                  <span>Notwendige Cookies</span>
                </label>
                <p>Diese Cookies sind für die Grundfunktionen erforderlich.</p>
              </div>
              <div class="cookie-option">
                <label>
                  <input type="checkbox" v-model="analyticsEnabled" />
                  <span>Analyse-Cookies</span>
                </label>
                <p>Helfen uns, die Nutzung der Website zu verstehen.</p>
              </div>
              <div class="cookie-option">
                <label>
                  <input type="checkbox" v-model="marketingEnabled" />
                  <span>Marketing-Cookies</span>
                </label>
                <p>Werden für personalisierte Werbung verwendet.</p>
              </div>
            </div>
            <div class="settings-actions">
              <button class="btn btn-secondary" @click="saveSettings">
                Auswahl speichern
              </button>
              <button class="btn btn-primary" @click="acceptAll">
                Alle akzeptieren
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showBanner = ref(false)
const showSettings = ref(false)
const analyticsEnabled = ref(false)
const marketingEnabled = ref(false)

const COOKIE_CONSENT_KEY = 'cookie_consent'

onMounted(() => {
  const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
  if (!consent) {
    showBanner.value = true
  } else {
    const settings = JSON.parse(consent)
    analyticsEnabled.value = settings.analytics
    marketingEnabled.value = settings.marketing
  }
})

const openSettings = () => {
  showBanner.value = false
  showSettings.value = true
}

const saveSettings = () => {
  const settings = {
    necessary: true,
    analytics: analyticsEnabled.value,
    marketing: marketingEnabled.value,
    timestamp: new Date().toISOString()
  }
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(settings))
  showSettings.value = false
  showBanner.value = false
}

const acceptAll = () => {
  analyticsEnabled.value = true
  marketingEnabled.value = true
  saveSettings()
}

defineExpose({
  openSettings
})
</script>

<style scoped>
.cookie-overlay {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.5);
}

.cookie-banner {
  max-width: 600px;
  margin: 0 auto;
  background: var(--bg-primary, #0f0f23);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
}

.cookie-banner.settings-mode {
  max-width: 500px;
}

h3 {
  margin: 0 0 1rem 0;
  color: var(--text-primary, #ffffff);
}

p {
  color: var(--text-secondary, #b0b0b0);
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
}

.banner-actions,
.settings-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--primary-color, #4a9eff);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-hover, #3a8eef);
}

.btn-secondary {
  background: var(--bg-secondary, #1a1a2e);
  color: var(--text-primary, #ffffff);
}

.btn-secondary:hover {
  background: var(--bg-tertiary, #2a2a3e);
}

.cookie-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.cookie-option label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-primary, #ffffff);
  cursor: pointer;
}

.cookie-option p {
  margin: 0.25rem 0 0 1.5rem;
  font-size: 0.8rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
