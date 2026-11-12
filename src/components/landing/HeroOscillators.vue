<template>
  <figure class="lp-visual" data-theme="dark" role="img" :aria-label="t('lp_visual_label')">
    <!--
      Großes Hero-Bild: derselbe leuchtende Visualizer wie in der App (GlowScope), hier mit
      einer Beispiel-Sirene in Dauerschleife. Dunkle Fläche in beiden Themes (data-theme="dark").
    -->
    <div class="lp-visual__head" aria-hidden="true">
      <span class="lp-visual__title">
        <i class="fas fa-wave-square"></i>
        {{ t('lp_visual_title') }}
      </span>
      <span class="lp-visual__status">
        <span class="lp-visual__dot"></span>
        {{ t('scope_live') }}
      </span>
      <span class="lp-visual__badge">{{ t('lp_visual_active') }}</span>
    </div>

    <div class="lp-visual__body" aria-hidden="true">
      <ul class="lp-osc-list">
        <li
          v-for="osc in OSCILLATORS"
          :key="osc.id"
          class="lp-osc"
          :class="{ 'lp-osc--off': !osc.enabled }"
        >
          <span class="lp-osc__switch"></span>
          <span class="lp-osc__name">OSC {{ osc.id + 1 }}</span>
          <span class="lp-osc__chip" :class="`osc-wave-chip--${osc.shape}`">
            {{ WAVE_ABBR[osc.shape] }}
          </span>
          <span class="lp-osc__freq">
            {{ osc.enabled ? `${osc.frequency} Hz` : t('lp_visual_off') }}
          </span>
          <span
            v-if="osc.enabled"
            class="lp-osc__swatch"
            :class="`osc-viz__swatch--${osc.color}`"
          ></span>
        </li>
        <li class="lp-osc lp-osc--more">{{ t('lp_visual_more') }}</li>
        <li class="lp-osc lp-osc--mix">
          <span class="lp-osc__name">{{ t('lp_visual_mix') }}</span>
          <span class="lp-osc__swatch osc-viz__swatch--mix"></span>
        </li>
      </ul>

      <GlowScope
        class="lp-visual__scope"
        :voices="voices"
        mode="playing"
        self-clock
        :start-offset="250"
        :zoom="1.8"
      />
    </div>
  </figure>
</template>

<script setup lang="ts">
  import { useI18n } from '@/i18n'
  import { WAVE_ABBR } from '@/lib/waveforms'
  import GlowScope, { type ScopeVoice } from '@/components/oscillator/GlowScope.vue'

  const { t } = useI18n()

  const BASE = { attack: 20, decay: 60, sustain: 0.85, release: 80 }

  // Beispiel-Sirene: vier Stimmen im Verhältnis 1 : 2 : 3 : 4 mit versetzten Mustern, damit
  // der Klang pulsiert, aber nie ganz verstummt. Eine fünfte Stimme ist ausgeschaltet.
  const OSCILLATORS: ScopeVoice[] = [
    { id: 0, shape: 'sine', waveType: 'sine', frequency: 660, volume: 0.4, pattern: '300,150' },
    { id: 1, shape: 'square', waveType: 'square', frequency: 880, volume: 0.12, pattern: '150,75' },
    {
      id: 2,
      shape: 'sawtooth',
      waveType: 'sawtooth',
      frequency: 220,
      volume: 0.2,
      pattern: '600,100',
    },
    {
      id: 3,
      shape: 'triangle',
      waveType: 'triangle',
      frequency: 440,
      volume: 0.28,
      pattern: '450,50',
    },
    { id: 4, shape: 'pulse', waveType: 'pulse', frequency: 330, volume: 0.4, pattern: '300,150' },
  ].map((o, i) => ({
    ...BASE,
    ...o,
    enabled: i < 4,
    color: i % 2 === 0 ? 'blue' : 'green',
  })) as ScopeVoice[]

  const voices = OSCILLATORS.filter((o) => o.enabled)
</script>
