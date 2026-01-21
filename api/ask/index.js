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

        const response = generateResponse(userQuestion);

        context.res = {
            status: 200,
            headers,
            body: { success: true, response, question: userQuestion }
        };
    } catch (error) {
        context.log.error('Error:', error);
        context.res = {
            status: 500,
            headers,
            body: { success: false, error: error.message }
        };
    }
};

function generateResponse(question) {
    const q = question.toLowerCase();
    
    const starters = ["", "Great question! ", "That's something I'm passionate about. ", ""];
    const starter = starters[Math.floor(Math.random() * starters.length)];

    if (q.includes('process') || q.includes('approach') || q.includes('methodology') || q.includes('how do you')) {
        return starter + "I follow a human-centered approach that starts with deep empathy for users. I believe in starting with 'why' - understanding the real problem before jumping to solutions. My process involves research and discovery, rapid ideation, and continuous iteration based on user feedback.";
    }

    if (q.includes('research') || q.includes('validate') || q.includes('user')) {
        return starter + "I take a two-part research approach - qualitative first, then quantitative validation. For example, I interviewed 6 Amazon sellers about their PPC pain points, then organized synthesis sessions using FigJam before running surveys with 216 participants to prioritize needs.";
    }

    if (q.includes('project') || q.includes('work') || q.includes('portfolio') || q.includes('example') || q.includes('jungle scout')) {
        return starter + "The Advertising Analytics feature at Jungle Scout is one I'm really proud of. It was the first net new feature for Orange since 2021. I owned the entire design process - from customer interviews, to FigJam synthesis, to facilitating stakeholder workshops. We validated everything through a 216-participant survey.";
    }

    if (q.includes('collaboration') || q.includes('team') || q.includes('stakeholder') || q.includes('workshop')) {
        return starter + "I'm proactive about bringing stakeholders into the process rather than presenting to them at the end. For Advertising Analytics, I ran a 60-minute brainstorming workshop to make sure everyone had a voice. I believe in pulling stakeholders in for collaboration throughout the project.";
    }

    if (q.includes('philosophy') || q.includes('belief') || q.includes('principle') || q.includes('think')) {
        return starter + "I have a strong 'problem-first' philosophy - I actively challenge briefs and avoid 'solution-eering.' It's dangerous when you create problems with solutions already in mind. I always validate customer needs first through interviews before defining solutions.";
    }

    if (q.includes('tool') || q.includes('software') || q.includes('figma') || q.includes('tech')) {
        return starter + "I work primarily in Figma for design systems and interface work. But my technical fluency sets me apart - I code in React and love working with CSS animations. I believe designers should understand their medium.";
    }

    if (q.includes('data') || q.includes('visualization') || q.includes('complex') || q.includes('analytics')) {
        return starter + "I approach data visualization as a storytelling challenge. In Advertising Analytics, I had to take complex PPC data that was 'foreign to customers' and create compelling visualizations. I worked with my PM for a full week to plan out answers to customers' business questions.";
    }

    if (q.includes('microsoft') || q.includes('career') || q.includes('experience') || q.includes('background')) {
        return starter + "I'm currently a Product Designer 2 at Microsoft Azure - started in Cost Management in 2022 and recently moved to Azure Core. Before that, I was at Jungle Scout. Each role has taught me different things about design at scale.";
    }

    if (q.includes('music') || q.includes('remix') || q.includes('personal') || q.includes('badminton') || q.includes('hobby')) {
        return starter + "I remix music and see parallels with design - both are about rhythm, flow, and creating emotional connections. I keep balance through badminton and running. There's something about technical precision in both music production and design that appeals to me.";
    }

    if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.match(/^(yo|sup)/)) {
        return "Hey! I'm Grant's AI assistant. Ask me about his design process, projects at Microsoft or Jungle Scout, or his approach to research. What would you like to know?";
    }

    return starter + "I'm Grant, a product designer who approaches design as storytelling - blending experience and connection. I'm currently at Microsoft Azure, previously at Jungle Scout. What specifically would you like to know about my work?";
}
