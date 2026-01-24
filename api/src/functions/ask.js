const { app } = require('@azure/functions');

app.http('ask', {
    methods: ['GET', 'POST', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Grant AI Assistant - Processing request');

        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json'
        };

        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return { status: 204, headers };
        }

        try {
            let userQuestion = 'Hello';
            
            if (request.method === 'POST') {
                const body = await request.json();
                userQuestion = body?.question || body?.message || 'Hello';
            } else {
                userQuestion = request.query.get('question') || 'Hello';
            }
            
            context.log('User question:', userQuestion);

            // Get Azure OpenAI config from environment
            const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
            const apiKey = process.env.AZURE_OPENAI_API_KEY;
            const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o';

            if (!endpoint || !apiKey) {
                // Fallback to local response if not configured
                context.log('Azure OpenAI not configured, using fallback');
                const fallbackResponse = generateFallbackResponse(userQuestion);
                return {
                    status: 200,
                    headers,
                    jsonBody: { success: true, response: fallbackResponse, question: userQuestion }
                };
            }

            // Training context about Grant
            const trainingContext = `
ABOUT GRANT:
- Product Designer 2 at Microsoft Azure (Core team)
- Previously at Microsoft Cost Management and Jungle Scout
- Education: Virginia Tech

DESIGN PHILOSOPHY:
- "Solution-eering" - finding creative solutions within constraints
- Human-centered design with deep empathy
- Design as storytelling - blending experience and connection
- Start with "why" before jumping to solutions

RESEARCH APPROACH:
- Two-part methodology: qualitative first (interviews), then quantitative (surveys)
- Example: Advertising Analytics project - interviewed 6 Amazon sellers, surveyed 216 participants
- Uses FigJam for synthesis and affinity mapping

KEY PROJECTS:
- Advertising Analytics at Jungle Scout - data visualization for Amazon sellers
- Azure Core experiences at Microsoft
- Cost Management tools at Microsoft

SKILLS:
- UX/UI Design, User Research, Data Visualization
- Figma, FigJam, prototyping
- Stakeholder collaboration, cross-functional teamwork

PERSONAL:
- Music production enthusiast
- Badminton player
`;

            // System prompt with Grant's personality and knowledge
            const systemPrompt = `You are Grant's AI assistant on his portfolio website. You represent Grant in a friendly, professional manner.

PERSONALITY:
- Warm, approachable, and conversational
- Thoughtful and articulate about design
- Humble but confident about expertise
- Uses occasional humor

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
                context.error('Azure OpenAI error:', response.status, errorText);
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;

            return {
                status: 200,
                headers,
                jsonBody: { success: true, response: aiResponse, question: userQuestion }
            };

        } catch (error) {
            context.error('Error:', error);
            // Fallback on error
            let question = 'hello';
            try {
                const body = await request.clone().json();
                question = body?.question || 'hello';
            } catch {}
            
            const fallbackResponse = generateFallbackResponse(question);
            return {
                status: 200,
                headers,
                jsonBody: { success: true, response: fallbackResponse, question }
            };
        }
    }
});

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
