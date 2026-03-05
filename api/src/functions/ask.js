const { app } = require('@azure/functions');

// Simple in-memory rate limiter
const rateLimitStore = new Map();
const RATE_LIMIT = 10; // requests
const RATE_WINDOW = 2 * 60 * 1000; // 2 minutes in ms

function checkRateLimit(ip) {
    const now = Date.now();
    const record = rateLimitStore.get(ip);
    
    if (!record) {
        rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
        return { allowed: true, remaining: RATE_LIMIT - 1 };
    }
    
    // Reset if window expired
    if (now > record.resetTime) {
        rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
        return { allowed: true, remaining: RATE_LIMIT - 1 };
    }
    
    // Check limit
    if (record.count >= RATE_LIMIT) {
        const retryAfter = Math.ceil((record.resetTime - now) / 1000);
        return { allowed: false, remaining: 0, retryAfter };
    }
    
    // Increment
    record.count++;
    return { allowed: true, remaining: RATE_LIMIT - record.count };
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

        // Rate limiting
        const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
            || request.headers.get('x-real-ip') 
            || 'unknown';
        
        const rateCheck = checkRateLimit(clientIp);
        
        if (!rateCheck.allowed) {
            context.log(`Rate limit exceeded for IP: ${clientIp}`);
            return {
                status: 429,
                headers: {
                    ...headers,
                    'Retry-After': rateCheck.retryAfter.toString()
                },
                jsonBody: { 
                    success: false, 
                    error: "Slow down! You're asking too many questions. Try again in a couple minutes.",
                    retryAfter: rateCheck.retryAfter
                }
            };
        }

        try {
            let userQuestion = 'Hello';
            let isIntroRequest = false;
            
            let conversationMessages = null;
            if (request.method === 'POST') {
                const body = await request.json();
                isIntroRequest = body?.isIntroRequest === true;
                conversationMessages = body?.messages?.length > 0 ? body.messages : null;
                userQuestion = body?.question || body?.message || conversationMessages?.at(-1)?.content || 'Hello';
            } else {
                userQuestion = request.query.get('question') || 'Hello';
            }

            context.log('Request type:', isIntroRequest ? 'intro' : conversationMessages ? 'conversation' : 'legacy');

            // Get Azure OpenAI config from environment
            const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
            const apiKey = process.env.AZURE_OPENAI_API_KEY;
            const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o';

            if (!endpoint || !apiKey) {
                // Fallback to local response if not configured
                context.log('Azure OpenAI not configured, using fallback');
                const fallbackResponse = isIntroRequest 
                    ? generateIntroBlurb()
                    : generateFallbackResponse(userQuestion);
                return {
                    status: 200,
                    headers,
                    jsonBody: { success: true, response: fallbackResponse, question: userQuestion }
                };
            }

            // Handle intro blurb request
            if (isIntroRequest) {
                const introPrompt = `Write a one-sentence playful intro about Grant for his portfolio. Max 15 words. Be witty and intriguing. Don't use quotes. Examples of tone: "Making cloud feel less cloudy at Azure." or "Designs for the confused, works at Microsoft."`;

                const apiUrl = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-10-21`;
                
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': apiKey
                    },
                    body: JSON.stringify({
                        messages: [
                            { role: 'system', content: 'You write ultra-short, witty portfolio taglines. One sentence max. No quotes.' },
                            { role: 'user', content: introPrompt }
                        ],
                        max_tokens: 50,
                        temperature: 0.95
                    })
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const data = await response.json();
                const introResponse = data.choices[0].message.content;

                return {
                    status: 200,
                    headers,
                    jsonBody: { success: true, response: introResponse }
                };
            }

            // Training context about Grant
            const trainingContext = `
ABOUT GRANT:
- Name: Grant Zou
- Role: Product Designer at Microsoft Azure
- Location: Vancouver, BC
- Education: Bachelor of Arts in Interactive Arts and Technology, Simon Fraser University (2019)

DESIGN PHILOSOPHY:
- Designs for moments where products technically work but still fail users
- Focus areas: setup flows, prerequisites, validation, and mental models
- Key phrases: "reduce false completion", "make the system legible", "designing for the moment before failure"
- Systems thinking with empathy—without losing rigor

CURRENT WORK (Microsoft Azure, 2022–Present):
- Product design for enterprise cloud infrastructure experiences
- Designing for complex setup flows and onboarding in technical products
- Reducing friction in multi-step workflows
- Making technical systems more legible for users
- Note: Specific project details are confidential

KEY PROJECTS:

1. Advertising Analytics (Jungle Scout, 2021–2022):
   - Role: Design Owner, Researcher, Workshop Facilitator
   - Collaboration: Product, Engineering, Marketing, Content, Video teams
   - Problem: Amazon sellers struggled to interpret PPC metrics and translate data into clear actions
   - Research: Interviewed 6 Amazon sellers (qualitative), surveyed 216 participants with 17% drop-off (quantitative)
   - Key insight: Customers were overwhelmed by PPC metrics and lacked clarity on what actions to take to improve ad performance
   - Key themes: Analyzing PPC performance, generating meaningful insights, learning recommended strategies
   - Strategy: Ship incrementally—focused v1, then iterate with real usage data
   - Workshops: Facilitated 60-minute remote brainstorming sessions to align cross-functional stakeholders
   - Solution: Three-tab structure—Overview (company-level), Sales Activity (ASIN-level), Advertising Analytics (campaign-agnostic insights)
   - Data viz: Translated complex advertising datasets into actionable visualizations; validated with Amazon sellers using UserZoom Go
   - Learnings: Proactive stakeholder collaboration prevents late-stage friction; challenging solution-first briefs ensures solving validated problems
   - Status: Shipped Q1 2022 (first net-new feature since 2021)

3. Visier (2019):
   - Role: UX/Interaction Designer (early career)
   - Domain: HR/People Analytics, employer branding
   - Projects:
     a) Chart Visualization Settings: Designed Top-N slider and "Others" toggle to prevent high-cardinality dimensions from distorting charts; guided users toward valid configurations
     b) Careers Site Redesign: Led IA and mobile-first design for public careers site; location-based job filtering; balanced exploration with quick-apply flow
     c) Recruitment Analytics: Explored dashboard patterns to surface hiring performance insights for non-analyst audiences
   - Key learnings: Making system constraints visible, balancing vision with delivery constraints, designing analytics for non-analyst users
   - Context: Early-career foundational work building breadth across data visualization, IA, and analytics UX

RESEARCH APPROACH:
- Maps hidden decisions users are making without realizing it
- Validates assumptions with lightweight research
- Designs guardrails that help users succeed even when they don't fully understand the system
- Two-part methodology: qualitative first (interviews), then quantitative (surveys)

SKILLS:
- Design: Systems thinking, interaction design for complex workflows, data visualization, information architecture
- Tools: Figma, FigJam, React (working knowledge), UserZoom Go
- Domains: Enterprise cloud infrastructure, developer tools, B2C SaaS, advertising analytics, HR/people analytics

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

RESPONSE FORMAT:
- Use short paragraphs (2-3 sentences max per paragraph)
- For lists or multiple points, use bullet points with "- " prefix
- Use **bold** for key terms or emphasis sparingly
- Keep responses concise but structured
- Break up longer responses into clear sections

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
7. NEVER share specific details about Microsoft projects, product names, internal tools, or confidential work. If asked, politely explain that those details are confidential and offer to discuss past work at Jungle Scout or Visier instead.

Example decline response:
"I'm here to help with questions about my design work, experience, or background. Is there something about my projects or approach I can help you with?"

${trainingContext}`;

            // Call Azure OpenAI
            const apiUrl = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-10-21`;
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': apiKey
                },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...(conversationMessages || [{ role: 'user', content: userQuestion }])
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
            let isIntro = false;
            try {
                const body = await request.clone().json();
                question = body?.question || 'hello';
                isIntro = body?.isIntroRequest === true;
            } catch {}
            
            const fallbackResponse = isIntro ? generateIntroBlurb() : generateFallbackResponse(question);
            return {
                status: 200,
                headers,
                jsonBody: { success: true, response: fallbackResponse, question }
            };
        }
    }
});

function generateIntroBlurb() {
    const blurbs = [
        "Making cloud feel less cloudy at Microsoft Azure.",
        "Designs for the confused. Works at Microsoft.",
        "Part-time DJ, full-time user advocate at Azure.",
        "Turning complex systems into 'oh, that makes sense' at Microsoft.",
        "Obsessed with the moment before users fail."
    ];
    return blurbs[Math.floor(Math.random() * blurbs.length)];
}

function generateFallbackResponse(question) {
    const q = question.toLowerCase();
    
    if (q.includes('process') || q.includes('approach') || q.includes('ambiguous')) {
        return "I usually start by mapping the hidden decisions users are making without realizing it. Once those are visible, I validate assumptions with lightweight research, then design guardrails that help users succeed even when they don't fully understand the system.";
    }
    if (q.includes('research')) {
        return "I take a two-part research approach—qualitative first with interviews, then quantitative validation with surveys. For Advertising Analytics at Jungle Scout, I interviewed 6 Amazon sellers and surveyed 216 participants to prioritize the most valuable analytics needs.";
    }
    if (q.includes('jungle scout') || q.includes('advertising') || q.includes('ppc') || q.includes('analytics')) {
        return "At Jungle Scout, I led the design for Advertising Analytics—the first net-new feature since 2021. I interviewed 6 Amazon sellers, surveyed 216 participants, and facilitated workshops to translate PPC insights into actionable visualizations. The key insight: sellers were overwhelmed by metrics and needed clarity on what actions to take.";
    }
    if (q.includes('visier') || q.includes('people analytics') || q.includes('hr analytics')) {
        return "At Visier, I worked on HR/People Analytics—my early-career foundation. I designed chart visualization controls (Top-N sliders, 'Others' toggles) to handle high-cardinality data, led a mobile-first careers site redesign, and explored recruitment analytics dashboards. Key learning: making system constraints visible to guide users toward valid configurations.";
    }
    if (q.includes('copilot') || q.includes('ai') || q.includes('agentic')) {
        return "At Microsoft, I work on designing complex workflows that help users understand technical systems. I'm interested in how AI can assist users through multi-step processes—but I keep specific project details confidential.";
    }
    if (q.includes('microsoft') || q.includes('azure')) {
        return "I'm a Product Designer at Microsoft Azure, working on enterprise cloud infrastructure. My focus is on reducing friction in complex setup flows and making technical systems more legible. I keep specific project details confidential, but I'm happy to discuss my design approach and past work at Jungle Scout and Visier.";
    }
    if (q.includes('project') || q.includes('recent') || q.includes('work')) {
        return "I can share details about my work at **Jungle Scout** (Advertising Analytics for Amazon sellers) and **Visier** (chart visualization and careers site for HR analytics). At Microsoft Azure, I work on enterprise cloud infrastructure—but keep specific project details confidential.";
    }
    if (q.includes('hello') || q.includes('hi')) {
        return "Hey! I'm Grant—a product designer at Microsoft Azure focused on making complex systems legible. Ask me about my design process, projects, or experience. What would you like to know?";
    }
    return "I'm Grant, a product designer at Microsoft Azure. I design for the moments where products technically work but still fail users—especially setup, validation, and mental models. What would you like to know about my work?";
}
