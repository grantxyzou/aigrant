// Case study content for grantzou.com — drop into src/ (or content/ under Next.js later).
// Presentational data only; no framework coupling. Keyed by URL slug: /work/<slug>.
//
// Section block types (rendered by CaseStudy.jsx):
//   { heading, body: [paragraphs] }            standard prose section
//   { heading, list: [items] }                  bulleted list
//   { heading, body, list }                     prose + list
//   { callout: { label, body: [paragraphs] } }  highlighted block (the "proud of" moments)
//   { figure: 'caption' }                       image placeholder
//   { figure: 'caption', images: [{ src, alt }] }  real screenshots, side by side

export const caseStudies = {
  'advertising-analytics': {
    slug: 'advertising-analytics',
    accent: 'gold',
    mood: 'hearth',
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
    mood: 'tide',
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

  bpm: {
    slug: 'bpm',
    accent: 'gold',
    mood: 'dawn',
    navLabel: 'BPM',
    title: 'BPM — a badminton club, run by an app I own end to end',
    subtitle: 'What I do when I am the designer, the PM and the person who answers the group chat',
    summary:
      'BPM started as a fix for my own Thursday night badminton: sign-ups in a chat thread, a waitlist in my head, and money in a spreadsheet. It is now a web app, with iOS and Android versions in beta testing, covering sign-ups, waitlists, cost splitting, stringing, stats and multi-club support. I own every decision in it, and I don’t write code: AI coding agents build it from my written plans.',
    meta: [
      { label: 'Role', value: 'Founder · product designer · product owner' },
      { label: 'Platforms', value: 'Web app · iOS and Android in beta testing · English and 简体中文' },
      { label: 'Build', value: 'My plans, specs and design rules · all code written by AI agents (Claude Code)' },
      { label: 'Timeline', value: '2026 – ongoing, used every week' },
    ],
    tags: ['0→1 Product', 'Product Strategy', 'AI-native Workflow', 'Design Systems', 'Consumer App'],
    sections: [
      {
        heading: 'The problem',
        body: [
          'A casual club runs on a weekly loop: open sign-ups, cap the courts, keep a waitlist, play, split the cost, chase who has not paid. In most clubs, mine included, that loop lives in a group chat and a spreadsheet, and the organiser carries the rest in their head.',
          'So the Home screen answers the only three questions people open the app for: when and where, am I in, and what do I owe. Everything else in BPM is in service of those three, or it waits.',
        ],
      },
      {
        figure: 'Home, the roster with its waitlist, and a player’s balance. Demo data.',
        images: [
          { src: '/work/bpm/home-signup.webp', alt: 'BPM Home screen with the session’s place and time, spots left and a Sign up button' },
          { src: '/work/bpm/roster-waitlist.webp', alt: 'Numbered roster of twelve players with a two-person waitlist below' },
          { src: '/work/bpm/balance.webp', alt: 'A player’s balance card showing $15 owed and an I’ve sent it button' },
        ],
      },
      {
        heading: 'Running it like a product, not a side project',
        body: [
          'Owning something alone makes it easy to build whatever is fun next. I put guardrails on myself that I would expect from a good product team:',
        ],
        list: [
          'A written north star and a list of non-goals. "Generic court booking platform" and "multi-sport app" are written down as drift, so I can say no to them quickly.',
          'A change rule: every piece of work has to name the goal it serves, or it becomes a parked issue instead of a branch.',
          'Kill criteria written before building. The engagement slice would be cut if fewer than 40% of early users came back to it more than once and fewer than 30% logged a game.',
          'A plan document written first for every feature: the problem in the player’s own words, the kill criterion, the non-goals. Then the design, then the code, then the changelog.',
        ],
      },
      {
        heading: 'A small story: "kudos goes away with the session too fast"',
        body: [
          'Players can send kudos to people they played with. Two pieces of feedback came in: "kudos goes away with the session too fast", and "how do I give kudos to other people?" The second one stung, because my own answer to it was wrong.',
          'The rule was "you can thank someone who is on this week’s roster". But I advance the session to next week a few minutes after play ends, so the people you had just played with stopped being eligible almost at once. On top of that, the kudos card hid itself when there was nobody to thank, so nobody could see the rule at all.',
          'The fix had two halves. Eligibility became "anyone you shared a roster with in your last eight sessions", owned by one shared function so the screen and the server can never disagree about it. And the card is never allowed to vanish: it always shows loading, empty, error or ready, so a person can see why they can or can’t do something.',
        ],
      },
      {
        callout: {
          label: 'The thread through all my work: honest state',
          body: [
            'In my enterprise work on cloud migration, "the job ran" must never be read as "the data is verified". BPM is the same principle with nobody else to blame:',
            'A screen that failed to load must never look like a screen with nothing in it. An outage once looked exactly like "no data", so now every card tells the two apart, and the server answers a failed read with an error rather than an empty list.',
            'A quote is a range and a bill is a number. A restring shows "$28–32" while the price is still provisional, and the exact amount only once it is really owed. A metric without enough data shows "—", never 0. And "I don’t know yet" is never shown as "no".',
          ],
        },
      },
      {
        heading: 'Choosing what not to measure',
        body: [
          'The first Stats tab counted attendance and streaks. I deleted all of it. A casual player who missed three weeks does not need a broken streak telling them so. Stats now measures you against your own past, and comparing yourself with the club is opt-in, asked once, and private by default.',
          'That was a product decision, not a backlog item, and I wrote it down so the AI-written weekly greeting is never even given attendance counts. That way it can’t bring the guilt back in.',
        ],
      },
      {
        figure: 'Stats measured against yourself, an organiser’s bill, and creating a second club. Demo data.',
        images: [
          { src: '/work/bpm/stats-play.webp', alt: 'Stats screen showing level 3.1 of 5, one logged game and a who-you-play-with card' },
          { src: '/work/bpm/admin-send-the-bill.webp', alt: 'Organiser console with the next session, sign-up count, deadline and payments' },
          { src: '/work/bpm/create-club.webp', alt: 'Create a group screen asking for a group name and your name in this group' },
        ],
      },
      {
        heading: 'From one club to many, without breaking the first',
        body: [
          'To get ready for the app stores, BPM had to serve more than my club. I chose "one account, many clubs": a person is one account, and their role and display name belong to each club separately, because the same Lin can be an organiser in one club and a player in another.',
          'I phased it so it could always be rolled back with one setting, migrated the existing club in place without changing a single record id, and made sign-up invite-only with one-time links. The rule I designed around: a name only means something inside a club.',
        ],
      },
      {
        heading: 'How I use AI to build it',
        body: [
          'I don’t write code. I write the plan, the design decisions and the rules, and AI coding agents implement them. The craft moved up a level: what I am really designing is the system that keeps a fast-moving AI build honest.',
        ],
        list: [
          'The design system enforces itself. Corner radii, the spacing scale, type sizes, sheet sizes and loading skeletons are checked by automated tests, so drift fails the build instead of waiting for a design review.',
          'The project memory is a living document of decisions and the bugs behind them, so each new agent session starts from what the last one learned.',
          'An AI review bot reviews every pull request against written review rules, and no change reaches production without passing the full test suite. Roughly 5,400 automated tests guard about 720 merged pull requests.',
          'AI is also in the product: a weekly read of your game, a plain-language verdict on how your racket fits you, and an organiser’s announcement tidied up before it goes out.',
        ],
      },
      {
        heading: 'Where it is now',
        body: [
          'In the first twelve days of first-party usage tracking, 19 members opened the app 210 times and moved between tabs 809 times. Next is the real test of multi-club: a second club running a full session from sign-up to settled bill.',
          'BPM is my proof that the principle I bring to enterprise work holds when I also own the strategy, the trade-offs and the consequences. It is also where I learned what a designer can do when AI does the building.',
        ],
      },
      { liveStats: 'bpm' },
    ],
  },
}

export default caseStudies
