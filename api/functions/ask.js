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

        // Handle preflight
        if (request.method === 'OPTIONS') {
            return { status: 200, headers };
        }

        try {
            // Get question from body or query
            let userQuestion = 'Hello';
            if (request.method === 'POST') {
                const body = await request.json();
                userQuestion = body.question || body.message || 'Hello';
            } else {
                userQuestion = request.query.get('question') || 'Hello';
            }

            context.log('User question:', userQuestion);

            // Generate response (local for now, can switch to Azure OpenAI later)
            const response = generateResponse(userQuestion);

            return {
                status: 200,
                headers,
                jsonBody: { success: true, response, question: userQuestion }
            };

        } catch (error) {
            context.error('Error:', error);
            return {
                status: 500,
                headers,
                jsonBody: { success: false, error: error.message }
            };
        }
    }
});

function generateResponse(question) {
    const q = question.toLowerCase();
    
    const starters = [
        "Great question! ",
        "That's something I'm passionate about. ",
        "",
        "I love talking about this. ",
        ""
    ];
    const starter = starters[Math.floor(Math.random() * starters.length)];

    // Process/methodology
    if (q.includes('process') || q.includes('approach') || q.includes('methodology') || q.includes('how do you')) {
        return starter + "I follow a human-centered approach that starts with deep empathy for users. I believe in starting with 'why' - understanding the real problem before jumping to solutions. My process typically involves research and discovery, rapid ideation and prototyping, and continuous iteration based on user feedback.";
    }

    // Research
    if (q.includes('research') || q.includes('validate') || q.includes('user')) {
        return starter + "I take a two-part research approach - qualitative first, then quantitative validation. Like when I interviewed 6 Amazon sellers about their PPC pain points, then organized synthesis sessions using FigJam with my Product Manager before running surveys to prioritize needs.";
    }

    // Projects
    if (q.includes('project') || q.includes('work') || q.includes('portfolio') || q.includes('example') || q.includes('jungle scout')) {
        return starter + "The Advertising Analytics feature at Jungle Scout is one I'm really proud of. It was the first net new feature for Orange since 2021, and I owned the entire design process - from customer interviews with 6 sellers, to FigJam synthesis, to facilitating stakeholder workshops. We validated everything through a 216-participant survey.";
    }

    // Collaboration
    if (q.includes('collaboration') || q.includes('team') || q.includes('stakeholder') || q.includes('workshop')) {
        return starter + "I'm proactive about bringing stakeholders into the process rather than presenting to them at the end. For Advertising Analytics, I ran a 60-minute brainstorming workshop to make sure everyone had a voice. I believe in pulling stakeholders in for collaboration throughout the project.";
    }

    // Philosophy
    if (q.includes('philosophy') || q.includes('belief') || q.includes('principle') || q.includes('think')) {
        return starter + "I have a strong 'problem-first' philosophy - I actively challenge briefs and avoid 'solution-eering.' It's dangerous when you create problems with solutions already in mind. I always validate customer needs first through interviews before defining solutions.";
    }

    // Tools
    if (q.includes('tool') || q.includes('software') || q.includes('figma') || q.includes('tech')) {
        return starter + "I work primarily in Figma for design systems and interface work. But my technical fluency sets me apart - I code in React and love working with CSS animations. I believe designers should understand their medium.";
    }

    // Data visualization
    if (q.includes('data') || q.includes('visualization') || q.includes('complex') || q.includes('analytics')) {
        return starter + "I approach data visualization as a storytelling challenge. In Advertising Analytics, I had to take complex PPC data that was 'foreign to customers' and create compelling visualizations. I worked with my PM for a full week to plan out answers to customers' business questions.";
    }

    // Career/Microsoft
    if (q.includes('microsoft') || q.includes('career') || q.includes('experience') || q.includes('background')) {
        return starter + "I'm currently a Product Designer 2 at Microsoft Azure - started in Cost Management in 2022 and recently moved to Azure Core. Before that, I was at Jungle Scout. Each role has taught me different things about design at scale.";
    }

    // Personal/music
    if (q.includes('music') || q.includes('remix') || q.includes('personal') || q.includes('badminton') || q.includes('hobby')) {
        return starter + "I remix music and see parallels with design - both are about rhythm, flow, and creating emotional connections. I keep balance through badminton and running. There's something about technical precision in both music production and design that appeals to me.";
    }

    // Default
    return starter + "I'm Grant, a product designer who approaches design as storytelling - blending experience and connection. I'm currently at Microsoft Azure, previously at Jungle Scout. What specifically would you like to know about my work?";
}
