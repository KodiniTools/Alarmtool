// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import GlowScope, { type ScopeVoice } from '@/components/oscillator/GlowScope.vue'

const VOICES: ScopeVoice[] = [
  {
    id: 0,
    shape: 'sine',
    waveType: 'sine',
    enabled: true,
    color: 'blue',
    frequency: 440,
    volume: 0.5,
    attack: 20,
    decay: 50,
    sustain: 0.8,
    release: 80,
    pattern: '500,200',
  },
]

/** Canvas-Kontext, der Aufrufe und gesetzte Eigenschaften mitschreibt. */
function recordingContext() {
  const calls: string[] = []
  const sets: Record<string, unknown[]> = {}
  const ctx = new Proxy(
    {},
    {
      get: (_t, key: string) => () => void calls.push(key),
      set: (_t, key: string, value) => {
        ;(sets[key] ||= []).push(value)
        return true
      },
    }
  )
  return { ctx, calls, sets }
}

describe('GlowScope', () => {
  let rec: ReturnType<typeof recordingContext>

  beforeEach(() => {
    rec = recordingContext()
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(rec.ctx as never)
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(800)
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(300)
    vi.stubGlobal('requestAnimationFrame', undefined)
  })
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('zeichnet Linien und Schein ohne shadowBlur (blockiert sonst den Hauptthread)', () => {
    const wrapper = mount(GlowScope, {
      props: { voices: VOICES, mode: 'playing', selfClock: true },
    })
    expect(rec.calls.filter((c) => c === 'stroke').length).toBeGreaterThan(4)
    // Schein kommt aus den verkleinerten Zwischenpuffern
    expect(rec.calls.filter((c) => c === 'drawImage').length).toBe(3)
    expect(rec.sets.shadowBlur).toBeUndefined()
    expect(rec.sets.shadowColor).toBeUndefined()
    wrapper.unmount()
  })

  it('pausiert außerhalb des sichtbaren Bereichs und läuft danach weiter', () => {
    let callback: (entries: { isIntersecting: boolean }[]) => void = () => {}
    const disconnect = vi.fn()
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(cb: typeof callback) {
          callback = cb
        }
        observe() {}
        disconnect = disconnect
      }
    )
    const frames: ((now: number) => void)[] = []
    vi.stubGlobal('requestAnimationFrame', (cb: (now: number) => void) => frames.push(cb))
    vi.stubGlobal('cancelAnimationFrame', () => {})

    const wrapper = mount(GlowScope, { props: { voices: VOICES } })
    expect(frames).toHaveLength(1)
    frames.shift()!(16)
    expect(frames).toHaveLength(1) // sichtbar: nächstes Bild angefordert

    callback([{ isIntersecting: false }])
    frames.shift()!(32)
    expect(frames).toHaveLength(0) // unsichtbar: Schleife endet

    callback([{ isIntersecting: true }])
    expect(frames).toHaveLength(1) // wieder sichtbar: läuft weiter

    wrapper.unmount()
    expect(disconnect).toHaveBeenCalled()
  })
})
