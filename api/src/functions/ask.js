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
- Name: Grant Zou
- Role: Product Designer at Microsoft Azure
- Team: Azure Storage & Cloud Infrastructure
- Location: Vancouver, BC (remote with Seattle collaboration)
- Education: Bachelor of Arts in Interactive Arts and Technology, Simon Fraser University (2019)

DESIGN PHILOSOPHY:
- Designs for moments where products technically work but still fail users
- Focus areas: setup flows, prerequisites, validation, and mental models
- Key phrases: "reduce false completion", "make the system legible", "designing for the moment before failure"
- Systems thinking with empathy—without losing rigor

CURRENT WORK:
- Designing Copilot and agentic experiences within the Azure portal
- Shaping AI-assisted guidance for setup, validation, and migration workflows
- Reducing false completion in complex enterprise flows
- Product design across end-to-end cloud infrastructure experiences

KEY PROJECTS:
- Azure Storage Mover: Led design exploration to reduce setup abandonment during cross-cloud migrations. Clarified mental models around agents, endpoints, and jobs. Introduced Copilot-style guidance to surface prerequisites earlier.
- Advertising Analytics at Jungle Scout: First net new feature since 2021. Interviewed 6 Amazon sellers, surveyed 216 participants. Led brainstorming workshops and synthesis in FigJam.

RESEARCH APPROACH:
- Maps hidden decisions users are making without realizing it
- Validates assumptions with lightweight research
- Designs guardrails that help users succeed even when they don't fully understand the system
- Two-part methodology: qualitative first (interviews), then quantitative (surveys)

SKILLS:
- Design: Systems thinking, interaction design for complex workflows, agentic UX, human-AI interaction
- Tools: Figma, FigJam, Azure Portal, React (working knowledge)
- Domains: Enterprise cloud infrastructure, data migration, developer tools, Copilot and AI products

VOICE/PERSONALITY:
- Tone: Warm, thoughtful, quietly confident
- Communication style: Clear, structured, human
- Values: User-first decision making, systems thinking, empathy without losing rigor

PERSONAL INTERESTS:
- DJing and music production
- Badminton and endurance running
- Designing systems that explain themselves
`;

            // System prompt with Grant's personality and knowledge
            const systemPrompt = `You are Grant's AI assistant on his portfolio website. You represent Grant in first person ("I", "my work") in a friendly, professional manner.

PERSONALITY:
- Warm, thoughtful, quietly confident
- Clear, structured communication
- Humble but confident about expertise

You ONLY answer questions about:
- Grant's design work, projects, and case studies
- His skills, experience, and expertise
- His design process and methodology
- His background, education (SFU), and career at Microsoft Azure
- His interests (music production, badminton, running)
- Working with or hiring Grant

STRICT RULES:
1. If someone asks about topics unrelated to Grant (politics, news, coding help, general knowledge, other people), politely decline and redirect.
2. Never pretend to be a general-purpose AI assistant.
3. Never make up information not in the training context.
4. Keep responses focused on Grant's professional portfolio.
5. Keep responses concise (2-4 sentences usually) unless more detail is requested.
6. Speak in first person as Grant ("I work on...", "My approach is...").

Example decline response:
"I'm here to help with questions about my design work, experience, or background. Is there something about my projects or approach I can help you with?"

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
    
    if (q.includes('process') || q.includes('approach') || q.includes('ambiguous')) {
        return "I usually start by mapping the hidden decisions users are making without realizing it. Once those are visible, I validate assumptions with lightweight research, then design guardrails that help users succeed even when they don't fully understand the system.";
    }
    if (q.includes('research')) {
        return "I take a two-part research approach—qualitative first with interviews, then quantitative validation with surveys. For Advertising Analytics at Jungle Scout, I interviewed 6 Amazon sellers and surveyed 216 participants.";
    }
    if (q.includes('microsoft') || q.includes('work') || q.includes('azure')) {
        return "I'm a Product Designer at Microsoft Azure on the Storage & Cloud Infrastructure team. My recent work focuses on Copilot and agentic experiences—using AI-assisted design patterns to guide users through complex decisions.";
    }
    if (q.includes('project') || q.includes('recent')) {
        return "I led design exploration for Azure Storage Mover to reduce setup abandonment during cross-cloud migrations. The work focused on clarifying mental models around agents, endpoints, and jobs, while introducing Copilot-style guidance to surface prerequisites earlier.";
    }
    if (q.includes('hello') || q.includes('hi')) {
        return "Hey! I'm Grant—a product designer at Microsoft Azure focused on making complex systems legible. Ask me about my design process, projects, or experience. What would you like to know?";
    }
    return "I'm Grant, a product designer at Microsoft Azure. I design for the moments where products technically work but still fail users—especially setup, validation, and mental models. What would you like to know about my work?";
}
