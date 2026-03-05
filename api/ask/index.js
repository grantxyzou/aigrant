const { personality, fewShotExamples } = require('../training');

module.exports = async function (context, req) {
    context.log('Grant AI Assistant - Processing request');

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        context.res = { status: 204, headers };
        return;
    }

    try {
        // Support both legacy { question } and new { messages } formats
        const isIntroRequest = req.body?.isIntroRequest;
        const legacyQuestion = req.body?.question || req.body?.message || req.query?.question;
        const conversationMessages = req.body?.messages;

        context.log('Request type:', isIntroRequest ? 'intro' : conversationMessages ? 'conversation' : 'legacy');

        // Get Azure OpenAI config from environment
        const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
        const apiKey = process.env.AZURE_OPENAI_API_KEY;
        const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o';

        if (!endpoint || !apiKey) {
            context.log('Azure OpenAI not configured, using fallback');
            const fallbackQuestion = legacyQuestion || conversationMessages?.at(-1)?.content || 'Hello';
            context.res = {
                status: 200,
                headers,
                body: { success: true, response: generateFallbackResponse(fallbackQuestion) }
            };
            return;
        }

        // Training context about Grant
        const trainingContext = `
ABOUT GRANT:
- Product Designer at Microsoft Azure (Storage & Cloud Infrastructure team)
- Previously at Jungle Scout (2020–2022) and Visier (2018–2019)
- Education: Simon Fraser University, BA in Interactive Arts and Technology (2019)
- Location: Vancouver, BC (remote with Seattle collaboration)

DESIGN PHILOSOPHY:
- Design as storytelling — blending experience and connection
- Human-centered design with deep empathy
- Start with "why" before jumping to solutions
- Designing for failure states and edge cases, not just happy paths
- Focus on the moments where products technically work but still fail users

CURRENT WORK AT MICROSOFT:
- Designing Copilot and agentic experiences within the Azure portal
- Shaping AI-assisted guidance for setup, validation, and migration workflows
- Reducing false completion in complex enterprise flows
- Partnering closely with PM and engineering on AI-driven features
- Areas: setup, prerequisites, validation, mental models in cloud infrastructure

PREVIOUS EXPERIENCE:
- Jungle Scout (2020–2022): Analytics and data visualization for e-commerce sellers. Translated dense operational data into actionable insights for real business decisions under uncertainty.
- Visier (2018–2019): People analytics. Experiences where data intersected with organizational dynamics, hiring, and performance narratives.

SKILLS:
- Systems thinking, interaction design for complex workflows
- Agentic UX and Copilot patterns
- User research, human-AI interaction
- Figma, FigJam, Azure Portal
- React (working knowledge)

PERSONAL:
- DJing and music production
- Badminton and endurance running
- Designing systems that explain themselves
`;

        const systemPrompt = `You are Grant's AI assistant on his portfolio website. You represent Grant in a friendly, professional manner.

PERSONALITY:
- Voice: ${personality.voice}
- Traits: ${personality.traits.join(', ')}
- Values: ${personality.values.join(', ')}
- Signature phrases Grant uses (work these in naturally when relevant): "${personality.signaturePhrases.join('", "')}"

You ONLY answer questions about:
- Grant's design work, projects, and case studies
- His skills, experience, and expertise
- His design process and methodology
- His background, education, and career at Microsoft
- His interests (music production, badminton)
- Working with or hiring Grant

STRICT RULES:
1. If someone asks about topics unrelated to Grant (politics, news, coding help, general knowledge, other people), politely decline and redirect.
2. Never pretend to be a general-purpose AI assistant.
3. Never provide information you weren't trained on about Grant.
4. Keep responses focused on Grant's professional portfolio.
5. Keep responses concise (2-4 sentences usually) unless more detail is requested.

Example decline response:
"I'm Grant's portfolio assistant, so I can only help with questions about his design work, experience, or background. Is there something about Grant's projects or skills I can help you with?"

${trainingContext}`;

        // Build messages array for the API call
        let apiMessages;

        if (isIntroRequest) {
            // Generate a short punchy one-liner for the hero section
            apiMessages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: 'Write a single short sentence (under 10 words) describing what Grant does. Be specific, memorable, and slightly witty. No quotes.' }
            ];
        } else if (conversationMessages && conversationMessages.length > 0) {
            // Full conversation history with few-shot examples to guide response style
            const shots = fewShotExamples.map(ex => ([
                { role: 'user', content: ex.user },
                { role: 'assistant', content: ex.assistant }
            ])).flat();
            apiMessages = [
                { role: 'system', content: systemPrompt },
                ...shots,
                ...conversationMessages
            ];
        } else {
            // Legacy single-question format
            apiMessages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: legacyQuestion || 'Hello' }
            ];
        }

        const apiUrl = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-08-01-preview`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey
            },
            body: JSON.stringify({
                messages: apiMessages,
                max_tokens: 500,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            context.log.error('Azure OpenAI error:', response.status, errorText);
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        context.res = {
            status: 200,
            headers,
            body: { success: true, response: aiResponse }
        };

    } catch (error) {
        context.log.error('Error:', error);
        const fallbackQuestion = req.body?.messages?.at(-1)?.content || req.body?.question || 'hello';
        context.res = {
            status: 200,
            headers,
            body: { success: true, response: generateFallbackResponse(fallbackQuestion) }
        };
    }
};

function generateFallbackResponse(question) {
    const q = question.toLowerCase();

    if (q.includes('process') || q.includes('approach')) {
        return "I follow a human-centered approach that starts with deep empathy. I believe in starting with 'why' — understanding the real problem before jumping to solutions.";
    }
    if (q.includes('research')) {
        return "I take a two-part research approach — qualitative first with interviews, then quantitative validation with surveys.";
    }
    if (q.includes('visier')) {
        return "At Visier I worked on people analytics, where data intersected with organizational dynamics, hiring, and performance narratives. It's where I built a lot of my early design judgment.";
    }
    if (q.includes('jungle scout')) {
        return "At Jungle Scout I designed analytics and data visualization for e-commerce sellers, translating dense operational data into insights that supported real business decisions.";
    }
    if (q.includes('microsoft') || q.includes('azure') || q.includes('work')) {
        return "I'm a Product Designer at Microsoft Azure, working on the Storage & Cloud Infrastructure team. I focus on Copilot and agentic experiences, and designing for the complex moments where cloud products technically work but still fail users.";
    }
    if (q.includes('hello') || q.includes('hi')) {
        return "Hey! I'm Grant — a product designer at Microsoft Azure. Ask me about my design process, projects, or experience. What would you like to know?";
    }
    return "I'm Grant, a product designer at Microsoft Azure. I design for the confused — complex cloud systems where mistakes are costly. What would you like to know about my work?";
}
