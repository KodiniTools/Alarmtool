<template>
  <section class="lp-hero">
    <div class="lp-wrap">
      <div class="lp-hero__text">
        <p class="lp-eyebrow">{{ t('lp_eyebrow') }}</p>
        <h1 class="lp-title">{{ t('lp_title') }}</h1>
        <p class="lp-lead">{{ t('lp_lead') }}</p>
        <div class="lp-actions">
          <UiButton :to="PAGE_PATHS.app" variant="primary" class="lp-cta">
            {{ t('lp_cta_start') }} <i class="fas fa-arrow-right" aria-hidden="true"></i>
          </UiButton>
          <UiButton :to="{ hash: '#funktionen' }" class="lp-cta">
            {{ t('lp_cta_learn') }}
          </UiButton>
        </div>
        <ul class="lp-trust">
          <li v-for="key in TRUST" :key="key">
            <i class="fas fa-check" aria-hidden="true"></i>
            {{ t(`lp_trust_${key}`) }}
          </li>
        </ul>
      </div>

      <HeroOscillators class="lp-hero__visual" />
    </div>
  </section>
</template>

<script setup lang="ts">
  import { useI18n } from '@/i18n'
  import { PAGE_PATHS } from '@/lib/pageMeta'
  import { UiButton } from '@/components/ui'
  import HeroOscillators from './HeroOscillators.vue'

  const { t } = useI18n()

  const TRUST = ['free', 'account', 'local'] as const
</script>
