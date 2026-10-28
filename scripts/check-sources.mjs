// Fails the build when the Ask chat could cite a link that goes nowhere:
// every href in api/sources.js must name a real case study and a real section
// id on it (src/caseStudies.js), or a homepage anchor listed below. It also
// checks that the canned fallback answers cite only known sources.
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { caseStudies } from '../src/caseStudies.js'

const require = createRequire(import.meta.url)
const { SOURCES } = require('../api/sources.js')
const HOME_ANCHORS = ['work'] // ids rendered by src/App.jsx

const problems = []
for (const [id, { href }] of Object.entries(SOURCES)) {
  if (href === null) continue
  const url = new URL(href, 'https://grantzou.com')
  const anchor = url.hash.slice(1)
  if (url.pathname === '/') {
    if (anchor && !HOME_ANCHORS.includes(anchor)) problems.push(`${id}: homepage has no #${anchor}`)
    continue
  }
  const slug = url.pathname.replace(/^\/work\//, '').replace(/\/$/, '')
  const cs = caseStudies[slug]
  if (!url.pathname.startsWith('/work/') || !cs) { problems.push(`${id}: no case study at ${url.pathname}`); continue }
  if (anchor && !cs.sections.some((b) => b.id === anchor)) problems.push(`${id}: ${slug} has no section #${anchor}`)
}

const ask = readFileSync(new URL('../api/src/functions/ask.js', import.meta.url), 'utf8')
const training = readFileSync(new URL('../api/training.js', import.meta.url), 'utf8')
for (const [file, text] of [['ask.js', ask], ['training.js', training]]) {
  for (const [, inner] of text.matchAll(/\[\[([a-z-]+(?:\s*,\s*[a-z-]+)*)\]\]/g)) {
    for (const id of inner.split(',').map((x) => x.trim())) {
      if (!/^id\d?$/.test(id) && !SOURCES[id]) problems.push(`${file}: cites unknown source [[${id}]]`)
    }
  }
}

if (problems.length) {
  console.error('Ask chat sources are out of step with the site:\n  ' + problems.join('\n  '))
  process.exit(1)
}
console.log(`check-sources: ${Object.keys(SOURCES).length} sources, all links resolve`)
