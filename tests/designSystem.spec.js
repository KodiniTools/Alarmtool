import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import {
  buildBundleCss,
  buildIndex,
  buildTokens,
  classify,
  extractBlock,
  extractHistoryPaths,
  extractTokens,
  parseDeclarations,
  parseImports,
  shapeValue,
} from '../design-system/lib.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const read = (p) => readFileSync(new URL(p, `file://${root}`), 'utf8')
const system = JSON.parse(read('design-system/system.json'))
const notes = JSON.parse(read('design-system/content/tokens.notes.json'))
const tokensCss = read('src/styles/tokens.css')

describe('CSS custom-property parsing', () => {
  const fixture = `
    /* intro */
    :root {
      /* Shape */
      --r: 12px;
      --s: 0.25rem; /* 4px */
      --g: linear-gradient(145deg, #000 0%, #fff 100%);
      --b: 1px solid rgba(1, 2, 3, 0.25);
    }
    [data-theme='light'] { --r: 8px; }
  `

  it('extracts a brace-matched block for a selector', () => {
    expect(extractBlock(fixture, ':root')).toContain('--r: 12px')
    expect(extractBlock(fixture, "[data-theme='light']")).toContain('--r: 8px')
    expect(extractBlock(fixture, '.missing')).toBeNull()
  })

  it('keeps nested parentheses and attaches leading/trailing comments', () => {
    const decls = parseDeclarations(extractBlock(fixture, ':root'))
    expect(decls.map((d) => d.name)).toEqual(['r', 's', 'g', 'b'])
    expect(decls[0].leading).toBe('Shape')
    expect(decls[1].trailing).toBe('4px')
    expect(decls[2].value).toBe('linear-gradient(145deg, #000 0%, #fff 100%)')
  })

  it('classifies by name and value', () => {
    expect(classify('at-font-sans', "'Supreme', sans-serif")).toBe('family')
    expect(classify('at-gradient', 'linear-gradient(1deg, #000, #fff)')).toBe('carried')
    expect(classify('at-border', '1px solid rgba(0,0,0,.2)')).toBe('border')
    expect(classify('at-shadow-1', '0 4px 16px rgba(0,0,0,.2)')).toBe('shadow')
    expect(classify('at-speed', '200ms')).toBe('duration')
    expect(classify('space-4', '1rem')).toBe('spacing')
    expect(classify('at-radius-sm', '8px')).toBe('radius')
    expect(classify('at-bg', '#091428')).toBe('color')
    expect(classify('weird', 'calc(1px + 2px)')).toBe('unplaced')
  })

  it('shapes values per theme', () => {
    const themes = system.themes
    expect(shapeValue({ dark: '#000' }, themes)).toBe('#000')
    expect(shapeValue({ dark: '#000', light: '#fff' }, themes)).toEqual({
      dark: '#000',
      light: '#fff',
    })
    expect(shapeValue({ light: '#fff' }, themes)).toEqual({ light: '#fff' })
  })
})

describe('extractTokens on src/styles/tokens.css', () => {
  const extracted = extractTokens(tokensCss, system.themes)

  it('places every variable', () => {
    expect(extracted.unplaced).toEqual([])
  })

  it('reads both themes of a colour and derives the border colour', () => {
    expect(extracted.groups.color.get('at-bg')).toEqual({ dark: '#091428', light: '#f9f2d5' })
    expect(extracted.groups.color.get('at-success')).toEqual({ dark: '#7ec89b' })
    expect(extracted.groups.color.get('at-border-color')).toEqual({
      dark: 'rgba(122, 141, 160, 0.25)',
      light: 'rgba(0, 57, 113, 0.15)',
    })
  })

  it('finds the spacing scale, radii, shadows and durations', () => {
    expect([...extracted.groups.spacing.keys()]).toEqual([
      'space-1',
      'space-2',
      'space-3',
      'space-4',
      'space-5',
      'space-6',
      'space-8',
    ])
    expect([...extracted.groups.radius.keys()]).toEqual([
      'at-radius',
      'at-radius-sm',
      'at-radius-xs',
    ])
    expect(extracted.groups.shadow.get('at-shadow-1')).toEqual({
      dark: '0 4px 16px rgba(9, 20, 40, 0.2)',
      light: '0 4px 16px rgba(0, 57, 113, 0.08)',
    })
    expect([...extracted.groups.duration.keys()]).toEqual(['at-speed', 'at-speed-slow'])
  })

  it('carries the gradient and composite border for bundle.css and keeps the font stack', () => {
    expect(Object.keys(extracted.carried)).toEqual(['at-gradient', 'at-border'])
    expect(extracted.carried['at-gradient'].light).toMatch(/^linear-gradient\(145deg, #f9f2d5 0%/)
    expect(extracted.families.sans).toMatch(/^'Supreme', ui-sans-serif/)
  })

  it('uses source comments as fallback usage', () => {
    expect(extracted.comments.get('space-1')).toBe('4px')
    expect(extracted.comments.get('at-primary-fg')).toMatch(/text\/icon color on primary/)
  })
})

describe('buildTokens', () => {
  const extracted = extractTokens(tokensCss, system.themes)
  const { tokens, missingUsage, problems } = buildTokens({
    extracted,
    notes,
    themes: system.themes,
    name: system.name,
    meta: { source: 'test' },
  })

  it('has a usage note for every CSS variable and no grammar problems', () => {
    expect(missingUsage).toEqual([])
    expect(problems).toEqual([])
  })

  it('lists CSS tokens before the hand-written extras and keeps names unique', () => {
    const names = tokens.color.tokens.map((t) => t.name)
    expect(names.slice(0, 3)).toEqual(['at-bg', 'at-surface', 'at-panel'])
    expect(names).toContain('at-hairline')
    const all = ['color', 'spacing', 'radius', 'shadow', 'duration', 'zIndex', 'opacity'].flatMap(
      (f) => tokens[f].tokens.map((t) => t.name)
    )
    expect(new Set(all).size).toBe(all.length)
  })

  it('takes the sans stack from CSS and the rest of type from the notes', () => {
    expect(Object.keys(tokens.type.families)).toEqual(['sans', 'mono'])
    expect(tokens.type.groups.length).toBeGreaterThan(0)
  })

  it('flags a CSS variable without a note', () => {
    const css = ':root { --at-bg: #000; --new-thing: #123456; }'
    const r = buildTokens({
      extracted: extractTokens(css, system.themes),
      notes,
      themes: system.themes,
      name: 'x',
      meta: {},
    })
    expect(r.missingUsage).toEqual(['color/new-thing'])
  })
})

describe('bundle, icons and index', () => {
  it('reads the stylesheet import order from main.css', () => {
    const imports = parseImports(read('src/styles/main.css'))
    expect(imports[0]).toBe('./tokens.css')
    expect(imports).toContain('./components/button.css')
  })

  it('writes a prelude with the font alias and carried properties per theme', () => {
    const extracted = extractTokens(tokensCss, system.themes)
    const css = buildBundleCss({
      header: '/* h */',
      themes: system.themes,
      families: extracted.families,
      carried: extracted.carried,
      parts: [{ path: 'a.css', css: '.a{}' }],
    })
    expect(css).toContain('--at-font-sans: var(--font-sans);')
    expect(css).toContain("[data-theme='light'] {\n  --at-gradient:")
    expect(css).toContain('/* ── a.css ── */\n.a{}')
  })

  it('finds both history icons with two paths each', () => {
    const paths = extractHistoryPaths(read('src/components/oscillator/HistoryControls.vue'))
    expect(paths).toHaveLength(2)
    expect(paths.every((p) => p.length === 2)).toBe(true)
  })

  it('builds asset records from the lock and reports stale ones', () => {
    const lock = { 'Icons/a.svg': { blob: 'b1', sha256: 'h1', size: 1, type: 'image/svg+xml' } }
    const assets = [
      { group: 'Icons', name: 'a.svg', sha256: 'h1' },
      { group: 'Icons', name: 'b.svg', sha256: 'h2' },
    ]
    const { index, stale } = buildIndex({
      system,
      lock,
      assets,
      lastChange: { by: 't', at: 'now' },
    })
    expect(index.assetGroups.Icons.order).toEqual(['a.svg', 'b.svg'])
    expect(index.assetGroups.Icons.files['a.svg'].blob).toBe('b1')
    expect(stale).toEqual([{ path: 'Icons/b.svg', reason: 'not uploaded yet' }])
    expect(index.createdOnFiles).toEqual(system.createdOnFiles)
  })
})
