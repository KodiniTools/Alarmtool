<template>
  <!--
    Live-Vorschau der Oszillatoren: wird bei jeder Änderung neu aus den Einstellungen
    gerechnet (src/lib/oscillatorPreview.ts), auch ohne Wiedergabe. Oben die Wellenform
    der Summe, unten die Lautstärke über den Rhythmus mit Abspielposition.
  -->
  <section class="osc-scope" :aria-label="t('scope_title')">
    <header class="osc-scope__head">
      <h3 class="osc-scope__title">
        <i class="fas fa-chart-area" aria-hidden="true"></i>
        {{ t('scope_title') }}
      </h3>
      <span v-if="store.isPlaying" class="osc-scope__live">
        <span class="osc-scope__dot" aria-hidden="true"></span>
        {{ t('scope_live') }}
      </span>
    </header>

    <p v-if="!active.length" class="osc-scope__empty">{{ t('scope_empty') }}</p>

    <template v-else>
      <div class="osc-scope__view">
        <div class="osc-scope__label">
          <span>{{ t('scope_wave') }}</span>
          <span class="osc-scope__meta">{{ formatMs(waveMs) }}</span>
        </div>
        <svg
          class="osc-scope__lane osc-scope__lane--wave"
          :viewBox="`0 0 ${W} ${WAVE_H}`"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line class="osc-scope__axis" x1="0" :y1="WAVE_H / 2" :x2="W" :y2="WAVE_H / 2" />
          <path
            v-for="layer in waveLayers"
            :key="layer.id"
            class="osc-scope__layer"
            :class="`osc-wave-chip--${layer.shape}`"
            :d="layer.d"
          />
          <path class="osc-scope__mix" :d="mixD" />
        </svg>
      </div>

      <div class="osc-scope__view">
        <div class="osc-scope__label">
          <span>{{ t('scope_rhythm') }}</span>
          <span class="osc-scope__meta">{{ formatMs(rhythmMs) }}</span>
        </div>
        <svg
          class="osc-scope__lane osc-scope__lane--rhythm"
          :viewBox="`0 0 ${W} ${RHYTHM_H}`"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path class="osc-scope__area" :d="sumAreaD" />
          <path
            v-for="layer in envelopeLayers"
            :key="layer.id"
            class="osc-scope__layer"
            :class="`osc-wave-chip--${layer.shape}`"
            :d="layer.d"
          />
          <line
            v-if="playheadX !== null"
            class="osc-scope__playhead"
            :x1="playheadX"
            y1="0"
            :x2="playheadX"
            :y2="RHYTHM_H"
          />
        </svg>
      </div>

      <ul class="osc-scope__legend">
        <li v-for="osc in active" :key="osc.id">
          <span class="osc-scope__swatch" :class="`osc-wave-chip--${osc.shape}`"></span>
          {{ osc.id + 1 }} · {{ WAVE_ABBR[osc.shape] }} · {{ Math.round(osc.frequency) }} Hz
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
    envelopeSamples,
    mixSamples,
    rhythmWindowMs,
    sampleCount,
    toShape,
    valuesToPath,
    waveSamples,
    waveWindowMs,
    type PreviewOscillator,
  } from '@/lib/oscillatorPreview'

  const store = useAlarmStore()
  const { t } = useI18n()

  const W = 1000
  const WAVE_H = 140
  const RHYTHM_H = 64
  const RHYTHM_SAMPLES = 500

  /** Aktive Oszillatoren mit ihrer Nummer (Index) und Wellenform. */
  const active = computed(() =>
    store.oscillators
      .map((o, id) => ({ ...(o as PreviewOscillator), id, shape: toShape(o.waveType) }))
      .filter((o) => o.enabled)
  )

  const waveMs = computed(() => waveWindowMs(active.value))
  const rhythmMs = computed(() => rhythmWindowMs(active.value))
  /** Summe der Lautstärken füllt die halbe Höhe; mindestens 1, damit leise Klänge klein bleiben. */
  const scale = computed(() =>
    Math.max(
      1,
      active.value.reduce((sum, o) => sum + Math.max(0, o.volume), 0)
    )
  )

  const waveLayers = computed(() => {
    const n = sampleCount(active.value, waveMs.value)
    return active.value.map((o) => ({
      id: o.id,
      shape: o.shape,
      d: valuesToPath(
        waveSamples(o, waveMs.value, n).map((v) => v * o.volume),
        W,
        WAVE_H,
        scale.value
      ),
    }))
  })

  const mixD = computed(() => {
    const n = sampleCount(active.value, waveMs.value)
    return valuesToPath(mixSamples(active.value, waveMs.value, n), W, WAVE_H, scale.value)
  })

  const envelopes = computed(() =>
    active.value.map((o) => ({
      id: o.id,
      shape: o.shape,
      values: envelopeSamples(o, rhythmMs.value, RHYTHM_SAMPLES),
    }))
  )

  const envelopeLayers = computed(() =>
    envelopes.value.map((e) => ({
      id: e.id,
      shape: e.shape,
      d: valuesToPath(e.values, W, RHYTHM_H, scale.value, 'bottom'),
    }))
  )

  const sumAreaD = computed(() => {
    const sum = new Array<number>(RHYTHM_SAMPLES).fill(0)
    for (const e of envelopes.value) e.values.forEach((v, i) => (sum[i] += v))
    const line = valuesToPath(sum, W, RHYTHM_H, scale.value, 'bottom')
    return `${line} L${W},${RHYTHM_H} L0,${RHYTHM_H} Z`
  })

  /** Abspielposition im Rhythmusfenster, nur während der Wiedergabe. */
  const playheadX = computed(() => {
    if (!store.isPlaying || rhythmMs.value <= 0) return null
    return ((store.currentTime % rhythmMs.value) / rhythmMs.value) * W
  })

  function formatMs(ms: number): string {
    return ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${ms.toFixed(ms < 10 ? 1 : 0)} ms`
  }
</script>
