// Writes api/caseStudies.generated.json: the published case studies, section by
// section, in the shape the story composer (api/src/functions/story.js) reads.
// The story may only ever be written from what a case study already says, and
// each block it writes cites the section ids listed here.
//
// Runs as the first step of `npm run build`, so the deployed API always matches
// the deployed pages. The output is committed too, so `func start` works
// locally without a build.
import { writeFileSync } from 'node:fs'
import { caseStudies } from '../src/caseStudies.js'

const text = (b) => [
  ...(b.body || []),
  ...(b.list || []).map((x) => `- ${x}`),
  ...(b.callout?.body || []),
].join('\n')

const out = {}
for (const [slug, cs] of Object.entries(caseStudies)) {
  out[slug] = {
    title: cs.title,
    navLabel: cs.navLabel || cs.title,
    sections: cs.sections
      .filter((b) => b.id && (b.body || b.list || b.callout))
      .map((b) => ({ id: b.id, label: b.heading || b.callout.label, text: text(b) })),
  }
}

const path = new URL('../api/caseStudies.generated.json', import.meta.url)
writeFileSync(path, JSON.stringify(out, null, 2) + '\n')
console.log(`export-case-studies: ${Object.keys(out).length} case studies → api/caseStudies.generated.json`)
