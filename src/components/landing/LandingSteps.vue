<template>
  <section class="lp-section lp-section--alt">
    <div class="lp-wrap">
      <div class="lp-section__head">
        <h2>{{ t('lp_steps_title') }}</h2>
      </div>
      <ol class="lp-steps">
        <li v-for="n in 3" :key="n" class="lp-step">
          <span class="lp-step__num" aria-hidden="true">{{ n }}</span>
          <h3>{{ t(`lp_step${n}_title`) }}</h3>
          <p>{{ t(`lp_step${n}_desc`) }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { useI18n } from '@/i18n'

  const { t } = useI18n()
</script>
