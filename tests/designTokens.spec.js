/**
 * Regressionsschutz für die Design-Tokens der Oberfläche.
 *
 * Die Oberfläche läuft auf den gemeinsamen KodiniTools-Tokens v2 (--ds-*,
 * Kopie aus KodiniTools/Collage-Maker). Diese Tests verhindern die Rückkehr
 * der alten Navy-&-Gold-Palette (--at-*, feste Hexwerte), von Gradients, Blur,
 * Hover-Lifts und Karten-Schatten und stellen sicher, dass Supreme in allen
 * genutzten Gewichten gebündelt wird.
 */
import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const STYLES_DIR = join(ROOT, 'src/styles')
const TOKENS_FILE = join(STYLES_DIR, 'tokens.css')

function collectCssFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) collectCssFiles(full, out)
    else if (entry.endsWith('.css')) out.push(full)
  }
  return out
}

/** Alle Zeilen (Datei:Zeile) der Komponenten-Styles (ohne tokens.css), die das Muster treffen. */
function findInStyles(pattern, { includeTokens = false } = {}) {
  const hits = []
  for (const file of collectCssFiles(STYLES_DIR)) {
    if (!includeTokens && file === TOKENS_FILE) continue
    readFileSync(file, 'utf8')
      .split('\n')
      .forEach((line, index) => {
        if (pattern.test(line)) hits.push(`${relative(ROOT, file)}:${index + 1}`)
      })
  }
  return hits
}

describe('Design-Tokens in src/styles', () => {
  it('nutzen keine Variablen der alten Palette (--at-*)', () => {
    expect(findInStyles(/--at-/, { includeTokens: true })).toEqual([])
  })

  it('nutzen in Komponenten-Styles keine festen Farbwerte', () => {
    expect(findInStyles(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/)).toEqual([])
  })

  it('nutzen keine Gradients, Blur, Glow oder Hover-Lifts', () => {
    expect(
      findInStyles(
        /gradient\(|backdrop-filter|text-shadow|translateY\(-1px\)|scale\(1\.\d+\)|filter:\s*brightness/
      )
    ).toEqual([])
  })

  it('nutzen nur die Token-Radien (6 / 10 / 16 / voll) und Kreise', () => {
    expect(findInStyles(/border-radius:\s*(?=\S)(?!var\(--ds-radius|50%|0\b)/)).toEqual([])
  })

  it('nutzen für Transitions die Token-Dauern statt fester Zeiten', () => {
    expect(findInStyles(/transition(?!-duration: 0\.01ms)[^;{]*\b\d+(\.\d+)?m?s\b/)).toEqual([])
  })
})

describe('tokens.css', () => {
  const css = readFileSync(TOKENS_FILE, 'utf8')

  it('deklariert Dark auf :root und Light auf [data-theme=light] mit derselben Palette', () => {
    const names = (block) => [...block.matchAll(/--ds-[a-z0-9-]+(?=:)/g)].map((m) => m[0])
    const darkStart = css.indexOf('\n:root {')
    const lightStart = css.indexOf("\n[data-theme='light'] {")
    expect(darkStart).toBeGreaterThan(-1)
    expect(lightStart).toBeGreaterThan(darkStart)
    const dark = names(css.slice(darkStart, lightStart))
    const light = names(css.slice(lightStart))
    expect(light.length).toBeGreaterThanOrEqual(20)
    for (const name of light) expect(dark).toContain(name)
    expect(dark).toContain('--ds-accent')
    expect(dark).toContain('--ds-focus-ring')
  })

  it.each([400, 500, 700])('bündelt Supreme in Gewicht %i aus src/assets/fonts', (weight) => {
    const faces = css.match(/@font-face\s*{[^}]*}/g) ?? []
    const face = faces.find((f) => new RegExp(`font-weight:\\s*${weight}\\b`).test(f))
    expect(face, `Kein @font-face für Supreme ${weight}`).toBeDefined()
    expect(face).toMatch(/\.\.\/assets\/fonts\/Supreme-(Regular|Medium|Bold)\.woff2/)
  })
})

describe('base.css', () => {
  const css = readFileSync(join(STYLES_DIR, 'base.css'), 'utf8')

  it('setzt die Grundgröße des Body auf --ds-text-lg und die Fläche auf --ds-surface-0', () => {
    expect(css).toMatch(/body \{[^}]*font-size: var\(--ds-text-lg\)/)
    expect(css).toMatch(/body \{[^}]*background: var\(--ds-surface-0\)/)
  })
})
