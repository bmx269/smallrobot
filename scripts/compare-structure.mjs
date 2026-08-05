/**
 * Compare the DOM structure of generated pages against live production.
 *
 * Text parity (scripts/diff-vs-production.mjs) does not catch structural regressions,
 * and this site's CSS is unusually sensitive to them: the old Ember app leaned on
 * classic components' implicit wrapper elements, and several stylesheet rules key off
 * both those wrappers and `:nth-child()` parity across them. Dropping a wrapper silently
 * unstyles whole sections rather than losing any text.
 */
import { readFileSync } from 'node:fs'

const OUT = new URL('../.output/public/', import.meta.url).pathname

const ROUTES = [
  ['/', 'index.html'],
  ['/about', 'about/index.html'],
  ['/development', 'development/index.html'],
  ['/ideas', 'ideas/index.html'],
]

const VOID = new Set([
  'img', 'br', 'input', 'meta', 'link', 'hr', 'source', 'area',
  'col', 'embed', 'track', 'wbr', 'path', 'polygon', 'circle', 'rect', 'use', 'stop',
])

/** Immediate element children of the first element carrying `className`. */
function childrenOf(html, className) {
  const open = `<div class="${className}">`
  const i = html.indexOf(open)
  if (i === -1) return null
  const tail = html.slice(i + open.length)

  const out = []
  let depth = 0
  const re = /<(\/?)([a-zA-Z][\w-]*)([^>]*?)(\/?)>/g
  let m
  while ((m = re.exec(tail))) {
    const [, slash, tag, attrs, selfClose] = m
    const t = tag.toLowerCase()
    if (VOID.has(t) || selfClose) continue
    if (!slash) {
      if (depth === 0) {
        const cls = (attrs.match(/class="([^"]*)"/) || [])[1] || ''
        out.push({ tag: t, cls })
      }
      depth++
    } else {
      depth--
      if (depth < 0) break
    }
  }
  return out
}

/** Ember stamps `ember-view` on every classic component's element; ignore it. */
function normalise(children) {
  return children.map(({ tag, cls }) => {
    const kept = cls
      .split(/\s+/)
      .filter((c) => c && c !== 'ember-view')
      // our own equivalents of the wrappers Ember generated anonymously
      .filter((c) => c !== 'global-header' && c !== 'global-footer')
    return `${tag}${kept.length ? '.' + kept.join('.') : ''}`
  })
}

let failures = 0

for (const [route, file] of ROUTES) {
  const prodHtml = await (await fetch(`https://smallrobot.co${route}`)).text()
  const mineHtml = readFileSync(`${OUT}${file}`, 'utf8')

  const prod = childrenOf(prodHtml, 'bm-content')
  const mine = childrenOf(mineHtml, 'bm-content')

  if (!prod || !mine) {
    console.log(`${route}: could not locate .bm-content (prod:${!!prod} mine:${!!mine})`)
    failures++
    continue
  }

  const p = normalise(prod)
  const m = normalise(mine)

  // Production is a stale prerender, so section *counts* can legitimately differ as CMS
  // content changed. What must match is the shape: hamburger, header, then page-sections,
  // then footer — and critically the index at which page-sections start, since that sets
  // nth-child parity.
  const pFirst = p.findIndex((x) => x.startsWith('section.page-section'))
  const mFirst = m.findIndex((x) => x.startsWith('section.page-section'))
  const pSections = p.filter((x) => x.startsWith('section.page-section')).length
  const mSections = m.filter((x) => x.startsWith('section.page-section')).length

  const ok = pFirst === mFirst
  if (!ok) failures++

  console.log(`${route}`)
  console.log(`  prod: ${p.join(' | ')}`)
  console.log(`  mine: ${m.join(' | ')}`)
  console.log(
    `  first page-section index  prod:${pFirst} mine:${mFirst}  ${ok ? 'MATCH' : 'MISMATCH -> nth-child parity differs'}`,
  )
  console.log(`  page-section count        prod:${pSections} mine:${mSections} (may differ; prod is a stale prerender)`)
}

console.log(`\n${failures === 0 ? 'structure OK' : `${failures} structural mismatch(es)`}`)
process.exit(failures === 0 ? 0 : 1)
