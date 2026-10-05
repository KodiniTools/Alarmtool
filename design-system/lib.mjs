// Pure helpers for the design-system producer (no I/O): CSS custom-property
// parsing, token classification, bundle/icon/index builders. Used by build.mjs
// and covered by tests/designSystem.spec.js.
import { createHash } from 'node:crypto'

const COLOR_RE = /^(#[0-9a-f]{3,8}|(?:rgba?|hsla?|oklch|oklab|lab|lch|color)\([^()]*\))$/i
const DURATION_RE = /^\d*\.?\d+m?s$/
export const TOKEN_NAME_RE = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$/

export const collapse = (s) => s.replace(/\s+/g, ' ').trim()
export const sha256 = (s) => createHash('sha256').update(s).digest('hex')
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Replaces every comment with spaces so string offsets stay valid. */
export function blankComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, (m) => ' '.repeat(m.length))
}

/** Body of the first `selector { … }` block (brace-matched), or null. */
export function extractBlock(css, selector) {
  const blank = blankComments(css)
  const re = new RegExp(`(^|[}\\s])${escapeRe(selector)}\\s*\\{`, 'm')
  const m = re.exec(blank)
  if (!m) return null
  const open = m.index + m[0].length - 1
  let depth = 0
  for (let i = open; i < blank.length; i++) {
    if (blank[i] === '{') depth++
    else if (blank[i] === '}' && --depth === 0) return css.slice(open + 1, i)
  }
  return null
}

/**
 * `--name: value` declarations of a block, in source order, each with the
 * comment on its line (`trailing`) or the comment above it (`leading`).
 * Values keep nested parentheses intact; whitespace is collapsed.
 */
export function parseDeclarations(rawBlock) {
  if (!rawBlock) return []
  const blank = blankComments(rawBlock)
  const segments = []
  let depth = 0
  let start = 0
  for (let i = 0; i < blank.length; i++) {
    const c = blank[i]
    if (c === '(') depth++
    else if (c === ')') depth--
    else if (c === ';' && depth === 0) {
      segments.push([start, i])
      start = i + 1
    }
  }
  segments.push([start, blank.length])

  const decls = []
  for (const [s, e] of segments) {
    const rawSeg = rawBlock.slice(s, e)
    const blankSeg = blank.slice(s, e)
    const declAt = blankSeg.search(/--[A-Za-z0-9_-]+\s*:/)
    const firstNl = rawSeg.indexOf('\n')
    const lineEnd = firstNl === -1 ? rawSeg.length : firstNl
    const leading = []
    for (const m of rawSeg.matchAll(/\/\*([\s\S]*?)\*\//g)) {
      const text = collapse(m[1])
      const prev = decls[decls.length - 1]
      if (m.index < lineEnd && prev && !prev.trailing && (declAt === -1 || m.index < declAt)) {
        prev.trailing = text
      } else if (declAt === -1 || m.index < declAt) {
        leading.push(text)
      }
    }
    if (declAt === -1) continue
    const m = /--([A-Za-z0-9_-]+)\s*:\s*([\s\S]*)$/.exec(blankSeg.slice(declAt).trim())
    if (!m) continue
    decls.push({
      name: m[1],
      value: collapse(m[2]).replace(/\(\s+/g, '(').replace(/\s+\)/g, ')'),
      leading: leading.length ? leading.join(' ') : null,
      trailing: null,
    })
  }
  return decls
}

/** Which token family a custom property belongs to. */
export function classify(name, value) {
  if (/^at-font-/.test(name)) return 'family'
  if (/gradient\(/.test(value)) return 'carried'
  if (/^\d*\.?\d+px\s+(solid|dashed|dotted)\s+/.test(value)) return 'border'
  if (/shadow/.test(name)) return 'shadow'
  if (/speed|duration/.test(name) || DURATION_RE.test(value)) return 'duration'
  if (/(^|-)(space|gap|pad)/.test(name)) return 'spacing'
  if (/radius|rounded/.test(name)) return 'radius'
  if (COLOR_RE.test(value)) return 'color'
  return 'unplaced'
}

export const normalizeColor = (v) => (v.startsWith('#') ? v.toLowerCase() : collapse(v))

/**
 * Reads every theme block of tokens.css into per-family maps
 * (name → { themeId: value }, in source order), the font families, the
 * properties that must be carried into bundle.css (gradients, composite
 * borders), source comments and anything that could not be placed.
 */
export function extractTokens(css, themes) {
  const groups = {
    color: new Map(),
    spacing: new Map(),
    radius: new Map(),
    shadow: new Map(),
    duration: new Map(),
  }
  const families = {}
  const carried = {}
  const comments = new Map()
  const unplaced = []
  const put = (map, name, themeId, value) => {
    const entry = map.get(name) ?? {}
    entry[themeId] = value
    map.set(name, entry)
  }

  themes.forEach((theme, themeIndex) => {
    for (const d of parseDeclarations(extractBlock(css, theme.selector))) {
      const comment = d.trailing || d.leading
      if (comment && !comments.has(d.name)) comments.set(d.name, comment)
      switch (classify(d.name, d.value)) {
        case 'family':
          if (themeIndex === 0) families[d.name.replace(/^at-font-/, '')] = d.value
          break
        case 'carried':
          ;(carried[d.name] ??= {})[theme.id] = d.value
          break
        case 'border': {
          ;(carried[d.name] ??= {})[theme.id] = d.value
          const color = /(#[0-9a-f]{3,8}|(?:rgba?|hsla?)\([^()]*\))/i.exec(d.value)?.[1]
          if (color) put(groups.color, `${d.name}-color`, theme.id, normalizeColor(color))
          break
        }
        case 'shadow':
          put(groups.shadow, d.name, theme.id, collapse(d.value))
          break
        case 'duration':
          put(groups.duration, d.name, theme.id, d.value)
          break
        case 'spacing':
          put(groups.spacing, d.name, theme.id, d.value)
          break
        case 'radius':
          put(groups.radius, d.name, theme.id, d.value)
          break
        case 'color':
          put(groups.color, d.name, theme.id, normalizeColor(d.value))
          break
        default:
          unplaced.push({ name: d.name, theme: theme.id, value: d.value })
      }
    }
  })
  return { groups, families, carried, comments, unplaced }
}

/** A plain string when only the first theme defines it, else per-theme values. */
export function shapeValue(entry, themes) {
  const defined = themes.filter((t) => t.id in entry)
  if (defined.length === 1 && defined[0].id === themes[0].id) return entry[themes[0].id]
  const out = {}
  for (const t of defined) out[t.id] = entry[t.id]
  return out
}

/**
 * Merges the extracted values with the hand-written notes
 * (content/tokens.notes.json) into the tokens.json the page reads.
 * Returns { tokens, missingUsage, problems }.
 */
export function buildTokens({ extracted, notes, themes, name, meta }) {
  const missingUsage = []
  const problems = []
  const seen = new Map()

  const family = (fam, themed) => {
    const n = notes[fam] ?? {}
    const tokens = []
    for (const [tname, entry] of extracted.groups[fam]) {
      const value = themed
        ? shapeValue(entry, themes)
        : (entry[themes[0].id] ?? Object.values(entry)[0])
      if (!themed && Object.keys(entry).length > 1) {
        problems.push(
          `${fam} token "${tname}" is redefined per theme; only the first theme's value is used`
        )
      }
      const usage = n.usage?.[tname] ?? extracted.comments.get(tname)
      if (!n.usage?.[tname]) missingUsage.push(`${fam}/${tname}`)
      tokens.push(usage ? { name: tname, value, usage } : { name: tname, value })
    }
    for (const extra of n.extra ?? []) tokens.push(extra)
    for (const t of tokens) {
      if (!TOKEN_NAME_RE.test(t.name)) problems.push(`invalid token name "${t.name}" in ${fam}`)
      if (seen.has(t.name))
        problems.push(`duplicate token "${t.name}" in ${fam} and ${seen.get(t.name)}`)
      seen.set(t.name, fam)
    }
    const out = {}
    if (n.note) out.note = n.note
    out.tokens = tokens
    return out
  }

  const color = family('color', true)
  const colorNames = new Set(color.tokens.map((t) => t.name))
  for (const t of color.tokens) {
    const values = typeof t.value === 'string' ? [t.value] : Object.values(t.value)
    for (const v of values) {
      const alias = /^\{(.+)\}$/.exec(v)?.[1]
      if (alias && !colorNames.has(alias))
        problems.push(`color "${t.name}" aliases missing token {${alias}}`)
      if (!alias && !COLOR_RE.test(v))
        problems.push(`color "${t.name}" has a value the page drops: ${v}`)
    }
  }

  const families = { ...extracted.families, ...(notes.type?.families ?? {}) }
  for (const [key, stack] of Object.entries(families)) {
    if (stack.length > 200 || /[;{}<>\\()]/.test(stack)) {
      problems.push(`type family "${key}" has a stack the page drops`)
    }
  }
  const type = { fonts: notes.type?.fonts ?? [], families, groups: notes.type?.groups ?? [] }

  const tokens = {
    name,
    version: 1,
    meta,
    color: { themes: themes.map(({ id, name: n }) => ({ id, name: n })), ...color },
    type,
    spacing: family('spacing', false),
    radius: family('radius', false),
    shadow: family('shadow', true),
    duration: family('duration', false),
  }
  for (const [key, value] of Object.entries(notes)) {
    if (!(key in tokens) && key !== 'type' && value?.tokens) {
      tokens[key] = value
      for (const t of value.tokens) {
        if (seen.has(t.name))
          problems.push(`duplicate token "${t.name}" in ${key} and ${seen.get(t.name)}`)
        seen.set(t.name, key)
      }
    }
  }
  return { tokens, missingUsage, problems }
}

/** The @import targets of an entry stylesheet, in order. */
export function parseImports(entryCss) {
  return [
    ...blankComments(entryCss).matchAll(/@import\s+(?:url\()?\s*['"]([^'"]+)['"]\s*\)?\s*;/g),
  ].map((m) => m[1])
}

/**
 * bundle.css = a prelude declaring the custom properties tokens.json cannot
 * carry (font aliases, gradients, composite borders), then every imported
 * stylesheet except the token file, verbatim and in import order.
 */
export function buildBundleCss({ header, themes, families, carried, parts }) {
  const lines = [header, ':root {']
  for (const key of Object.keys(families)) lines.push(`  --at-font-${key}: var(--font-${key});`)
  for (const [name, byTheme] of Object.entries(carried)) {
    if (themes[0].id in byTheme) lines.push(`  --${name}: ${byTheme[themes[0].id]};`)
  }
  lines.push('}', '')
  for (const theme of themes.slice(1)) {
    const own = Object.entries(carried).filter(([, byTheme]) => theme.id in byTheme)
    if (!own.length) continue
    lines.push(`${theme.selector} {`)
    for (const [name, byTheme] of own) lines.push(`  --${name}: ${byTheme[theme.id]};`)
    lines.push('}', '')
  }
  for (const { path, css } of parts) {
    lines.push(`/* ── ${path} ── */`, css.replace(/\s+$/, ''), '')
  }
  return lines.join('\n')
}

export const waveIconSvg = (path, ink) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 20" width="40" height="20" fill="none" stroke="${ink}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="${path}"/></svg>\n`

export const historyIconSvg = (paths, ink) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${ink}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths
    .map((d) => `<path d="${d}"/>`)
    .join('')}</svg>\n`

/** The `<path d>` lists of every `.history-icon` svg in HistoryControls.vue. */
export function extractHistoryPaths(vueSource) {
  return [...vueSource.matchAll(/<svg class="history-icon"[^>]*>([\s\S]*?)<\/svg>/g)].map((m) =>
    [...m[1].matchAll(/<path d="([^"]+)"/g)].map((p) => p[1])
  )
}

/** The design-system.json index for a system kept in files. */
export function buildIndex({ system, lock, assets, lastChange }) {
  const groups = {}
  const stale = []
  for (const { group, name, sha256: hash } of assets) {
    const g = (groups[group] ??= {
      name: group,
      tile: system.icons.tile,
      order: [],
      files: {},
    })
    g.order.push(name)
    const rec = lock[`${group}/${name}`]
    if (!rec) {
      stale.push({ path: `${group}/${name}`, reason: 'not uploaded yet' })
      continue
    }
    if (rec.sha256 !== hash)
      stale.push({ path: `${group}/${name}`, reason: 'changed since upload' })
    g.files[name] = { name, blob: rec.blob, size: rec.size, type: rec.type }
  }
  const index = {
    v: 3,
    layout: 'files',
    createdOnFiles: system.createdOnFiles,
    title: system.title,
    namespace: system.namespace,
    libraries: system.libraries ?? [],
    sections: {},
    groups: Object.keys(groups),
    assetGroups: groups,
    blobs: {},
    docs: { readme: 'project/README.md', sections: [] },
    lastChange,
  }
  return { index, stale }
}
