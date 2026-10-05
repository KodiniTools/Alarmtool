#!/usr/bin/env node
/* global process, Buffer */
/* eslint-disable no-console -- CLI output */
// Builds the Alarmtool Design System artifact folder (design-system/dist/project)
// from the app's real sources: src/styles/tokens.css → tokens.json, the
// imported stylesheets → components/bundle.css, waveforms.js and
// HistoryControls.vue → assets/Icons/*.svg, plus the hand-written docs and
// previews under content/. See design-system/README.md.
//
//   node design-system/build.mjs            build into design-system/dist
//   node design-system/build.mjs --check    build and fail on anything incomplete
//   --out <dir> · --note "<text>" · --by <name> · --via <text>
import { execFileSync } from 'node:child_process'
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import {
  buildBundleCss,
  buildIndex,
  buildTokens,
  extractHistoryPaths,
  extractTokens,
  historyIconSvg,
  parseImports,
  sha256,
  waveIconSvg,
} from './lib.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(here, '..')
const args = process.argv.slice(2)
const flag = (name) => args.includes(name)
const option = (name) => {
  const i = args.indexOf(name)
  return i !== -1 ? args[i + 1] : undefined
}
const check = flag('--check')
const outDir = join(repoRoot, option('--out') ?? 'design-system/dist')
const projectDir = join(outDir, 'project')

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'))
const git = (...a) => {
  try {
    return execFileSync('git', a, { cwd: repoRoot, encoding: 'utf8' }).trim()
  } catch {
    return ''
  }
}

const system = readJson(join(here, 'system.json'))
const notes = readJson(join(here, 'content/tokens.notes.json'))
const lock = existsSync(join(here, 'assets.lock.json'))
  ? readJson(join(here, 'assets.lock.json'))
  : {}

const sha = git('rev-parse', '--short', 'HEAD') || 'unknown'
const branch = git('rev-parse', '--abbrev-ref', 'HEAD') || 'unknown'
const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')
const warnings = []
const errors = []

// ── 1. tokens.json ───────────────────────────────────────────────────────────
const tokensCss = readFileSync(join(repoRoot, system.sources.tokens), 'utf8')
const extracted = extractTokens(tokensCss, system.themes)
for (const u of extracted.unplaced) {
  errors.push(
    `cannot place --${u.name} (${u.theme}): ${u.value} — add a rule in lib.mjs classify()`
  )
}
const meta = {
  source: 'github',
  repo: system.repo,
  ref: `${branch}@${sha}`,
  package: '.',
  paths: {
    tokens: [system.sources.tokens, system.sources.stylesEntry],
    fonts: [
      `${system.sources.tokens} (@font-face; the font file is served from the host, not in the repo)`,
    ],
    assets: [system.sources.waveforms, system.sources.history],
    docs: system.sources.docs,
  },
  components: system.components,
  synced: now.slice(0, 10),
}
const { tokens, missingUsage, problems } = buildTokens({
  extracted,
  notes,
  themes: system.themes,
  name: system.name,
  meta,
})
errors.push(...problems)
for (const m of missingUsage) {
  ;(check ? errors : warnings).push(`no usage note for ${m} in content/tokens.notes.json`)
}

// ── 2. components/bundle.css ─────────────────────────────────────────────────
const entryPath = join(repoRoot, system.sources.stylesEntry)
const entryDir = dirname(entryPath)
const parts = parseImports(readFileSync(entryPath, 'utf8'))
  .map((rel) => join(entryDir, rel))
  .filter((p) => relative(repoRoot, p) !== system.sources.tokens)
  .map((p) => ({ path: relative(repoRoot, p), css: readFileSync(p, 'utf8') }))
const bundleCss = buildBundleCss({
  header: [
    `/* ${system.name} — bundle.css`,
    `   ${parts.map((p) => p.path).join(',\n   ')}`,
    `   from ${system.repo}@${sha}, verbatim and in ${system.sources.stylesEntry} import order. The custom`,
    '   properties tokens.json cannot carry (font aliases, gradients, composite borders) are declared',
    `   first, with the values of ${system.sources.tokens}. */`,
  ].join('\n'),
  themes: system.themes,
  families: extracted.families,
  carried: extracted.carried,
  parts,
})
if (/<\/style/i.test(bundleCss))
  errors.push('bundle.css contains "</style" — a consumer cannot inline it')
if (Buffer.byteLength(bundleCss) > 2 * 1024 * 1024) errors.push('bundle.css exceeds 2 MB')

// ── 3. assets/Icons/*.svg ────────────────────────────────────────────────────
const { WAVE_TYPES } = await import(pathToFileURL(join(repoRoot, system.sources.waveforms)).href)
const historyPaths = extractHistoryPaths(
  readFileSync(join(repoRoot, system.sources.history), 'utf8')
)
if (historyPaths.length !== system.icons.history.length) {
  errors.push(
    `expected ${system.icons.history.length} history icons in ${system.sources.history}, found ${historyPaths.length}`
  )
}
const icons = [
  ...WAVE_TYPES.map((w) => ({
    name: `wave-${w.value}.svg`,
    svg: waveIconSvg(w.svgPath, system.icons.ink),
  })),
  ...historyPaths.map((paths, i) => ({
    name: system.icons.history[i],
    svg: historyIconSvg(paths, system.icons.ink),
  })),
].map((icon) => ({ ...icon, group: system.icons.group, sha256: sha256(icon.svg) }))

// ── 4. design-system.json ────────────────────────────────────────────────────
const by = option('--by') || git('config', 'user.name') || 'build'
const via =
  option('--via') ||
  `${process.env.CI ? 'CI · ' : ''}design-system/build.mjs · ${system.repo}@${sha}`
const counts = `${tokens.color.tokens.length} colors × ${system.themes.length} themes, ${tokens.type.groups.reduce(
  (n, g) => n + g.styles.length,
  0
)} text styles, ${tokens.spacing.tokens.length} spacing, ${tokens.radius.tokens.length} radii, ${
  tokens.shadow.tokens.length
} shadows, ${Object.keys(system.components).length} components, ${icons.length} icons`
const { index, stale } = buildIndex({
  system,
  lock,
  assets: icons,
  lastChange: { by, at: now, via, note: option('--note') || `rebuilt from ${sha}: ${counts}` },
})
for (const s of stale)
  warnings.push(`asset ${s.path} ${s.reason} — upload it and update assets.lock.json`)

// ── 5. write dist/ ───────────────────────────────────────────────────────────
if (errors.length) {
  for (const e of errors) console.error(`✖ ${e}`)
  process.exit(1)
}
rmSync(projectDir, { recursive: true, force: true })
mkdirSync(join(projectDir, 'components'), { recursive: true })
cpSync(join(here, 'content'), projectDir, {
  recursive: true,
  filter: (src) => !src.endsWith('tokens.notes.json'),
})
const write = (rel, text) => {
  const p = join(projectDir, rel)
  mkdirSync(dirname(p), { recursive: true })
  writeFileSync(p, text)
}
write('tokens.json', JSON.stringify(tokens, null, 2) + '\n')
write('components/bundle.css', bundleCss)
for (const icon of icons) write(`assets/${icon.group}/${icon.name}`, icon.svg)
write('design-system.json', JSON.stringify(index, null, 2) + '\n')

const files = []
const walk = (dir) => {
  for (const entry of readdirSync(dir).sort()) {
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) walk(p)
    else files.push(relative(outDir, p).split('\\').join('/'))
  }
}
walk(projectDir)
const isUpload = (f) => f.startsWith('project/assets/') && !/\.(md|json|csv|txt)$/.test(f)
writeFileSync(
  join(outDir, 'publish.json'),
  JSON.stringify(
    {
      url: system.url,
      root: relative(repoRoot, outDir).split('\\').join('/'),
      index: 'project/design-system.json',
      files: files.filter((f) => f !== 'project/design-system.json' && !isUpload(f)),
      assets: icons.map((i) => ({
        path: `project/assets/${i.group}/${i.name}`,
        key: `${i.group}/${i.name}`,
        sha256: i.sha256,
        status: stale.find((s) => s.path === `${i.group}/${i.name}`) ? 'needs-upload' : 'current',
      })),
      lastChange: index.lastChange,
    },
    null,
    2
  ) + '\n'
)

for (const w of warnings) console.warn(`▲ ${w}`)
console.log(`✔ ${relative(repoRoot, projectDir)} — ${counts} (${system.repo}@${sha})`)
