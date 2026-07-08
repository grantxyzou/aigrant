// Case study content for grantzou.com — drop into src/ (or content/ under Next.js later).
// Presentational data only; no framework coupling. Keyed by URL slug: /work/<slug>.
//
// Section block types (rendered by CaseStudy.jsx):
//   { heading, body: [paragraphs] }            standard prose section
//   { heading, list: [items] }                  bulleted list
//   { heading, body, list }                     prose + list
//   { callout: { label, body: [paragraphs] } }  highlighted block (the "proud of" moments)
//   { figure: 'caption' }                       image placeholder

export const caseStudies = {
  'advertising-analytics': {
    slug: 'advertising-analytics',
    accent: 'gold',
    navLabel: 'Advertising Analytics',
    title: 'Advertising Analytics',
    subtitle: 'Helping Amazon sellers monitor performance and discover insights',
    summary:
      "Jungle Scout's first net-new feature for the Orange consumer product since 2021 — a PPC analytics experience built from the ground up on customer research.",
    meta: [
      { label: 'Role', value: 'Design owner · Researcher · Workshop facilitator' },
      { label: 'Company', value: 'Jungle Scout (Orange)' },
      { label: 'Timeline', value: 'Researched & designed 2021 · shipped Q1 2022' },
    ],
    tags: ['Analytics UX', 'Data Visualization', 'User Research', 'E-commerce', 'B2C SaaS'],
    sections: [
      {
        heading: 'The setup',
        body: [
          'In early 2021, Jungle Scout shifted design resources toward Cobalt, its enterprise tool for large brands and agencies. Orange — the consumer product that Amazon sellers actually use day to day — fell behind on feature innovation as a result.',
          'I was given the chance to move to the Orange team. Leaving a team I’d grown to love was hard, but after talking it through with my manager I saw it as a real growth opportunity: a chance to bring my design-process and collaboration experience — plus my own background as an Amazon seller — to a product that badly needed it.',
          'Advertising Analytics became the first net-new feature Orange had shipped since 2021, and I owned it end to end: customer interviews, synthesis, brainstorming workshops, and a clean spec handoff to engineering.',
        ],
      },
      {
        heading: 'The opportunity',
        body: [
          'Amazon sellers running Pay-per-click (PPC) campaigns were drowning in performance data with no way to turn it into action. They needed help understanding their advertising metrics and knowing what to do next to get their products to the top of the page.',
          'Jungle Scout Orange offered no solution for this. So I moved into research to understand the opportunity before designing anything.',
        ],
      },
      {
        heading: 'Research, part I — qualitative',
        body: [
          'Goal: understand what Orange customers actually need from advertising analytics, and where Amazon’s own Campaign Manager falls short for them.',
          'I interviewed 6 Orange customers across a range of selling experience, all actively running Amazon campaigns. Then I ran synthesis sessions with my Product Manager in FigJam, clustering what we heard into themes. What we heard: sellers couldn’t make sense of the advertising metrics in front of them, and they wanted guidance on the moves that would actually lift their placement.',
        ],
      },
      { figure: 'FigJam synthesis board — virtual stickies grouped into themes' },
      {
        heading: 'Research, part II — quantitative',
        body: [
          'Qualitative research told us what mattered. A quantitative study told us what mattered most.',
          'I built an in-app survey asking customers to rank 7 identified needs. 216 sellers responded (17% drop-off). Combined with a read on what data we already had available, that let us focus v1 on the three highest-value themes:',
        ],
        list: ['Analyze my PPC performance', 'PPC insights', 'Recommend a PPC strategy to learn'],
      },
      {
        heading: 'The workshop',
        body: [
          'Orange hadn’t had updates in a while, so a net-new feature made a lot of stakeholders eager to weigh in. Rather than fight that, I channeled it: I facilitated a 60-minute online brainstorming workshop built around the validated themes.',
          'I opened with a quick recap of where the opportunity came from and how we’d arrived at the themes, then opened the floor. The ideas came fast. Because everyone had been part of the process, there were no surprises at sign-off.',
        ],
      },
      {
        heading: 'Design process',
        body: [
          'Personas — I adapted our existing Orange personas to fit the advertising-analytics context using what the research surfaced.',
          'Jobs to be done — one statement kept me honest about what the feature had to do: "As an Orange user, I want to see if there are any changes I need to make to my PPC strategy. I expect the feature to answer all of my yes/no questions and some of my what/why questions."',
          'Data visualization — I took data sets that were foreign to most customers and shaped them into visualizations that answered real business questions. My PM, also an Amazon seller, and I spent a week mapping charts to the questions sellers actually ask. Then I concept-tested them on UserZoom Go with real Amazon sellers.',
        ],
      },
      { figure: 'Data-visualization explorations' },
      {
        heading: 'The final design',
        body: [
          'A three-tab feature that puts Jungle Scout’s industry expertise to work interpreting each seller’s advertising data:',
        ],
        list: [
          'Overview — company-level ads performance at a glance',
          'Sales Activity — ASIN-level ads performance',
          'Advertising Analytics — campaign-agnostic view of top-performing campaigns, ad groups, and product ads',
        ],
      },
      { figure: 'Final UI — Overview, Sales Activity, Advertising Analytics tabs' },
      {
        callout: {
          label: 'What I took away',
          body: [
            'Pull stakeholders in early and often. Demonstrating research as the project moved along — the workshop especially — meant I never had to dump a mountain of information at final sign-off. Progressive collaboration beats a big reveal.',
            'Challenge the brief; avoid "solution-eering." When this brief arrived with a solution implied, I flagged it to the PM, ran the interviews to validate the real need first, and rewrote the brief to strip out the solution-suggestive language. Solving an unvalidated problem is the expensive mistake.',
          ],
        },
      },
    ],
  },

  'azure-storage-mover-s3': {
    slug: 'azure-storage-mover-s3',
    accent: 'azure',
    navLabel: 'Azure Storage Mover',
    title: 'Azure Storage Mover — S3 Redesign',
    subtitle: "Making cross-cloud migration setup honest about what it can and can't promise",
    summary:
      'Extending Azure Storage Mover to migrate from S3-compatible object stores — redesigned around a single readiness model so users stop abandoning setup at hidden prerequisites, and around validation that never overstates what the system actually checked.',
    meta: [
      { label: 'Role', value: 'Design owner (design exploration & brief)' },
      { label: 'Product', value: 'Azure Storage Mover' },
      { label: 'Focus', value: 'Agentless S3 / GCS sources · prerequisite clarity · validation semantics' },
    ],
    tags: ['Enterprise UX', 'Agentic Design', 'Cloud Infrastructure', 'Systems Design', 'Copilot / AI'],
    sections: [
      {
        heading: 'The problem',
        body: [
          'Cross-cloud migration is unforgiving at setup time. Storage Mover already handled SMB/NFS scenarios, but extending it to agentless S3-compatible sources meant users had to line up a chain of prerequisites — credential references, permissions, networking, endpoints — before anything could run.',
          'The failure mode wasn’t confusion in the moment. It was late discovery: users would get deep into a flow, then hit a requirement they didn’t know existed, and drop off. And a subtler failure sat underneath it — a job could report success while the migration hadn’t actually been verified, leaving users to believe they were done when they weren’t.',
          'That second problem is the one I care most about across my work: false completion — when the interface lets someone think a task is finished before it really is.',
        ],
      },
      {
        heading: 'The approach',
        body: ['I anchored the redesign on a handful of experience principles:'],
        list: [
          'Upfront clarity without hard blocking — prerequisites are visible early, but users can still explore the flow before every requirement is satisfied.',
          'One place for "what’s next" — no matter where you enter (project, job, endpoint, or agent), a single readiness model shows what’s still missing.',
          'Inline guidance, not detours — when you need a dependency, the flow helps you create or select it in context instead of exiling you elsewhere.',
          'Honest validation — validate only what can genuinely be validated; don’t imply a check the system can’t actually perform.',
        ],
      },
      {
        heading: 'Key design decisions',
        body: [
          'A shared four-step mental model applied consistently across every source type, so S3 doesn’t feel like a bolted-on special case: Prerequisites → Source configuration → Target configuration → Migration job execution.',
          'A readiness / overview area surfaces prerequisites per source type, distinguishes required from optional, and links directly to the actions that resolve them. A first-class agentless source-creation step collects the source name, endpoint, and credential references as a real prerequisite in the job flow.',
          'And a deliberate restraint: I did not redesign the whole create-job flow. The existing structure worked; the leverage was in better prerequisite surfacing, source creation, and blocking "Run" until required steps are complete while still allowing preview. Knowing what to leave alone was part of the design.',
        ],
      },
      { figure: 'Readiness model + agentless S3 source-creation flow' },
      {
        callout: {
          label: 'The validation decision (the part I’m proudest of)',
          body: [
            'Users want reassurance their migration worked. But the honest scope of what could be checked was metadata-level completeness — comparing file counts — not connectivity, corruption, or cryptographic checksums.',
            'The tempting move is to let a green checkmark quietly imply more than that. I designed against it: validation is opt-in and stays visible in the job summary; execution status and validation outcome are decoupled, so a run can complete while validation flags a discrepancy, with neutral language ("Run complete") so success never masquerades as verification; and results are accessible, so "something’s off" comes with somewhere to look.',
            'This is false-completion design in miniature: the interface is careful never to let "the job ran" be misread as "the data is guaranteed."',
          ],
        },
      },
      {
        heading: 'Why this work matters to me',
        body: [
          'Enterprise infrastructure UX rarely gets to be flashy. Its job is to keep a competent person from failing at something consequential — moving data across clouds — because a requirement was hidden or a status was overstated. This redesign is my argument that the highest-value design move in these flows is honesty: about what you’ll need before you start, and about what the system actually verified before it tells you you’re done.',
        ],
      },
    ],
  },
}

export default caseStudies
