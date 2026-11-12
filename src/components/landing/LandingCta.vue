<template>
  <section class="lp-section">
    <div class="lp-wrap">
      <div class="lp-final">
        <h2>{{ t('lp_final_title') }}</h2>
        <p>{{ t('lp_final_desc') }}</p>
        <UiButton :to="PAGE_PATHS.app" variant="primary" class="lp-cta">
          {{ t('lp_cta_start') }} <i class="fas fa-arrow-right" aria-hidden="true"></i>
        </UiButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { useI18n } from '@/i18n'
  import { PAGE_PATHS } from '@/lib/pageMeta'
  import { UiButton } from '@/components/ui'

  const { t } = useI18n()
</script>
