const { app } = require('@azure/functions');

const audiencePrompts = {
    recruiter: `Write a 2-sentence portfolio intro for Grant Zou addressing a recruiter. Grant is an AI product designer at Microsoft Azure with 6+ years experience across Azure, Jungle Scout, and Visier. He specializes in agentic interfaces, enterprise UX, and AI-native product design. Be specific, confident, and results-oriented. First person. No quotes.`,
    collaborator: `Write a 2-sentence portfolio intro for Grant Zou addressing a potential collaborator. Grant is an AI product designer at Microsoft Azure who experiments with agentic UX patterns, builds with AI hands-on, and is open to creative cross-disciplinary work. Be warm, direct, and energetic. First person. No quotes.`
};

const staticFallbacks = {
    recruiter: "6+ years designing enterprise AI products at Microsoft Azure, Jungle Scout, and Visier. Currently focused on agentic interfaces, cost transparency UX, and AI-native product design.",
    collaborator: "I'm deep in AI-native design — building on Azure, experimenting with agentic UX patterns, and always open to creative cross-disciplinary projects that push the edges of what interfaces can do."
};

app.http('perspectives', {
    methods: ['GET', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Perspectives - Processing request');

        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json'
        };

        if (request.method === 'OPTIONS') {
            return { status: 204, headers };
        }

        const audience = request.query.get('as');

        if (!['recruiter', 'collaborator'].includes(audience)) {
            return {
                status: 400,
                headers,
                jsonBody: { success: false, error: 'Invalid audience. Use ?as=recruiter or ?as=collaborator' }
            };
        }

        const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
        const apiKey = process.env.AZURE_OPENAI_API_KEY;
        const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o-mini';

        if (!endpoint || !apiKey) {
            context.log('Azure OpenAI not configured, using static fallback');
            return {
                status: 200,
                headers,
                jsonBody: { success: true, copy: staticFallbacks[audience], audience, source: 'static' }
            };
        }

        try {
            const apiUrl = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-10-21`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': apiKey
                },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: 'You write concise, confident portfolio intro copy. Two sentences max. First person. No quotes.' },
                        { role: 'user', content: audiencePrompts[audience] }
                    ],
                    max_tokens: 100,
                    temperature: 0.85
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            const copy = data.choices[0].message.content.trim();

            return {
                status: 200,
                headers,
                jsonBody: { success: true, copy, audience, source: 'ai' }
            };

        } catch (error) {
            context.error('Perspectives error:', error);
            return {
                status: 200,
                headers,
                jsonBody: { success: true, copy: staticFallbacks[audience], audience, source: 'static' }
            };
        }
    }
});
