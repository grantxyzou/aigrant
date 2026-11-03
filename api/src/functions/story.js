const { app } = require('@azure/functions');
const { checkRateLimit, getClientIp, getCorsHeaders } = require('../../rate-limiter');
// The published case studies, exported at build time by
// scripts/export-case-studies.mjs. They are the only thing a story may be
// written from, so a story can never say more than the page it came from.
const caseStudies = require('../../caseStudies.generated.json');

// Microsoft work is shareable only as published. The source is already limited
// to the published page; this adds the rule to the prompt as well.
const MICROSOFT = new Set(['azure-storage-mover-s3']);

const sourceFor = (cs) => cs.sections
    .map((s) => `[${s.id}] ${s.label}\n${s.text}`)
    .join('\n\n');

const citeFor = (slug, cs, id) => {
    const s = cs.sections.find((x) => x.id === id);
    return s ? { id, label: `${cs.navLabel} · ${s.label}`, href: `/work/${slug}#${id}` } : null;
};

// What a visitor gets when no model can write the story: the case study itself,
// section by section, each block citing the section it is. Labelled as such on
// the page — it is never presented as something written for them.
function caseStudyStory(slug, cs) {
    return cs.sections.map((s) => {
        const lines = s.text.split('\n').filter(Boolean);
        const list = lines.filter((l) => l.startsWith('- ')).map((l) => l.slice(2));
        const body = lines.filter((l) => !l.startsWith('- '));
        return {
            heading: s.label,
            ...(body.length ? { body } : {}),
            ...(list.length ? { list } : {}),
            cites: [citeFor(slug, cs, s.id)],
        };
    });
}

// Keep the model's blocks that cite at least one real section of this case
// study, in the shapes CaseStudy.jsx renders. A block that cites nothing real
// is dropped rather than shown: every sentence on the page must be traceable.
function normalizeSections(raw, slug, cs) {
    if (!Array.isArray(raw)) return { sections: [], dropped: 0 };
    const sections = [];
    let dropped = 0;
    for (const s of raw) {
        if (!s || typeof s !== 'object') continue;
        const strings = (a) => (Array.isArray(a) ? a.filter((x) => typeof x === 'string' && x.trim()) : []);
        const body = strings(s.body);
        const list = strings(s.list);
        const ids = [...new Set(strings(s.cites))];
        const cites = ids.map((id) => citeFor(slug, cs, id)).filter(Boolean);
        if (!body.length && !list.length) continue;
        if (!cites.length) { dropped++; continue; }
        if (s.kind === 'callout' && body.length) {
            const label = typeof s.label === 'string' && s.label.trim() ? s.label : 'The decision';
            sections.push({ callout: { label, body }, cites });
            continue;
        }
        sections.push({
            ...(typeof s.heading === 'string' && s.heading.trim() ? { heading: s.heading } : {}),
            ...(body.length ? { body } : {}),
            ...(list.length ? { list } : {}),
            cites,
        });
    }
    return { sections, dropped };
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

        // Its own budget, so writing stories never uses up the chat's.
        const rate = checkRateLimit(`story:${clientIp}`, { limit: 15, windowMs: 2 * 60 * 1000 });
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

        // Only a published case study can become a story.
        const cs = Object.prototype.hasOwnProperty.call(caseStudies, project) ? caseStudies[project] : null;
        if (!cs) {
            return { status: 400, headers, jsonBody: { success: false, error: 'There is no published case study by that name.' } };
        }

        const fallback = (reason) => ({
            status: 200,
            headers,
            jsonBody: { success: true, project, question, title: cs.title, mode: 'case-study', reason, sections: caseStudyStory(project, cs) }
        });

        const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
        const apiKey = process.env.AZURE_OPENAI_API_KEY;
        const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o-mini';
        if (!endpoint || !apiKey) return fallback('not_configured');

        try {
            const system = `You write a short, focused story for Grant Zou's design portfolio that answers a visitor's question about one case study: "${cs.title}".

RULES:
- Use ONLY the SOURCE below. Do not add decisions, metrics, names, tools or outcomes it does not state. You choose, order and retell; you never add claims.
- Write in Grant's first person ("I designed…").
- Every block cites the source sections it draws on, by their [id], in "cites". A block that cites nothing will be removed.
- If the source can't answer the question fully, tell the closest honest story it supports and say plainly what it doesn't cover.${MICROSOFT.has(project) ? '\n- This is Microsoft work. Say nothing beyond the source, and never mention any other Microsoft project, team or internal tool.' : ''}

Return STRICT JSON only:
{"title": string, "sections": Block[]}
Block is one of:
- {"kind":"section","heading":string,"body":string[],"list":string[],"cites":string[]}
- {"kind":"callout","label":string,"body":string[],"cites":string[]}   // once, for the single most important insight
Write 4-6 blocks: problem → approach → the key decision (the callout) → why it matters.

SOURCE:
${sourceFor(cs)}`;

            const apiUrl = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-10-21`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: system },
                        { role: 'user', content: `Visitor question: ${question}` }
                    ],
                    max_tokens: 1400,
                    temperature: 0.4,
                    response_format: { type: 'json_object' }
                })
            });
            if (!response.ok) throw new Error(`API error: ${response.status}`);

            const data = await response.json();
            const parsed = JSON.parse(data?.choices?.[0]?.message?.content || '{}');
            const { sections, dropped } = normalizeSections(parsed?.sections, project, cs);
            if (!sections.length) return fallback('uncited');

            const title = typeof parsed?.title === 'string' && parsed.title.trim() ? parsed.title : cs.title;
            return { status: 200, headers, jsonBody: { success: true, project, question, title, mode: 'ai', dropped, sections } };
        } catch (error) {
            context.error('Story error:', error.message);
            return fallback('failed');
        }
    }
});
