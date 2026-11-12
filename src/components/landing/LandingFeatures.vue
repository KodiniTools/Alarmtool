<template>
  <section id="funktionen" class="lp-section">
    <div class="lp-wrap">
      <div class="lp-section__head">
        <h2>{{ t('lp_features_title') }}</h2>
        <p>{{ t('lp_features_lead') }}</p>
      </div>
      <ul class="lp-features">
        <li v-for="f in FEATURES" :key="f.key" class="lp-feature">
          <span class="lp-feature__icon" aria-hidden="true"><i :class="f.icon"></i></span>
          <h3>{{ t(`lp_feat_${f.key}_title`) }}</h3>
          <p>{{ t(`lp_feat_${f.key}_desc`) }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { useI18n } from '@/i18n'

  const { t } = useI18n()

  const FEATURES = [
    { key: 'osc', icon: 'fas fa-wave-square' },
    { key: 'env', icon: 'fas fa-chart-line' },
    { key: 'filter', icon: 'fas fa-filter' },
    { key: 'rec', icon: 'fas fa-microphone' },
    { key: 'presets', icon: 'fas fa-music' },
    { key: 'history', icon: 'fas fa-save' },
  ] as const
</script>
