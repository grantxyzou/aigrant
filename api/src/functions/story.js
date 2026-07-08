const { app } = require('@azure/functions');
const { checkRateLimit, getClientIp, getCorsHeaders } = require('../../rate-limiter');

// Only the publicly-shared project may ever be composed into a live story.
// Everything else at Microsoft is confidential — hard guard, not just a prompt rule.
const ALLOWED_PROJECT = 'azure-storage-mover-s3';

// Grounding: the AI may ONLY compose from these facts. No invention.
const SOURCE_MATERIAL = `
PROJECT: Azure Storage Mover — S3 Redesign (publicly shareable; the ONLY Azure project Grant discusses by name; all other Microsoft work is confidential).
ROLE: Grant was the design owner (design exploration & brief).
SUMMARY: Extending Azure Storage Mover to migrate from S3-compatible object stores (S3, GCS, and similar) alongside its existing SMB/NFS support.
PROBLEM: Cross-cloud migration is unforgiving at setup time. Extending to agentless S3-compatible sources meant users had to line up a chain of prerequisites — credential references, permissions, networking, endpoints — before anything could run. The failure mode was not confusion in the moment; it was late discovery: people got deep into a flow, hit a requirement they didn't know existed, and dropped off. A subtler failure sat underneath: a job could report success while the migration hadn't actually been verified (false completion).
APPROACH (experience principles): upfront prerequisite clarity without hard-blocking exploration; one unified readiness model across every entry point (project, job, endpoint, agent); inline guidance to create dependencies in context instead of sending users elsewhere; honest validation that never implies a check the system can't actually perform.
KEY DECISIONS: a shared four-step mental model (Prerequisites → Source configuration → Target configuration → Migration job execution) applied consistently across source types; a first-class agentless source-creation step; a deliberate restraint — did NOT redesign the whole create-job flow, since the existing structure worked.
THE VALIDATION DECISION (the part Grant is proudest of): the honest scope of what could be checked was metadata-level completeness (comparing file counts) — NOT connectivity, NOT corruption, NOT cryptographic checksums. So: validation is opt-in and stays visible in the job summary and run history; execution status and validation outcome are decoupled (a job can complete while validation flags a discrepancy, worded neutrally as "Run complete"); results are accessible (a downloadable validation file and navigable logs). "The job ran" is never confused with "the data is guaranteed."
WHY IT MATTERS: enterprise infrastructure UX rarely gets to be flashy; its job is to keep a competent person from failing at something consequential (moving data across clouds) because a requirement was hidden or a status was overstated. The highest-value move is honesty — about what you'll need before you start, and about what the system actually verified before it tells you you're done.
`;

// Hand-authored, fully-grounded baseline. Always safe; also the exemplar output shape.
const staticStory = {
    title: 'Azure Storage Mover — the honest-validation decision',
    sections: [
        {
            heading: 'The problem underneath the problem',
            body: [
                "Cross-cloud migration is unforgiving at setup time. Storage Mover already handled SMB/NFS scenarios, but extending it to agentless S3-compatible sources meant users had to line up a chain of prerequisites — credential references, permissions, networking, endpoints — before anything could run.",
                "The failure mode wasn't confusion in the moment. It was late discovery: people got deep into a flow, hit a requirement they didn't know existed, and dropped off."
            ]
        },
        {
            heading: 'The failure I actually cared about',
            body: [
                "Underneath the drop-off sat a subtler problem: a job could report success while the migration hadn't really been verified. People would believe they were done when they weren't.",
                "That's false completion — when the interface lets someone think a task is finished before it really is. It's the thread that runs through most of my work."
            ]
        },
        {
            heading: 'The honest scope of validation',
            body: [
                "Users want reassurance their migration worked. But the honest truth was that what the system could actually check was metadata-level completeness — comparing file counts. Not connectivity. Not corruption. Not cryptographic checksums.",
                "The tempting move is to let a green checkmark quietly imply more than that. I designed against it."
            ]
        },
        {
            callout: {
                label: 'The decision',
                body: [
                    "Validation is opt-in, and that choice stays visible in the job summary and run history — no silent assumptions.",
                    "Execution status and validation outcome are decoupled: a run can complete while validation flags a discrepancy, worded neutrally as \"Run complete\" — so success never masquerades as verification.",
                    "Results are accessible: a downloadable validation file and navigable logs, so \"something's off\" always comes with somewhere to look."
                ]
            }
        },
        {
            heading: 'Why draw the line there',
            body: [
                "Enterprise infrastructure UX rarely gets to be flashy. Its job is to keep a competent person from failing at something consequential — moving data across clouds — because a requirement was hidden or a status was overstated.",
                "The highest-value design move in these flows is honesty: about what you'll need before you start, and about what the system actually verified before it tells you you're done."
            ]
        }
    ]
};

// Normalize the model's block array into the exact shapes CaseStudy.jsx renders.
function normalizeSections(raw) {
    if (!Array.isArray(raw)) return null;
    const out = [];
    for (const s of raw) {
        if (!s || typeof s !== 'object') continue;
        const body = Array.isArray(s.body) ? s.body.filter(x => typeof x === 'string' && x.trim()) : [];
        if (s.kind === 'callout') {
            if (body.length) out.push({ callout: { label: (typeof s.label === 'string' && s.label.trim()) ? s.label : 'The decision', body } });
            continue;
        }
        const block = {};
        if (typeof s.heading === 'string' && s.heading.trim()) block.heading = s.heading;
        if (body.length) block.body = body;
        const list = Array.isArray(s.list) ? s.list.filter(x => typeof x === 'string' && x.trim()) : [];
        if (list.length) block.list = list;
        if (block.body || block.list) out.push(block);
    }
    return out.length ? out : null;
}

app.http('story', {
    methods: ['POST', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const headers = getCorsHeaders(request);
        if (request.method === 'OPTIONS') return { status: 204, headers };

        const clientIp = getClientIp(request)
            || (process.env.NODE_ENV !== 'production' ? '127.0.0.1' : null);
        if (!clientIp) {
            return { status: 400, headers, jsonBody: { success: false, error: 'Unable to identify client.' } };
        }

        const rate = checkRateLimit(clientIp, { limit: 15, windowMs: 2 * 60 * 1000 });
        if (!rate.allowed) {
            return {
                status: 429,
                headers: { ...headers, 'Retry-After': rate.retryAfter.toString() },
                jsonBody: { success: false, error: 'Too many requests. Try again shortly.' }
            };
        }

        const body = await request.json().catch(() => ({}));
        const project = typeof body?.project === 'string' ? body.project : '';
        const question = (typeof body?.question === 'string' && body.question.trim() ? body.question : 'Why did you design it this way?').slice(0, 300);

        // Hard confidentiality guard — never compose a story for anything but the shareable project.
        if (project !== ALLOWED_PROJECT) {
            return {
                status: 400,
                headers,
                jsonBody: { success: false, error: "That project's details are confidential and can't be turned into a public story." }
            };
        }

        const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
        const apiKey = process.env.AZURE_OPENAI_API_KEY;
        const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o-mini';

        if (!endpoint || !apiKey) {
            context.log('Azure OpenAI not configured, using static story');
            return { status: 200, headers, jsonBody: { success: true, ...staticStory, question, source: 'static' } };
        }

        try {
            const system = `You compose a short, focused visual "story" for Grant Zou's design portfolio, answering a visitor's question about the Azure Storage Mover S3 redesign.

RULES:
- Compose ONLY from the SOURCE MATERIAL below. Do NOT invent decisions, metrics, product names, tools, or outcomes. You sequence and narrate real facts; you never add new claims.
- Write in Grant's first person ("I designed…", "I cared about…").
- If the question can't be fully answered from the source, compose the closest honest story from what's there.
- Never mention any other Microsoft project — all are confidential except this one.

Return STRICT JSON only (no markdown fences), shape:
{"title": string, "sections": Block[]}
Block is one of:
- {"kind":"section","heading":string,"body":string[],"list":string[]}   // body = 1-3 tight paragraphs; list may be []
- {"kind":"callout","label":string,"body":string[]}                       // use ONCE, for the single most important insight
Compose 5-7 blocks forming an arc: problem → approach → the key decision (as the callout) → why it matters.

SOURCE MATERIAL:
${SOURCE_MATERIAL}`;

            const apiUrl = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-10-21`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: system },
                        { role: 'user', content: `Visitor question: ${question}` }
                    ],
                    max_tokens: 1200,
                    temperature: 0.4,
                    response_format: { type: 'json_object' }
                })
            });

            if (!response.ok) throw new Error(`API error: ${response.status}`);

            const data = await response.json();
            const content = data?.choices?.[0]?.message?.content;
            const parsed = JSON.parse(content);
            const sections = normalizeSections(parsed?.sections);
            if (!sections) throw new Error('No usable sections');

            const title = (typeof parsed?.title === 'string' && parsed.title.trim()) ? parsed.title : staticStory.title;
            return { status: 200, headers, jsonBody: { success: true, title, sections, question, source: 'ai' } };

        } catch (error) {
            context.error('Story error:', error.message);
            return { status: 200, headers, jsonBody: { success: true, ...staticStory, question, source: 'static' } };
        }
    }
});
