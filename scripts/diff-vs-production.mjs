/**
 * Compare visible text of the generated static site against live production.
 * Both are prerendered, so this is a real content diff rather than a guess.
 */
import { readFileSync } from 'node:fs'

const ROUTES = [
  ['/', 'index.html'],
  ['/about', 'about/index.html'],
  ['/consulting', 'consulting/index.html'],
  ['/development', 'development/index.html'],
  ['/support', 'support/index.html'],
  ['/contact', 'contact/index.html'],
  ['/ideas', 'ideas/index.html'],
  ['/ideas/lack-of-interest', 'ideas/lack-of-interest/index.html'],
]

const OUT = new URL('../.output/public/', import.meta.url).pathname

/** Visible text only: drop script/style/svg, collapse whitespace, decode basics. */
function text(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/&mdash;/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Content words, for set comparison - ignores ordering and punctuation noise. */
function words(t) {
  return new Set(
    t
      .toLowerCase()
      .replace(/[^a-z0-9'\s-]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3),
  )
}

let worst = 0

for (const [route, file] of ROUTES) {
  let prod
  try {
    const r = await fetch(`https://smallrobot.co${route}`, {
      headers: { 'User-Agent': 'content-diff' },
    })
    prod = await r.text()
  } catch (e) {
    console.log(`${route.padEnd(26)} FETCH FAILED: ${e.message}`)
    continue
  }

  let mine
  try {
    mine = readFileSync(`${OUT}${file}`, 'utf8')
  } catch {
    console.log(`${route.padEnd(26)} LOCAL MISSING: ${file}`)
    continue
  }

  const pw = words(text(prod))
  const mw = words(text(mine))

  const missing = [...pw].filter((w) => !mw.has(w))
  const added = [...mw].filter((w) => !pw.has(w))
  const coverage = pw.size ? ((pw.size - missing.length) / pw.size) * 100 : 100
  worst = Math.max(worst, missing.length)

  console.log(
    `${route.padEnd(26)} prod:${String(pw.size).padStart(4)}w mine:${String(mw.size).padStart(4)}w cover:${coverage.toFixed(1)}% missing:${missing.length}`,
  )
  if (missing.length) console.log(`    MISSING: ${missing.slice(0, 30).join(' ')}`)
  if (added.length) console.log(`    ADDED  : ${added.slice(0, 15).join(' ')}`)
}

console.log(`\nlargest missing-word count on any route: ${worst}`)
