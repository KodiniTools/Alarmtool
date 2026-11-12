<template>
  <canvas ref="canvasRef" class="glow-scope" role="img" :aria-label="label"></canvas>
</template>

<script setup lang="ts">
  /**
   * Leuchtender Oszilloskop-Canvas (Stimmen in Blau/Grün, Summe in Gelb, darunter der
   * Rhythmus mit Abspielposition). Rein aus den übergebenen Stimmen gerechnet; genutzt
   * vom Visualizer der App (OscillatorScope) und vom Hero der Landing-Page.
   * Braucht eine dunkle Fläche (data-theme="dark" an einem Vorfahren).
   */
  import { computed, onMounted, onUnmounted, ref, watch, type PropType } from 'vue'
  import {
    envelopeAt,
    envelopeSamples,
    rhythmWindowMs,
    sampleCount,
    waveWindowMs,
    type PreviewOscillator,
  } from '@/lib/oscillatorPreview'
  import { waveValue, type WaveShape } from '@/lib/waveShapes'

  export type VoiceColor = 'blue' | 'green'
  export type ScopeVoice = PreviewOscillator & { id: number; shape: WaveShape; color: VoiceColor }

  const props = defineProps({
    voices: { type: Array as PropType<ScopeVoice[]>, required: true },
    /** idle: Kurven „atmen“; playing: Hüllkurve/Muster laufen; paused: stehen */
    mode: {
      type: String as PropType<'idle' | 'playing' | 'paused'>,
      default: 'idle',
      validator: (v: string) => ['idle', 'playing', 'paused'].includes(v),
    },
    /** Abspielzeit in ms (Player, 100-ms-Schritte; dazwischen wird weitergezählt) */
    currentTime: { type: Number, default: 0 },
    /** Eigene Uhr statt currentTime, z. B. für eine Dauerschleife auf der Landing-Page */
    selfClock: { type: Boolean, default: false },
    /** Startzeit der eigenen Uhr in ms; ohne Animation (reduzierte Bewegung) bleibt sie stehen */
    startOffset: { type: Number, default: 0 },
    label: { type: String, default: '' },
    /** Vergrößerung der Wellen (1 = Summe aller Lautstärken füllt die Höhe) */
    zoom: { type: Number, default: 1 },
  })

  const COLOR_TOKENS = {
    blue: '--ds-info',
    green: '--ds-success',
    yellow: '--ds-warning',
    core: '--ds-text',
    grid: '--ds-border',
  } as const

  const voices = computed(() => props.voices)
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

  // ─── Canvas ────────────────────────────────────────────────────
  const canvasRef = ref<HTMLCanvasElement | null>(null)
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
    const el = canvasRef.value
    if (!el) {
      ctx = null
      return
    }
    ctx = el.getContext?.('2d') ?? null
    readColors(el)
  }

  function playMs(now: number): number {
    if (props.mode === 'idle') return 0
    // Eigene Uhr (Landing-Page): Zeit seit dem Einhängen
    if (props.selfClock) return props.startOffset + (reducedMotion ? 0 : now - startStamp)
    if (props.mode === 'paused') return props.currentTime
    return playSync.storeMs + Math.min(now - playSync.at, 250)
  }

  /** Zeichnet ein Bild. `now` in ms (performance.now). */
  function draw(now: number) {
    const el = canvasRef.value
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
    const playing = props.mode === 'playing'
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
      playing || props.mode === 'paused' ? envelopeAt(v, tPlay) : v.volume * breathe
    )

    // Laufende Phase: tiefste Frequenz wandert ~0,4 Perioden pro Sekunde
    const shiftMs = (elapsed * waveMs.value * 0.1) % (waveMs.value * 1000)
    const n = Math.min(1600, sampleCount(voices.value, waveMs.value, 400, 1600))
    const amp = ((mid * 0.9) / scale.value) * Math.max(0.1, props.zoom)
    const mix = new Array<number>(n).fill(0)
    const toY = (v: number) => mid - v * amp

    // Wellen auf ihren Bereich begrenzen (Zoom kann über den Rand gehen)
    c.save()
    c.beginPath()
    c.rect(0, 0, W, waveH)
    c.clip()
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

    c.restore()
    c.globalCompositeOperation = 'lighter'

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
    if (props.mode !== 'idle' && rhythmMs.value > 0) {
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
    () => props.currentTime,
    (ms) => (playSync = { storeMs: ms, at: performance.now() })
  )
  // Ohne Animation (reduzierte Bewegung) bei jeder Änderung einmal neu zeichnen
  watch([voices, () => props.mode, () => props.currentTime], () => {
    if (reducedMotion) draw(performance.now())
  })

  onMounted(() => {
    startStamp = performance.now()
    start()
  })
  onUnmounted(stop)
</script>
