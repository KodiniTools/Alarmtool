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
  // Schein: Die Linien werden zusätzlich klein in zwei Zwischenpuffer gezeichnet und
  // vergrößert unter die scharfen Linien gelegt. Das ersetzt shadowBlur, das je Linie die
  // ganze Fläche weichzeichnet und den Hauptthread pro Bild über 50 ms blockieren kann.
  let glowNear: Layer | null = null
  let glowFar: Layer | null = null
  let visible = true
  let observer: IntersectionObserver | null = null
  let colors: Record<keyof typeof COLOR_TOKENS, string> | null = null
  let rafId = 0
  let startStamp = 0
  // Abspielzeit zwischen den 100-ms-Schritten des Players weiterzählen
  let playSync = { storeMs: 0, at: 0 }
  const reducedMotion =
    typeof window !== 'undefined' &&
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  interface Layer {
    el: HTMLCanvasElement
    c: CanvasRenderingContext2D
  }
  /** Verkleinerung der Puffer: naher Schein 1/5, weiter Schein 1/10 der Canvas-Größe. */
  const GLOW_NEAR = 0.2
  const GLOW_FAR = 0.5

  function createLayer(): Layer | null {
    const el = document.createElement('canvas')
    const c = el.getContext?.('2d') ?? null
    return c ? { el, c } : null
  }

  function sizeLayer(layer: Layer, w: number, h: number) {
    const lw = Math.max(1, Math.round(w))
    const lh = Math.max(1, Math.round(h))
    if (layer.el.width !== lw || layer.el.height !== lh) {
      layer.el.width = lw
      layer.el.height = lh
    }
  }

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
    if (ctx && !glowNear) {
      glowNear = createLayer()
      glowFar = createLayer()
    }
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
    // Mehr Punkte als Pixel bringen nichts
    const n = Math.min(1600, Math.max(2, W), sampleCount(voices.value, waveMs.value, 400, 1600))
    const amp = ((mid * 0.9) / scale.value) * Math.max(0.1, props.zoom)
    const mix = new Array<number>(n).fill(0)
    const toY = (v: number) => mid - v * amp
    const waves = voices.value.map((v, vi) => {
      const pts = new Array<number>(n)
      for (let i = 0; i < n; i++) {
        const tMs = (i / (n - 1)) * waveMs.value + shiftMs
        const val = waveValue(v.shape, (v.frequency * tMs) / 1000) * levels[vi]
        pts[i] = val
        mix[i] += val
      }
      return { pts, color: colors![v.color] }
    })
    const env = rhythmEnvelope.value
    const envScale = (stripH * 0.9) / scale.value
    const envY = (v: number) => stripTop + stripH - v * envScale
    const playheadX =
      props.mode !== 'idle' && rhythmMs.value > 0
        ? ((tPlay % rhythmMs.value) / rhythmMs.value) * W
        : null

    /** Alle Linien; `glow` zeichnet sie breiter für den Schein, sonst scharf mit hellem Kern. */
    const paint = (g: CanvasRenderingContext2D, glow: boolean) => {
      g.lineJoin = 'round'
      g.globalCompositeOperation = 'lighter'
      // Wellen auf ihren Bereich begrenzen (Zoom kann über den Rand gehen)
      g.save()
      g.beginPath()
      g.rect(0, 0, W, waveH)
      g.clip()
      for (const wave of waves) {
        line(g, wave.pts, W, toY, wave.color, 1.6 * dpr, 0.75, glow)
      }
      // Summe: kräftiger, mit hellem Kern
      line(g, mix, W, toY, colors!.yellow, 2.6 * dpr, 1, glow)
      if (!glow) {
        g.globalAlpha = 0.55
        g.strokeStyle = colors!.core
        g.lineWidth = 0.8 * dpr
        strokePoints(g, mix, W, toY)
      }
      g.restore()
      g.globalCompositeOperation = 'lighter'
      // Rhythmus-Streifen: Summe der Hüllkurven, Abspielposition
      line(g, env, W, envY, colors!.green, 1.4 * dpr, 0.9, glow)
      if (playheadX !== null) {
        g.globalAlpha = 1
        g.strokeStyle = colors!.yellow
        g.lineWidth = (glow ? 5 : 2) * dpr
        g.beginPath()
        g.moveTo(playheadX, stripTop)
        g.lineTo(playheadX, stripTop + stripH)
        g.stroke()
      }
      g.globalAlpha = 1
    }

    // Schein: klein zeichnen, weiter verkleinern, beides vergrößert auflegen
    if (glowNear && glowFar) {
      sizeLayer(glowNear, W * GLOW_NEAR, H * GLOW_NEAR)
      sizeLayer(glowFar, glowNear.el.width * GLOW_FAR, glowNear.el.height * GLOW_FAR)
      const near = glowNear.c
      near.setTransform(1, 0, 0, 1, 0, 0)
      near.globalCompositeOperation = 'source-over'
      near.clearRect(0, 0, glowNear.el.width, glowNear.el.height)
      near.setTransform(glowNear.el.width / W, 0, 0, glowNear.el.height / H, 0, 0)
      paint(near, true)

      const far = glowFar.c
      far.globalCompositeOperation = 'source-over'
      far.clearRect(0, 0, glowFar.el.width, glowFar.el.height)
      far.imageSmoothingEnabled = true
      far.imageSmoothingQuality = 'high'
      far.drawImage(glowNear.el, 0, 0, glowFar.el.width, glowFar.el.height)

      c.globalCompositeOperation = 'lighter'
      c.imageSmoothingEnabled = true
      c.imageSmoothingQuality = 'high'
      c.globalAlpha = 0.55
      c.drawImage(glowFar.el, 0, 0, W, H)
      c.globalAlpha = 0.3
      c.drawImage(glowNear.el, 0, 0, W, H)
    }

    paint(c, false)
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

  /**
   * Eine Linie: scharf als breiter, halbtransparenter Strich plus Strich in voller Farbe;
   * für den Schein als ein breiter Strich (wird beim Vergrößern des Puffers weich).
   */
  function line(
    c: CanvasRenderingContext2D,
    pts: readonly number[],
    W: number,
    toY: (v: number) => number,
    color: string,
    width: number,
    alpha: number,
    glow: boolean
  ) {
    c.strokeStyle = color
    if (glow) {
      c.globalAlpha = alpha
      c.lineWidth = width * 3.5
      strokePoints(c, pts, W, toY)
      return
    }
    c.globalAlpha = alpha * 0.5
    c.lineWidth = width * 2.5
    strokePoints(c, pts, W, toY)
    c.globalAlpha = alpha
    c.lineWidth = width
    strokePoints(c, pts, W, toY)
  }

  function loop(now: number) {
    draw(now)
    rafId = visible ? requestAnimationFrame(loop) : 0
  }

  /** Außerhalb des sichtbaren Bereichs pausiert die Animation. */
  function watchVisibility() {
    const el = canvasRef.value
    if (!el || typeof IntersectionObserver !== 'function') return
    observer = new IntersectionObserver((entries) => {
      const nowVisible = entries.some((e) => e.isIntersecting)
      if (nowVisible === visible) return
      visible = nowVisible
      if (!visible || !ctx) return
      // Ohne Animation einmal zeichnen, z. B. wenn der Tab erst jetzt eingeblendet wird
      if (reducedMotion || typeof requestAnimationFrame !== 'function') draw(performance.now())
      else if (!rafId) rafId = requestAnimationFrame(loop)
    })
    observer.observe(el)
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
    watchVisibility()
  })
  onUnmounted(() => {
    observer?.disconnect()
    observer = null
    stop()
  })
</script>
