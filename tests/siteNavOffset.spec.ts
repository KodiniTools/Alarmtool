// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest'
import { measureSiteNav } from '@/composables/useSiteNavOffset'

function setup(html: string, heights: Record<string, number>) {
  document.body.innerHTML = html
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement
  ) {
    return { height: heights[this.id] ?? 0 } as DOMRect
  })
}

describe('measureSiteNav', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  it('misst eine sticky Navigation vor #app', () => {
    setup('<nav id="nav" style="position: sticky; top: 0"></nav><div id="app"></div>', { nav: 70 })
    expect(measureSiteNav()).toBe(70)
  })

  it('findet die Navigation in einem fixierten Wrapper', () => {
    setup('<div id="wrap" style="position: fixed"><nav id="nav"></nav></div><div id="app"></div>', {
      nav: 64,
      wrap: 64,
    })
    expect(measureSiteNav()).toBe(64)
  })

  it('ignoriert mitscrollende Navigationen und alles nach #app', () => {
    setup(
      '<nav id="nav"></nav><div id="app"></div><footer id="f" style="position: fixed"></footer>',
      { nav: 70, f: 50 }
    )
    expect(measureSiteNav()).toBe(0)
  })

  it('liefert 0 ohne #app', () => {
    setup('<nav id="nav" style="position: fixed"></nav>', { nav: 70 })
    expect(measureSiteNav()).toBe(0)
  })
})
