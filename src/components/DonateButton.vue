<template>
  <div class="donate-container">
    <div class="donate-content">
      <p class="donate-text">{{ t('donate_message') }}</p>
      <form action="https://www.paypal.com/donate" method="post" target="_top" class="donate-form">
        <input type="hidden" name="hosted_button_id" value="8RGLGQ2BFMHU6" />
        <input
          type="image"
          src="https://www.paypalobjects.com/de_DE/CH/i/btn/btn_donate_LG.gif"
          border="0"
          name="submit"
          title="PayPal - The safer, easier way to pay online!"
          alt="Spenden mit dem PayPal-Button"
          class="donate-button"
        />
        <img alt="" border="0" src="https://www.paypal.com/de_CH/i/scr/pixel.gif" width="1" height="1" />
      </form>
    </div>
  </div>
</template>

<script setup>
import { useAlarmStore } from '@/stores/alarmStore'
import { translations } from '@/i18n/translations'

const store = useAlarmStore()

// Translation helper
const t = (key) => {
  return translations[store.currentLang]?.[key] || key
}
</script>

<style scoped>
.donate-container {
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.donate-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.donate-text {
  margin: 0;
  color: var(--text-primary);
  text-align: center;
  font-size: 0.95rem;
}

.donate-form {
  display: flex;
  justify-content: center;
}

.donate-button {
  cursor: pointer;
  transition: opacity 0.2s;
}

.donate-button:hover {
  opacity: 0.8;
}

@media (max-width: 768px) {
  .donate-container {
    padding: 1rem;
  }

  .donate-text {
    font-size: 0.9rem;
  }
}
</style>
