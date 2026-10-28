// Selected projects — things shipped outside of client work.
// Presentational data only, mirroring caseStudies.js. Rendered as a homepage
// section between "Work experience" and the perspectives CTA (SPEC.md §02).
//
//   name        display title
//   description one short paragraph
//   tags        method/skill tags — rendered as .experience-tag pills
//   url         live URL, or null to render the entry without an outbound link
//   linkLabel   text for the outbound link
//   caseStudy   slug from caseStudies.js, or null when the project stands alone

export const projects = [
  {
    slug: 'bpm',
    name: 'BPM',
    description:
      'A badminton club app I own end to end, from strategy to store build: sign-ups and waitlists, cost splitting, stringing, stats and multi-club support, on iOS, Android and the web. Designed from written plans and built with AI coding agents.',
    tags: ['0→1 Product', 'AI-native Workflow', 'Design Systems', 'Consumer App'],
    // The app is invite-only, so it links to its case study instead.
    url: null,
    linkLabel: null,
    caseStudy: 'bpm',
  },
  {
    slug: 'courtside',
    name: 'Courtside',
    description:
      'A volleyball playoff system that keeps score and tracks team movement through the bracket — built to replace the spreadsheet these tournaments usually run on.',
    tags: ['Consumer App', 'Live Scoring', 'Tournament Ops'],
    url: 'https://volleyball-league-ivory.vercel.app/l/hjsc-wednesday-coed-6s',
    linkLabel: 'Open Courtside',
    caseStudy: null,
  },
]

export default projects
