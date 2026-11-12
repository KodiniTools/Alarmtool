<template>
  <section class="lp-facts">
    <dl class="lp-wrap lp-facts__grid">
      <div v-for="fact in facts" :key="fact.key" class="lp-fact">
        <dt>{{ fact.value }}</dt>
        <dd>{{ t(fact.key) }}</dd>
      </div>
    </dl>
  </section>
</template>

<script setup lang="ts">
  import { useI18n } from '@/i18n'
  import { OSCILLATOR_COUNT } from '@/lib/oscillatorDefaults'
  import { WAVE_TYPES } from '@/lib/waveforms'
  import { PRESETS } from '@/data/presets'

  const { t } = useI18n()

  // Aus der echten Konfiguration abgeleitet, damit die Zahlen nicht veralten
  const facts = [
    { key: 'lp_fact_oscillators', value: OSCILLATOR_COUNT },
    { key: 'lp_fact_waveforms', value: WAVE_TYPES.length },
    { key: 'lp_fact_presets', value: PRESETS.length },
    { key: 'lp_fact_uploads', value: 0 },
  ]
</script>
