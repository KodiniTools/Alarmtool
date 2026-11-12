<template>
  <div class="landing-page">
    <LandingHero />
    <LandingFacts />
    <LandingFeatures />
    <LandingSteps />
    <LandingCta />
  </div>
</template>

<script setup lang="ts">
  // Abschnitte in components/landing/, Styles in styles/components/landing.css
  import LandingHero from '@/components/landing/LandingHero.vue'
  import LandingFacts from '@/components/landing/LandingFacts.vue'
  import LandingFeatures from '@/components/landing/LandingFeatures.vue'
  import LandingSteps from '@/components/landing/LandingSteps.vue'
  import LandingCta from '@/components/landing/LandingCta.vue'
</script>
