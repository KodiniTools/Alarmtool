<template>
  <div>
    <h2>{{ t('osc_title') }}</h2>
    <div class="oscillators-grid">
      <OscillatorItem
        v-for="(osc, index) in store.oscillators"
        :key="index"
        :oscillator-id="index"
        :oscillator="osc"
      />
    </div>
  </div>
</template>

<script setup>
import { useAlarmStore } from '@/stores/alarmStore'
import { translations } from '@/i18n/translations'
import OscillatorItem from './OscillatorItem.vue'

const store = useAlarmStore()

const t = (key) => translations[store.currentLang]?.[key] || key
</script>
