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
      'A badminton club app I own end to end, from strategy to store build: sign-ups and waitlists, cost splitting, stringing, stats and multi-club support, on the web with iOS and Android in beta. I write the plans and design rules; AI coding agents write all the code.',
    tags: ['0→1 Product', 'AI-native Workflow', 'Design Systems', 'Consumer App'],
    // The app is invite-only, so it links to its case study instead.
    url: null,
    linkLabel: null,
    caseStudy: 'bpm',
  },
]

export default projects
