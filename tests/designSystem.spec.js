import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import {
  buildBundleCss,
  buildIndex,
  buildTokens,
  classify,
  extractBlock,
  extractFontFaces,
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
    expect(classify('ds-font-sans', "'Supreme', sans-serif")).toBe('family')
    expect(classify('ds-focus-ring', '0 0 0 2px var(--ds-surface-0)')).toBe('carried')
    expect(classify('ds-ease', 'cubic-bezier(0.2, 0, 0, 1)')).toBe('carried')
    expect(classify('ds-text-md', '14px')).toBe('carried')
    expect(classify('ds-weight-bold', '700')).toBe('carried')
    expect(classify('at-border', '1px solid rgba(0,0,0,.2)')).toBe('border')
    expect(classify('ds-shadow-overlay', '0 8px 24px rgba(0,0,0,.35)')).toBe('shadow')
    expect(classify('ds-z-toast', '9999')).toBe('zIndex')
    expect(classify('ds-duration', '150ms')).toBe('duration')
    expect(classify('ds-control-md', '36px')).toBe('size')
    expect(classify('ds-border-width', '1px')).toBe('size')
    expect(classify('ds-space-4', '16px')).toBe('spacing')
    expect(classify('ds-radius-full', '999px')).toBe('radius')
    expect(classify('ds-text-2', '#a7b3c4')).toBe('color')
    expect(classify('ds-accent-soft', 'rgba(212, 162, 87, 0.14)')).toBe('color')
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

  it('reads both themes of a colour', () => {
    expect(extracted.groups.color.get('ds-surface-0')).toEqual({
      dark: '#0a1324',
      light: '#f6f5f1',
    })
    expect(extracted.groups.color.get('ds-success')).toEqual({ dark: '#5fcf8a', light: '#177a42' })
    expect(extracted.groups.color.get('ds-accent-soft')).toEqual({
      dark: 'rgba(212, 162, 87, 0.14)',
      light: 'rgba(201, 152, 77, 0.16)',
    })
  })

  it('finds the spacing scale, radii, shadows, durations, sizes and layers', () => {
    expect([...extracted.groups.spacing.keys()]).toEqual([
      'ds-space-1',
      'ds-space-2',
      'ds-space-3',
      'ds-space-4',
      'ds-space-5',
      'ds-space-6',
      'ds-space-8',
      'ds-space-10',
      'ds-space-12',
      'ds-space-16',
    ])
    expect([...extracted.groups.radius.keys()]).toEqual([
      'ds-radius-sm',
      'ds-radius-md',
      'ds-radius-lg',
      'ds-radius-full',
    ])
    expect(extracted.groups.shadow.get('ds-shadow-overlay')).toEqual({
      dark: '0 8px 24px rgba(0, 0, 0, 0.35)',
      light: '0 8px 24px rgba(20, 33, 58, 0.12)',
    })
    expect([...extracted.groups.duration.keys()]).toEqual(['ds-duration', 'ds-duration-slow'])
    expect(extracted.groups.size.get('ds-control-md')).toEqual({ dark: '36px' })
    expect(extracted.groups.zIndex.get('ds-z-toast')).toEqual({ dark: '9999' })
  })

  it('carries the focus ring, easing and typography scale for bundle.css and keeps the font stacks', () => {
    expect(Object.keys(extracted.carried)).toContain('ds-focus-ring')
    expect(Object.keys(extracted.carried)).toContain('ds-ease')
    expect(Object.keys(extracted.carried)).toContain('ds-text-md')
    expect(extracted.carried['ds-focus-ring'].light).toBe(
      '0 0 0 2px var(--ds-surface-0), 0 0 0 4px var(--ds-accent)'
    )
    expect(extracted.families).toEqual({
      sans: "'Supreme', sans-serif",
      mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
    })
    expect(extracted.familyNames.sans).toBe('ds-font-sans')
  })

  it('uses source comments as fallback usage', () => {
    expect(extracted.comments.get('ds-surface-0')).toMatch(/Flächen/)
  })

  it('reads the bundled Supreme faces from @font-face', () => {
    const faces = extractFontFaces(tokensCss)
    expect(faces.map((f) => f.weight)).toEqual(['400', '500', '700'])
    expect(faces[0]).toEqual({
      family: 'Supreme',
      file: '../assets/fonts/Supreme-Regular.woff2',
      weight: '400',
      style: 'normal',
    })
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
    fonts: [
      { family: 'Supreme', file: 'fonts/Supreme-Regular.woff2', weight: '400', style: 'normal' },
    ],
  })

  it('has a usage note for every CSS variable and no grammar problems', () => {
    expect(missingUsage).toEqual([])
    expect(problems).toEqual([])
  })

  it('lists CSS tokens in source order, adds the extra families and keeps names unique', () => {
    expect(tokens.color.tokens.slice(0, 3).map((t) => t.name)).toEqual([
      'ds-surface-0',
      'ds-surface-1',
      'ds-surface-2',
    ])
    expect(Object.keys(tokens)).toEqual([
      'name',
      'version',
      'meta',
      'color',
      'type',
      'spacing',
      'radius',
      'shadow',
      'duration',
      'size',
      'zIndex',
      'opacity',
    ])
    const all = [
      'color',
      'spacing',
      'radius',
      'shadow',
      'duration',
      'size',
      'zIndex',
      'opacity',
    ].flatMap((f) => tokens[f].tokens.map((t) => t.name))
    expect(new Set(all).size).toBe(all.length)
  })

  it('takes the font stacks from CSS, the fonts from the caller and the styles from the notes', () => {
    expect(Object.keys(tokens.type.families)).toEqual(['sans', 'mono'])
    expect(tokens.type.fonts[0].file).toBe('fonts/Supreme-Regular.woff2')
    expect(tokens.type.groups.length).toBeGreaterThan(0)
  })

  it('flags a CSS variable without a note', () => {
    const css = ':root { --ds-surface-0: #000; --new-thing: #123456; }'
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

  it('writes a prelude with the font aliases and carried properties per theme', () => {
    const extracted = extractTokens(tokensCss, system.themes)
    const css = buildBundleCss({
      header: '/* h */',
      themes: system.themes,
      families: extracted.families,
      familyNames: extracted.familyNames,
      carried: extracted.carried,
      parts: [{ path: 'a.css', css: '.a{}' }],
    })
    expect(css).toContain('--ds-font-sans: var(--font-sans);')
    expect(css).toContain('--ds-text-md: 14px;')
    expect(css).toContain("[data-theme='light'] {\n  --ds-focus-ring:")
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
