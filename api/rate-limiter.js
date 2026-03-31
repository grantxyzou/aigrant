// Shared rate limiter for Azure Functions
const rateLimitStore = new Map();

const DEFAULTS = {
    limit: 10,
    windowMs: 2 * 60 * 1000 // 2 minutes
};

function checkRateLimit(ip, options = {}) {
    const limit = options.limit || DEFAULTS.limit;
    const windowMs = options.windowMs || DEFAULTS.windowMs;
    const now = Date.now();
    const record = rateLimitStore.get(ip);

    if (!record || now > record.resetTime) {
        rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
        return { allowed: true, remaining: limit - 1 };
    }

    if (record.count >= limit) {
        const retryAfter = Math.ceil((record.resetTime - now) / 1000);
        return { allowed: false, remaining: 0, retryAfter };
    }

    record.count++;
    return { allowed: true, remaining: limit - record.count };
}

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of rateLimitStore) {
        if (now > record.resetTime) {
            rateLimitStore.delete(ip);
        }
    }
}, 5 * 60 * 1000);

// Extract client IP from request headers
function getClientIp(request) {
    // Azure Static Web Apps injects the real client IP here — not spoofable
    const azureIp = request.headers.get('x-azure-clientip');
    if (azureIp) return azureIp;

    // x-forwarded-for: use the last hop (set by outermost trusted proxy, not the client)
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        const parts = forwarded.split(',');
        return parts[parts.length - 1].trim();
    }

    return request.headers.get('x-real-ip') || null;
}

// Build CORS headers with origin restriction
function getCorsHeaders(request) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
        : ['https://grantzou.com'];

    const requestOrigin = request.headers.get('origin') || '';
    const origin = allowedOrigins.includes(requestOrigin)
        ? requestOrigin
        : allowedOrigins[0];

    return {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Vary': 'Origin',
        'Content-Type': 'application/json'
    };
}

// Validate and sanitize conversation messages
const MAX_MESSAGE_LENGTH = 1000;
const MAX_CONVERSATION_LENGTH = 20;

function sanitizeMessages(messages) {
    if (!Array.isArray(messages)) return null;

    return messages
        .slice(-MAX_CONVERSATION_LENGTH)
        .filter(msg => msg.role === 'user' || msg.role === 'assistant')
        .map(msg => ({
            role: msg.role,
            content: typeof msg.content === 'string'
                ? msg.content.slice(0, MAX_MESSAGE_LENGTH)
                : ''
        }));
}

module.exports = {
    checkRateLimit,
    getClientIp,
    getCorsHeaders,
    sanitizeMessages,
    MAX_MESSAGE_LENGTH
};
