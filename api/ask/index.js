module.exports = async function (context, req) {module.exports = async function (context, req) {

    context.log('Grant AI Assistant - Processing request');        context.log('HTTP trigger function processed a request.');



    // CORS headers        // CORS headers

    const headers = {        const headers = {

        'Access-Control-Allow-Origin': '*',            'Access-Control-Allow-Origin': '*',

        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',

        'Access-Control-Allow-Headers': 'Content-Type',            'Access-Control-Allow-Headers': 'Content-Type',

        'Content-Type': 'application/json'            'Content-Type': 'application/json'

    };        };



    // Handle preflight OPTIONS request        // Handle preflight OPTIONS request

    if (req.method === 'OPTIONS') {        if (request.method === 'OPTIONS') {

        context.res = {            return {

            status: 200,                status: 200,

            headers: headers                headers: headers

        };            };

        return;        }

    }

        try {

    try {            // Get environment variables

        // Get user question            const endpoint = process.env.AZURE_OPENAI_ENDPOINT || 'https://grant-mete29fw-westus.services.ai.azure.com/api/rpc';

        const userQuestion = req.body?.question || req.body?.message || req.query?.question || 'Hello';            const apiKey = process.env.AZURE_OPENAI_API_KEY;

        context.log('User question:', userQuestion);            

            if (!apiKey) {

        // Generate response based on training data                throw new Error('Azure OpenAI API key not configured');

        const response = generateResponse(userQuestion);            }



        context.res = {            // Get user question

            status: 200,            const body = await request.json();

            headers: headers,            const userQuestion = body.question || body.message || 'Hello';

            body: {

                success: true,            // Load training data (for now, we'll include it inline for POC)

                response: response,            const trainingData = await loadTrainingData();

                question: userQuestion            

            }            // Create system prompt with training data

        };            const systemPrompt = `You are Grant's AI assistant, representing his design portfolio and expertise.



    } catch (error) {PERSONALITY & COMMUNICATION:

        context.log.error('Error:', error);- Speak as Grant in first person when discussing his work and experience

        context.res = {- Be authentic, thoughtful, and genuinely curious about design

            status: 500,- Balance professionalism with approachability

            headers: headers,- Show enthusiasm for design, technology, and creative problem-solving

            body: {

                success: false,GRANT'S DESIGN PHILOSOPHY:

                error: error.message- Design is storytelling - blending experience and connection

            }- Always start with the problem, avoid "solution-eering"

        };- Human-centered approach with systematic research validation

    }- Believes designers should understand their medium (technical fluency)

};- Proactive collaboration and stakeholder engagement



function generateResponse(question) {TRAINING EXAMPLES:

    const lowerQuestion = question.toLowerCase();${JSON.stringify(trainingData, null, 2)}

    

    // Process-related questionsWhen answering questions:

    if (lowerQuestion.includes('process') || lowerQuestion.includes('approach') || lowerQuestion.includes('methodology')) {1. Use Grant's actual terminology and phrases from the training data

        return "I follow a human-centered approach that starts with deep empathy for users. I believe in starting with 'why' - understanding the real problem before jumping to solutions. My process typically involves research and discovery, rapid ideation and prototyping, and continuous iteration based on user feedback. I'm particularly passionate about the intersection of music, technology, and design - often drawing inspiration from rhythm and flow in my creative work.";2. Reference specific projects, tools, and methodologies he's used

    }3. Maintain his collaborative and research-driven approach

    4. Connect answers to broader design principles when relevant

    // Research-related questions5. Be conversational but informative`;

    if (lowerQuestion.includes('research')) {

        return "I take a two-part research approach that's really thorough. I start with qualitative research - like when I interviewed 6 Amazon sellers to understand their advertising pain points for the Advertising Analytics project. Then I organize synthesis sessions using virtual stickies in FigJam to identify themes with my Product Manager. But I don't stop there - I follow up with quantitative validation, like in-app surveys to prioritize solutions based on real data.";            // Call Azure OpenAI

    }            const response = await fetch(`${endpoint}/openai/deployments/gpt-4/chat/completions?api-version=2024-02-15-preview`, {

                    method: 'POST',

    // Project/work questions                headers: {

    if (lowerQuestion.includes('project') || lowerQuestion.includes('work') || lowerQuestion.includes('portfolio') || lowerQuestion.includes('example')) {                    'Content-Type': 'application/json',

        return "One project I'm particularly proud of is the Advertising Analytics feature for Jungle Scout Orange. This was the first net new feature since 2021, and I served as the design owner. The challenge was helping Amazon sellers understand their Pay-per-click data and derive actionable insights. I led the entire process - from customer interviews with 6 Orange customers, to synthesis sessions using FigJam, to facilitating brainstorming workshops with stakeholders. We validated everything through both qualitative research and a quantitative survey with 216 participants.";                    'api-key': apiKey

    }                },

                    body: JSON.stringify({

    // Collaboration questions                    messages: [

    if (lowerQuestion.includes('collaboration') || lowerQuestion.includes('team') || lowerQuestion.includes('stakeholder')) {                        { role: 'system', content: systemPrompt },

        return "I'm proactive about bringing stakeholders into the process rather than presenting to them at the end. When working on the Advertising Analytics feature, I created a 60-minute brainstorming workshop to make sure everyone had a voice in the ideation. I believe in 'pulling stakeholders in for collaboration and progress updates' throughout the project to avoid information overload during final sign-offs. I also work closely with engineering teams during implementation and coordinate with marketing and video teams for launch readiness.";                        { role: 'user', content: userQuestion }

    }                    ],

                        max_tokens: 800,

    // Philosophy questions                    temperature: 0.7

    if (lowerQuestion.includes('philosophy') || lowerQuestion.includes('belief') || lowerQuestion.includes('principle')) {                })

        return "I have a strong 'problem-first' philosophy - I actively challenge briefs and avoid what I call 'solution-eering.' I believe it's dangerous when brief authors create problems with solutions already in mind, because you might end up solving an unvalidated problem that doesn't actually address customer pain. I always start with understanding the real problem before jumping to design solutions. Design, to me, is storytelling - it's about blending experience and connection whether working on interfaces, beats, or shared moments.";            });

    }

                if (!response.ok) {

    // Tools questions                const errorText = await response.text();

    if (lowerQuestion.includes('tool') || lowerQuestion.includes('software') || lowerQuestion.includes('figma')) {                throw new Error(`Azure OpenAI API error: ${response.status} - ${errorText}`);

        return "I work primarily in Figma for design systems and interface work, and I'm comfortable across the Adobe Creative Suite. But what makes me unique is my technical fluency - I code in React and I'm not afraid to get my hands dirty with CSS animations and interactions. I believe designers should understand the medium they're designing for, so I stay close to the development process. I also use FigJam extensively for research synthesis and collaboration, and tools like UserZoom Go for concept testing.";            }

    }

            const data = await response.json();

    // Data visualization questions            const aiResponse = data.choices[0].message.content;

    if (lowerQuestion.includes('data') || lowerQuestion.includes('visualization') || lowerQuestion.includes('complex')) {

        return "I approach data visualization as a storytelling challenge. In my Advertising Analytics project, I had to take complex PPC data that was 'foreign to customers' and create compelling visualizations that helped users uncover insights. I worked closely with my PM (who was also an Amazon seller) for a full week to plan out answers to customers' business questions. Then I validated the data visualizations through concept testing on UserZoom Go with actual Amazon sellers. My approach is always about making the complex accessible.";            return {

    }                status: 200,

                    headers: headers,

    // Default response                body: JSON.stringify({

    return "Thanks for asking! I'm Grant, a product designer who approaches design as storytelling - blending experience and connection. I work across digital experiences with a focus on user-centered design and creative technology exploration. I'm particularly interested in how design can create meaningful connections between people and technology. Feel free to ask me about my design process, research approach, collaboration methods, or specific projects like the Advertising Analytics feature I worked on at Jungle Scout!";                    success: true,

}                    response: aiResponse,
                    question: userQuestion
                })
            };

        } catch (error) {
            context.log.error('Error:', error);
            return {
                status: 500,
                headers: headers,
                body: JSON.stringify({
                    success: false,
                    error: error.message
                })
            };
        }
    }
});

async function loadTrainingData() {
    // For POC, we'll load the training data inline
    // In production, this would read from your content/training files
    return {
        conversations: [
            {
                topic: "Portfolio Overview",
                example: "Grant approaches design as storytelling - blending experience and connection whether working on interfaces, beats, or shared moments. His work spans digital experiences with a focus on user-centered design and creative technology exploration."
            },
            {
                topic: "Design Process",
                example: "Grant follows a human-centered approach that starts with deep empathy for users. He believes in starting with 'why' - understanding the real problem before jumping to solutions. His process involves research and discovery, rapid ideation and prototyping, and continuous iteration based on user feedback."
            },
            {
                topic: "Research Approach",
                example: "Grant takes a two-part research approach - starting with qualitative research like customer interviews, then following up with quantitative validation through surveys. He organizes synthesis sessions using tools like FigJam to identify themes with his Product Manager."
            },
            {
                topic: "Problem-First Philosophy",
                example: "Grant actively challenges briefs and avoids 'solution-eering.' He believes it's dangerous when brief authors create problems with solutions already in mind. He always validates customer needs first through interviews before defining solutions."
            }
        ]
    };
}
