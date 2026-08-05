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
      'Badminton sign-up, admin control, and skill improvement in one app. AI is wired in to help players understand what to work on next and actually advance.',
    tags: ['Consumer App', 'AI Coaching', 'Scheduling', 'Admin Tooling'],
    url: 'https://vnext-badminton-app-enhcave5djcvafe9.canadacentral-01.azurewebsites.net/bpm',
    linkLabel: 'Open BPM',
    caseStudy: null,
  },
  {
    slug: 'courtside',
    name: 'Courtside',
    description:
      'A volleyball playoff system that keeps score and tracks team movement through the bracket — built to replace the spreadsheet these tournaments usually run on.',
    tags: ['Consumer App', 'Live Scoring', 'Tournament Ops'],
    // No URL yet: the address supplied for Courtside pointed at BPM. The entry
    // renders without an outbound link until its own URL is filled in.
    url: null,
    linkLabel: 'Open Courtside',
    caseStudy: null,
  },
]

export default projects
