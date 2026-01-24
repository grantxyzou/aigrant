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
        const userQuestion = req.body?.question || req.body?.message || req.query?.question || 'Hello';
        context.log('User question:', userQuestion);

        // Get Azure OpenAI config from environment
        const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
        const apiKey = process.env.AZURE_OPENAI_API_KEY;
        const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o';

        if (!endpoint || !apiKey) {
            // Fallback to local response if not configured
            context.log('Azure OpenAI not configured, using fallback');
            const fallbackResponse = generateFallbackResponse(userQuestion);
            context.res = {
                status: 200,
                headers,
                body: { success: true, response: fallbackResponse, question: userQuestion }
            };
            return;
        }

        // System prompt with Grant's personality and knowledge
        const systemPrompt = `You are Grant Zou's AI assistant on his portfolio website. You speak AS Grant in first person.

ABOUT GRANT:
- Product Designer 2 at Microsoft Azure (Azure Core team since Apr 2025, previously Cost Management 2022-2025)
- Previously UX Designer at Jungle Scout (2020-2022) and Visier Inc (2018-2019)
- Based in Vancouver, Canada

DESIGN PHILOSOPHY:
- "Design is storytelling - blending experience and connection"
- Strong "problem-first" philosophy - actively challenges briefs, avoids "solution-eering"
- Human-centered approach with systematic research validation
- Believes designers should understand their medium (codes in React, CSS)

NOTABLE PROJECT - Advertising Analytics (Jungle Scout):
- First net new feature for Jungle Scout Orange since 2021
- Owned entire design process as design lead
- Conducted interviews with 6 Amazon sellers
- Organized FigJam synthesis sessions with PM
- Facilitated 60-minute stakeholder brainstorming workshop
- Validated with 216-participant survey
- Challenge: Making complex PPC data accessible to sellers

RESEARCH APPROACH:
- Two-part method: qualitative first (interviews), then quantitative validation (surveys)
- Uses FigJam for synthesis with virtual stickies
- UserZoom Go for concept testing
- Believes in pulling stakeholders into collaboration throughout

PERSONAL:
- Remixes music - sees parallels with design (rhythm, flow, emotional connections)
- Plays badminton competitively
- Runs to keep balance

COMMUNICATION STYLE:
- Authentic, thoughtful, genuinely curious
- Professional but approachable
- Shows enthusiasm for design and technology
- Uses specific examples from real projects
- Conversational, not robotic

Keep responses concise (2-4 sentences) unless asked for detail. Be warm and engaging.`;

        // Call Azure OpenAI
        const apiUrl = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-08-01-preview`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userQuestion }
                ],
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
            body: { success: true, response: aiResponse, question: userQuestion }
        };

    } catch (error) {
        context.log.error('Error:', error);
        // Fallback on error
        const fallbackResponse = generateFallbackResponse(req.body?.question || 'hello');
        context.res = {
            status: 200,
            headers,
            body: { success: true, response: fallbackResponse, question: req.body?.question || 'hello' }
        };
    }
};

function generateFallbackResponse(question) {
    const q = question.toLowerCase();
    
    if (q.includes('process') || q.includes('approach')) {
        return "I follow a human-centered approach that starts with deep empathy. I believe in starting with 'why' - understanding the real problem before jumping to solutions.";
    }
    if (q.includes('research')) {
        return "I take a two-part research approach - qualitative first with interviews, then quantitative validation with surveys. For Advertising Analytics, I interviewed 6 sellers and surveyed 216 participants.";
    }
    if (q.includes('microsoft') || q.includes('work')) {
        return "I'm currently a Product Designer 2 at Microsoft Azure, working on the Azure Core team. Before that, I was on Cost Management and at Jungle Scout.";
    }
    if (q.includes('hello') || q.includes('hi')) {
        return "Hey! I'm Grant - a product designer at Microsoft Azure. Ask me about my design process, projects, or experience. What would you like to know?";
    }
    return "I'm Grant, a product designer who approaches design as storytelling. I'm at Microsoft Azure, previously Jungle Scout. What would you like to know about my work?";
}
