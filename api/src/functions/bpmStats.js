const { app } = require('@azure/functions');
const { checkRateLimit, getClientIp, getCorsHeaders } = require('../../rate-limiter');

// Live totals for the BPM case study, read from BPM's key-protected weekly
// report (GET /api/reports/metrics, x-reports-key). Only a handful of
// club-wide counts leave this function — never names, sessions or money.
//
// Env (Static Web App → Environment variables):
//   BPM_REPORTS_KEY  the club's reports key, minted on BPM's Metrics page
//   BPM_REPORTS_URL  optional; defaults to production
//
// BPM allows 30 report reads an hour per caller, so one read is cached for an
// hour and shared by every visitor. When BPM can't be read, the answer says so
// (503) and the page shows no live numbers — never a stale or made-up one.

const DEFAULT_URL = 'https://bpm.grantzou.com/bpm/api/reports/metrics';
const CACHE_MS = 60 * 60 * 1000;
let cached = null; // { at, stats }

const pickStats = (m) => ({
    asOf: m.generatedAt,
    rosterSize: m.rosterSize,
    playedLast4Sessions: m.activeMembers?.last4 ?? null,
    openedLast28Days: m.usage?.activeSoFar ?? null,
    opensPerMemberLast7Days: m.usage?.opensPerActive7d ?? null,
});

app.http('bpm-stats', {
    methods: ['GET', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const headers = getCorsHeaders(request);
        if (request.method === 'OPTIONS') return { status: 204, headers };

        const clientIp = getClientIp(request)
            || (process.env.NODE_ENV !== 'production' ? '127.0.0.1' : null);
        if (!clientIp) {
            return { status: 400, headers, jsonBody: { success: false, error: 'Unable to identify client.' } };
        }
        const rateCheck = checkRateLimit(`bpm-stats:${clientIp}`, { limit: 20, windowMs: 2 * 60 * 1000 });
        if (!rateCheck.allowed) {
            return {
                status: 429,
                headers: { ...headers, 'Retry-After': rateCheck.retryAfter.toString() },
                jsonBody: { success: false, error: 'Too many requests. Try again shortly.' }
            };
        }

        if (cached && Date.now() - cached.at < CACHE_MS) {
            return { status: 200, headers, jsonBody: { success: true, stats: cached.stats } };
        }

        const key = process.env.BPM_REPORTS_KEY;
        if (!key) {
            return { status: 503, headers, jsonBody: { success: false, error: 'not_configured' } };
        }

        try {
            const response = await fetch(process.env.BPM_REPORTS_URL || DEFAULT_URL, {
                headers: { 'x-reports-key': key },
                signal: AbortSignal.timeout(8000)
            });
            if (!response.ok) throw new Error(`BPM report answered ${response.status}`);
            const stats = pickStats(await response.json());
            if (typeof stats.rosterSize !== 'number') throw new Error('BPM report had no roster size');
            cached = { at: Date.now(), stats };
            return { status: 200, headers, jsonBody: { success: true, stats } };
        } catch (error) {
            context.error('bpm-stats read failed:', error.message);
            return { status: 503, headers, jsonBody: { success: false, error: 'read_failed' } };
        }
    }
});
