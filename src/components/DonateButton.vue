<template>
  <div class="donate-container">
    <div class="donate-content">
      <p class="donate-text">{{ t('donate_message') }}</p>
      <form action="https://www.paypal.com/donate" method="post" target="_top" class="donate-form">
        <input type="hidden" name="hosted_button_id" value="8RGLGQ2BFMHU6" />
        <button type="submit" class="donate-button">
          <svg class="paypal-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 3.993-.028.15a.805.805 0 0 1-.793.68H8.25c-.45 0-.768-.422-.688-.857l.005-.025L9.8 7.217a.805.805 0 0 1 .793-.68h2.87c1.889 0 3.245.39 4.028 1.159.434.425.714.99.864 1.677.014.063.027.126.038.19.093.5.098.975.036 1.425-.024.17-.06.338-.104.503-.027.1-.061.2-.098.297z" fill="currentColor"/>
          </svg>
          <span>{{ t('donate_button_text') }}</span>
        </button>
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #0070ba;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.donate-button:hover {
  background: #005ea6;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.donate-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.paypal-icon {
  width: 24px;
  height: 24px;
}

@media (max-width: 768px) {
  .donate-container {
    padding: 1rem;
  }

  .donate-text {
    font-size: 0.9rem;
  }

  .donate-button {
    font-size: 0.9rem;
    padding: 0.65rem 1.25rem;
  }

  .paypal-icon {
    width: 20px;
    height: 20px;
  }
}
</style>
