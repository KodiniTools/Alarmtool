<template>
  <section class="osc-viz" data-theme="dark" :aria-label="t('scope_title')">
    <!--
      Visualizer der Oszillatoren: Canvas auf dunkler Fläche (data-theme="dark", auch im
      Light-Theme), leuchtende Kurven in Blau, Grün und Gelb. Gerechnet aus den Einstellungen
      (src/lib/oscillatorPreview.ts), daher reagiert er sofort auf jede Änderung. Während der
      Wiedergabe pulsieren die Kurven mit Hüllkurve und Muster, sonst „atmen“ sie leicht.
    -->
    <header class="osc-viz__head">
      <h3 class="osc-viz__title">
        <i class="fas fa-chart-area" aria-hidden="true"></i>
        {{ t('scope_title') }}
      </h3>
      <span class="osc-viz__meta">
        <span v-if="store.isPlaying" class="osc-viz__live">
          <span class="osc-viz__dot" aria-hidden="true"></span>
          {{ t('scope_live') }}
        </span>
        <span v-if="active.length" class="osc-viz__window">
          {{ formatMs(waveMs) }} · {{ formatMs(rhythmMs) }}
        </span>
      </span>
    </header>

    <p v-if="!active.length" class="osc-viz__empty">{{ t('scope_empty') }}</p>

    <template v-else>
      <GlowScope
        class="osc-viz__canvas"
        :voices="voices"
        :mode="mode"
        :current-time="store.currentTime"
        :label="ariaLabel"
      />

      <ul class="osc-viz__legend">
        <li v-for="voice in voices" :key="voice.id">
          <span class="osc-viz__swatch" :class="`osc-viz__swatch--${voice.color}`"></span>
          {{ voice.id + 1 }} · {{ WAVE_ABBR[voice.shape] }} · {{ Math.round(voice.frequency) }} Hz
        </li>
        <li>
          <span class="osc-viz__swatch osc-viz__swatch--mix"></span>
          {{ t('scope_mix') }}
        </li>
      </ul>
    </template>
  </section>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useAlarmStore } from '@/stores/alarmStore'
  import { useI18n } from '@/i18n'
  import { WAVE_ABBR } from '@/lib/waveforms'
  import {
    rhythmWindowMs,
    toShape,
    waveWindowMs,
    type PreviewOscillator,
  } from '@/lib/oscillatorPreview'
  import GlowScope, { type ScopeVoice, type VoiceColor } from './GlowScope.vue'

  const store = useAlarmStore()
  const { t } = useI18n()

  /** Stimmfarben im Wechsel; die Summe ist gelb. */
  const VOICE_COLORS: readonly VoiceColor[] = ['blue', 'green']

  const voices = computed<ScopeVoice[]>(() =>
    store.oscillators
      .map((o, id) => ({ ...(o as PreviewOscillator), id, shape: toShape(o.waveType) }))
      .filter((o) => o.enabled)
      .map((o, i) => ({ ...o, color: VOICE_COLORS[i % VOICE_COLORS.length] }))
  )
  const active = voices
  const waveMs = computed(() => waveWindowMs(voices.value))
  const rhythmMs = computed(() => rhythmWindowMs(voices.value))
  const mode = computed(() => (store.isPaused ? 'paused' : store.isPlaying ? 'playing' : 'idle'))

  const ariaLabel = computed(
    () =>
      `${t('scope_title')}: ${voices.value
        .map((v) => `${v.id + 1} ${WAVE_ABBR[v.shape]} ${Math.round(v.frequency)} Hz`)
        .join(', ')}`
  )

  function formatMs(ms: number): string {
    return ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${ms.toFixed(ms < 10 ? 1 : 0)} ms`
  }
</script>
