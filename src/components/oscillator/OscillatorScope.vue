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
      <canvas ref="canvasEl" class="osc-viz__canvas" role="img" :aria-label="ariaLabel"></canvas>

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
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
  import { useAlarmStore } from '@/stores/alarmStore'
  import { useI18n } from '@/i18n'
  import { WAVE_ABBR } from '@/lib/waveforms'
  import {
    envelopeAt,
    envelopeSamples,
    rhythmWindowMs,
    sampleCount,
    toShape,
    waveWindowMs,
    type PreviewOscillator,
  } from '@/lib/oscillatorPreview'
  import { waveValue } from '@/lib/waveShapes'

  const store = useAlarmStore()
  const { t } = useI18n()

  /** Stimmfarben im Wechsel; die Summe ist gelb. */
  const VOICE_COLORS = ['blue', 'green'] as const
  type VoiceColor = (typeof VOICE_COLORS)[number]
  const COLOR_TOKENS = {
    blue: '--ds-info',
    green: '--ds-success',
    yellow: '--ds-warning',
    core: '--ds-text',
    grid: '--ds-border',
  } as const

  const voices = computed(() =>
    store.oscillators
      .map((o, id) => ({ ...(o as PreviewOscillator), id, shape: toShape(o.waveType) }))
      .filter((o) => o.enabled)
      .map((o, i) => ({ ...o, color: VOICE_COLORS[i % VOICE_COLORS.length] as VoiceColor }))
  )
  const active = voices
  const waveMs = computed(() => waveWindowMs(voices.value))
  const rhythmMs = computed(() => rhythmWindowMs(voices.value))
  const scale = computed(() =>
    Math.max(
      1,
      voices.value.reduce((sum, o) => sum + Math.max(0, o.volume), 0)
    )
  )
  const rhythmEnvelope = computed(() => {
    const n = 360
    const sum = new Array<number>(n).fill(0)
    for (const v of voices.value) {
      envelopeSamples(v, rhythmMs.value, n).forEach((x, i) => (sum[i] += x))
    }
    return sum
  })

  const ariaLabel = computed(
    () =>
      `${t('scope_title')}: ${voices.value
        .map((v) => `${v.id + 1} ${WAVE_ABBR[v.shape]} ${Math.round(v.frequency)} Hz`)
        .join(', ')}`
  )

  function formatMs(ms: number): string {
    return ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${ms.toFixed(ms < 10 ? 1 : 0)} ms`
  }

  // ─── Canvas ────────────────────────────────────────────────────
  const canvasEl = ref<HTMLCanvasElement | null>(null)
  let ctx: CanvasRenderingContext2D | null = null
  let colors: Record<keyof typeof COLOR_TOKENS, string> | null = null
  let rafId = 0
  let startStamp = 0
  // Abspielzeit zwischen den 100-ms-Schritten des Players weiterzählen
  let playSync = { storeMs: 0, at: 0 }
  const reducedMotion =
    typeof window !== 'undefined' &&
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  function readColors(el: HTMLElement) {
    const style = getComputedStyle(el)
    colors = Object.fromEntries(
      Object.entries(COLOR_TOKENS).map(([k, v]) => [k, style.getPropertyValue(v).trim()])
    ) as Record<keyof typeof COLOR_TOKENS, string>
  }

  function setupCanvas() {
    const el = canvasEl.value
    if (!el) {
      ctx = null
      return
    }
    ctx = el.getContext?.('2d') ?? null
    readColors(el)
  }

  function playMs(now: number): number {
    if (!store.isPlaying) return 0
    if (store.isPaused) return store.currentTime
    return playSync.storeMs + Math.min(now - playSync.at, 250)
  }

  /** Zeichnet ein Bild. `now` in ms (performance.now). */
  function draw(now: number) {
    const el = canvasEl.value
    if (!ctx || !el || !colors) return
    const cssW = el.clientWidth
    const cssH = el.clientHeight
    if (!cssW || !cssH) return // Tab ausgeblendet
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    if (el.width !== Math.round(cssW * dpr) || el.height !== Math.round(cssH * dpr)) {
      el.width = Math.round(cssW * dpr)
      el.height = Math.round(cssH * dpr)
    }
    const c = ctx
    const W = el.width
    const H = el.height
    c.setTransform(1, 0, 0, 1, 0, 0)
    c.clearRect(0, 0, W, H)

    const waveH = H * 0.72
    const stripTop = waveH + 8 * dpr
    const stripH = H - stripTop - 4 * dpr
    const mid = waveH / 2
    const elapsed = reducedMotion ? 0 : (now - startStamp) / 1000
    const playing = store.isPlaying && !store.isPaused
    const tPlay = playMs(now)

    // Raster
    c.globalCompositeOperation = 'source-over'
    c.globalAlpha = 0.5
    c.strokeStyle = colors.grid
    c.lineWidth = dpr
    c.beginPath()
    for (let i = 1; i < 8; i++) {
      const x = (i / 8) * W
      c.moveTo(x, 0)
      c.lineTo(x, waveH)
    }
    c.moveTo(0, mid)
    c.lineTo(W, mid)
    c.moveTo(0, stripTop - 4 * dpr)
    c.lineTo(W, stripTop - 4 * dpr)
    c.stroke()

    // Pegel je Stimme: Wiedergabe = echte Hüllkurve, sonst sanftes Atmen
    const breathe = reducedMotion ? 1 : 0.8 + 0.2 * Math.sin(elapsed * 2.4)
    const levels = voices.value.map((v) =>
      playing || store.isPaused ? envelopeAt(v, tPlay) : v.volume * breathe
    )

    // Laufende Phase: tiefste Frequenz wandert ~0,4 Perioden pro Sekunde
    const shiftMs = (elapsed * waveMs.value * 0.1) % (waveMs.value * 1000)
    const n = Math.min(1600, sampleCount(voices.value, waveMs.value, 400, 1600))
    const amp = (mid * 0.9) / scale.value
    const mix = new Array<number>(n).fill(0)
    const toY = (v: number) => mid - v * amp

    c.globalCompositeOperation = 'lighter'
    voices.value.forEach((v, vi) => {
      const pts = new Array<number>(n)
      for (let i = 0; i < n; i++) {
        const tMs = (i / (n - 1)) * waveMs.value + shiftMs
        const val = waveValue(v.shape, (v.frequency * tMs) / 1000) * levels[vi]
        pts[i] = val
        mix[i] += val
      }
      glowLine(c, pts, W, toY, colors![v.color], 1.6 * dpr, 10 * dpr, 0.75)
    })
    // Summe: kräftiger, mit hellem Kern
    glowLine(c, mix, W, toY, colors.yellow, 2.6 * dpr, 22 * dpr, 1)
    c.globalAlpha = 0.55
    c.shadowBlur = 0
    c.strokeStyle = colors.core
    c.lineWidth = 0.8 * dpr
    strokePoints(c, mix, W, toY)

    // Rhythmus-Streifen: Summe der Hüllkurven, Abspielposition
    const env = rhythmEnvelope.value
    const envScale = (stripH * 0.9) / scale.value
    glowLine(
      c,
      env,
      W,
      (v) => stripTop + stripH - v * envScale,
      colors.green,
      1.4 * dpr,
      8 * dpr,
      0.9
    )
    if (store.isPlaying && rhythmMs.value > 0) {
      const x = ((tPlay % rhythmMs.value) / rhythmMs.value) * W
      c.globalAlpha = 1
      c.shadowColor = colors.yellow
      c.shadowBlur = 14 * dpr
      c.strokeStyle = colors.yellow
      c.lineWidth = 2 * dpr
      c.beginPath()
      c.moveTo(x, stripTop)
      c.lineTo(x, stripTop + stripH)
      c.stroke()
    }
    c.shadowBlur = 0
    c.globalAlpha = 1
    c.globalCompositeOperation = 'source-over'
  }

  function strokePoints(
    c: CanvasRenderingContext2D,
    pts: readonly number[],
    W: number,
    toY: (v: number) => number
  ) {
    const last = Math.max(pts.length - 1, 1)
    c.beginPath()
    pts.forEach((v, i) => {
      const x = (i / last) * W
      if (i === 0) c.moveTo(x, toY(v))
      else c.lineTo(x, toY(v))
    })
    c.stroke()
  }

  /** Leuchtende Linie: weicher Schein (shadowBlur) plus Linie in voller Farbe. */
  function glowLine(
    c: CanvasRenderingContext2D,
    pts: readonly number[],
    W: number,
    toY: (v: number) => number,
    color: string,
    width: number,
    blur: number,
    alpha: number
  ) {
    c.lineJoin = 'round'
    c.strokeStyle = color
    c.shadowColor = color
    c.shadowBlur = blur
    c.globalAlpha = alpha * 0.5
    c.lineWidth = width * 2.5
    strokePoints(c, pts, W, toY)
    c.globalAlpha = alpha
    c.lineWidth = width
    c.shadowBlur = blur / 2
    strokePoints(c, pts, W, toY)
  }

  function loop(now: number) {
    draw(now)
    rafId = requestAnimationFrame(loop)
  }

  function start() {
    stop()
    setupCanvas()
    if (!ctx) return
    if (reducedMotion || typeof requestAnimationFrame !== 'function') {
      draw(performance.now())
      return
    }
    rafId = requestAnimationFrame(loop)
  }

  function stop() {
    if (rafId && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(rafId)
    rafId = 0
  }

  watch(
    () => store.currentTime,
    (ms) => (playSync = { storeMs: ms, at: performance.now() })
  )
  // Canvas erscheint/verschwindet mit dem ersten bzw. letzten aktiven Oszillator
  watch(
    () => voices.value.length > 0,
    async () => {
      await nextTick()
      start()
    }
  )
  // Ohne Animation (reduzierte Bewegung) bei jeder Änderung einmal neu zeichnen
  watch([voices, () => store.isPlaying, () => store.currentTime], () => {
    if (reducedMotion) draw(performance.now())
  })

  onMounted(() => {
    startStamp = performance.now()
    start()
  })
  onUnmounted(stop)
</script>
