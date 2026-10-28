// The Ask chat's citable sources. Every answer cites these by id as [[id]];
// the server keeps only ids listed here, so a model can never invent a source,
// and the page turns each one into a numbered link to the section it names.
//
// href is a path on this site (/work/<slug>#<section id>). The section ids live
// on the blocks in src/caseStudies.js, and scripts/check-sources.mjs fails the
// build if an href here points at one that does not exist.
//
// `background` has no href on purpose: it is what Grant has told the assistant
// that is not published as a page. Citing it says so, rather than pointing the
// reader at a page that would not back the claim up.

const SOURCES = {
    about: {
        label: 'About Grant',
        href: '/',
        covers: 'who Grant is, his design philosophy (false completion, systems that explain themselves), his education and his interests',
    },
    'work-azure': {
        label: 'Work experience · Microsoft Azure',
        href: '/#work',
        covers: 'his role at Microsoft Azure since 2022 at a generic level: cost management, cloud infrastructure, and AI work on Copilot for Azure (a cost-management skill, a data-migration agent, the shared design system)',
    },
    'work-history': {
        label: 'Work experience · Jungle Scout and Visier',
        href: '/#work',
        covers: 'his roles and dates at Jungle Scout (2020–2022) and Visier (2018–2019)',
    },
    'storage-mover': {
        label: 'Storage Mover · The problem',
        href: '/work/azure-storage-mover-s3#problem',
        covers: 'the Storage Mover S3 problem: late-discovered prerequisites, setup abandonment, and false completion',
    },
    'storage-mover-approach': {
        label: 'Storage Mover · Approach and key decisions',
        href: '/work/azure-storage-mover-s3#approach',
        covers: 'the readiness model, the four-step mental model, inline guidance, and leaving the create-job flow alone',
    },
    'storage-mover-validation': {
        label: 'Storage Mover · The validation decision',
        href: '/work/azure-storage-mover-s3#validation',
        covers: 'honest validation: opt-in, decoupled from job status, "Run complete" wording',
    },
    'ads-setup': {
        label: 'Advertising Analytics · The setup',
        href: '/work/advertising-analytics#setup',
        covers: 'why he moved to the Orange team and owned the feature end to end; first net-new feature since 2021; shipped Q1 2022',
    },
    'ads-research': {
        label: 'Advertising Analytics · Research',
        href: '/work/advertising-analytics#research-qualitative',
        covers: 'the 6 seller interviews, FigJam synthesis with the PM, and the 216-participant survey',
    },
    'ads-workshop': {
        label: 'Advertising Analytics · The workshop',
        href: '/work/advertising-analytics#workshop',
        covers: 'the 60-minute stakeholder workshop and challenging a solution-first brief',
    },
    'ads-design': {
        label: 'Advertising Analytics · Design',
        href: '/work/advertising-analytics#design-process',
        covers: 'personas, jobs to be done, the data visualisation and the three-tab final design',
    },
    bpm: {
        label: 'BPM · The problem',
        href: '/work/bpm#problem',
        covers: 'what BPM is, what it does, its platforms and status (web app; iOS and Android in beta testing)',
    },
    'bpm-running': {
        label: 'BPM · Running it like a product',
        href: '/work/bpm#running-it',
        covers: 'north star, non-goals, the change rule, kill criteria, plan documents written first',
    },
    'bpm-kudos': {
        label: 'BPM · The kudos story',
        href: '/work/bpm#kudos',
        covers: 'the "kudos goes away too fast" feedback, the diagnosis and the fix',
    },
    'bpm-honest-state': {
        label: 'BPM · Honest state',
        href: '/work/bpm#honest-state',
        covers: 'failed loads never look empty, a quote is a range and a bill is a number, "—" not 0',
    },
    'bpm-stats': {
        label: 'BPM · Choosing what not to measure',
        href: '/work/bpm#what-not-to-measure',
        covers: 'removing attendance streaks, measuring you against yourself, opt-in club comparison',
    },
    'bpm-clubs': {
        label: 'BPM · From one club to many',
        href: '/work/bpm#many-clubs',
        covers: 'one account many clubs, the phased rollout with a one-setting rollback, invite-only sign-up',
    },
    'bpm-ai': {
        label: 'BPM · How I use AI to build it',
        href: '/work/bpm#ai-build',
        covers: 'he writes no code; AI agents build from his plans; the self-enforcing design system, the review bot, test and PR counts, AI features in the product',
    },
    'bpm-now': {
        label: 'BPM · Where it is now',
        href: '/work/bpm#now',
        covers: 'usage so far and what comes next',
    },
    background: {
        label: 'Grant’s background notes (not a page on this site)',
        href: null,
        covers: 'anything true from the training context that no page above shows, such as his Visier projects, his tools, or how he likes to work',
    },
};

// The block the system prompt carries, so the model sees exactly the ids the
// server will accept.
const sourcesPrompt = Object.entries(SOURCES)
    .map(([id, s]) => `- ${id}: ${s.covers}`)
    .join('\n');

const MARKER = /\[\[([^\]]+)\]\]/g;

// Keep the markers that name a real source, drop the rest, and list the
// sources in the order the answer first cites them. The text keeps its
// [[id]] markers: the page numbers them, and sending the conversation back
// keeps the model writing in the same format.
function resolveCitations(text) {
    const order = [];
    const cleaned = String(text).replace(MARKER, (_m, inner) => {
        const ids = inner.split(',').map((x) => x.trim()).filter((id) => SOURCES[id]);
        ids.forEach((id) => { if (!order.includes(id)) order.push(id); });
        return ids.length ? `[[${ids.join(',')}]]` : '';
    }).replace(/[ \t]+([.,;:!?])/g, '$1');
    return {
        text: cleaned,
        sources: order.map((id) => ({ id, label: SOURCES[id].label, href: SOURCES[id].href })),
    };
}

module.exports = { SOURCES, sourcesPrompt, resolveCitations };
