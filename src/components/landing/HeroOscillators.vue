<template>
  <!--
    Großes Hero-Bild: nachgebaute Oszillator-Ansicht als SVG/HTML, keine Bilddatei.
    Farben je Wellenform aus denselben Klassen wie in der App (osc-wave-chip--*).
  -->
  <figure class="lp-visual" role="img" :aria-label="t('lp_visual_label')">
    <div class="lp-visual__head" aria-hidden="true">
      <span class="lp-visual__title">
        <i class="fas fa-wave-square"></i>
        {{ t('lp_visual_title') }}
      </span>
      <span class="lp-visual__badge">{{ t('lp_visual_active') }}</span>
    </div>

    <div class="lp-visual__rows" aria-hidden="true">
      <div
        v-for="osc in rows"
        :key="osc.id"
        class="lp-osc"
        :class="{ 'lp-osc--off': !osc.on }"
        :data-wave="osc.shape"
      >
        <div class="lp-osc__meta">
          <span class="lp-osc__switch"></span>
          <span class="lp-osc__name">OSC {{ osc.id }}</span>
          <span class="lp-osc__chip" :class="`osc-wave-chip--${osc.shape}`">
            {{ WAVE_ABBR[osc.shape] }}
          </span>
          <span class="lp-osc__freq">{{ osc.on ? `${osc.freq} Hz` : t('lp_visual_off') }}</span>
        </div>
        <svg
          class="lp-osc__lane"
          :class="`osc-wave-chip--${osc.shape}`"
          :viewBox="`0 0 ${LANE_W} ${LANE_H}`"
          preserveAspectRatio="none"
        >
          <line class="lp-axis" x1="0" :y1="LANE_H / 2" :x2="LANE_W" :y2="LANE_H / 2" />
          <path class="lp-wave" :d="osc.path" />
        </svg>
      </div>

      <p class="lp-visual__more">{{ t('lp_visual_more') }}</p>

      <div class="lp-osc lp-osc--mix">
        <div class="lp-osc__meta">
          <span class="lp-osc__name lp-osc__name--mix">
            <i class="fas fa-plus"></i>
            {{ t('lp_visual_mix') }}
          </span>
          <span class="lp-osc__hint">{{ t('lp_visual_mix_hint') }}</span>
        </div>
        <svg class="lp-osc__lane" :viewBox="`0 0 ${LANE_W} ${MIX_H}`" preserveAspectRatio="none">
          <rect
            v-for="(seg, i) in segments"
            :key="i"
            class="lp-gate"
            :x="seg.start * LANE_W"
            y="0"
            :width="(seg.end - seg.start) * LANE_W"
            :height="MIX_H"
          />
          <line class="lp-axis" x1="0" :y1="MIX_H / 2" :x2="LANE_W" :y2="MIX_H / 2" />
          <path class="lp-wave lp-wave--mix" :d="mix" />
        </svg>
      </div>
    </div>
  </figure>
</template>

<script setup lang="ts">
  import { useI18n } from '@/i18n'
  import { WAVE_ABBR } from '@/lib/waveforms'
  import {
    mixPath,
    patternEnvelope,
    patternSegments,
    wavePath,
    type WaveLayer,
    type WaveShape,
  } from '@/lib/waveShapes'

  const { t } = useI18n()

  const LANE_W = 600
  const LANE_H = 44
  const MIX_H = 120

  // Beispielklang: vier Oszillatoren im Verhältnis 1 : 2 : 3 : 4, Muster 300 ms an, 150 ms aus
  const OSCILLATORS: ReadonlyArray<{ id: number; shape: WaveShape; freq: number; on: boolean }> = [
    { id: 1, shape: 'sine', freq: 660, on: true },
    { id: 2, shape: 'square', freq: 880, on: true },
    { id: 3, shape: 'sawtooth', freq: 220, on: true },
    { id: 4, shape: 'triangle', freq: 440, on: true },
    { id: 5, shape: 'pulse', freq: 330, on: false },
  ]
  const GAIN: Record<number, number> = { 1: 0.55, 2: 0.2, 3: 0.3, 4: 0.4 }
  const PATTERN = [300, 150] as const
  const TOTAL_MS = 1350

  // Perioden je Spur proportional zur Frequenz, damit die Bilder zueinander passen
  const lanePeriods = (freq: number) => freq / 110
  const mixPeriods = (freq: number) => freq / 40

  const rows = OSCILLATORS.map((o) => ({
    ...o,
    path: o.on
      ? wavePath(o.shape, lanePeriods(o.freq), { width: LANE_W, height: LANE_H, samples: 600 })
      : `M0,${LANE_H / 2} L${LANE_W},${LANE_H / 2}`,
  }))

  const layers: WaveLayer[] = OSCILLATORS.filter((o) => o.on).map((o) => ({
    shape: o.shape,
    cycles: mixPeriods(o.freq),
    gain: GAIN[o.id] ?? 0,
  }))

  const mix = mixPath(layers, {
    width: LANE_W,
    height: MIX_H,
    samples: 1200,
    amplitude: 0.85,
    envelope: patternEnvelope(PATTERN, TOTAL_MS, 40),
  })
  const segments = patternSegments(PATTERN, TOTAL_MS)
</script>
