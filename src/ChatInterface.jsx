import { useState } from 'react'

export default function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = { role: 'user', content: inputValue }
    setMessages(prev => [...prev, userMessage])
    const question = inputValue
    setInputValue('')
    setIsLoading(true)

    try {
      // For POC: Use local response generation based on training data
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
      
      const response = generateGrantResponse(question)
      const aiMessage = { role: 'assistant', content: response }
      setMessages(prev => [...prev, aiMessage])
      
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // POC: Generate responses based on Grant's training data
  const generateGrantResponse = (question) => {
    const lowerQuestion = question.toLowerCase()
    
    // Create response variations and pick randomly for more dynamic responses
    const getRandomResponse = (responses) => {
      return responses[Math.floor(Math.random() * responses.length)]
    }

    // Add some conversational starters
    const conversationalStarters = [
      "Great question! ",
      "That's something I'm passionate about. ",
      "Interesting you ask that - ",
      "I love talking about this. ",
      "That's a key part of my approach. ",
      ""
    ]

    const starter = getRandomResponse(conversationalStarters)
    
    // Process-related questions
    if (lowerQuestion.includes('process') || lowerQuestion.includes('approach') || lowerQuestion.includes('methodology') || lowerQuestion.includes('how do you')) {
      const responses = [
        "I follow a human-centered approach that starts with deep empathy for users. I believe in starting with 'why' - understanding the real problem before jumping to solutions. My process typically involves research and discovery, rapid ideation and prototyping, and continuous iteration based on user feedback.",
        "My design process is all about avoiding 'solution-eering' - I always challenge the brief and make sure we're solving the right problem first. I start with customer interviews, move into synthesis using tools like FigJam, then validate with both qualitative and quantitative research.",
        "I'm big on systematic validation. For the Advertising Analytics project, I interviewed 6 Amazon sellers first, synthesized findings with my PM, then ran a survey with 216 participants to prioritize features. It's about being methodical but staying human-centered."
      ]
      return starter + getRandomResponse(responses)
    }
    
    // Research-related questions
    if (lowerQuestion.includes('research') || lowerQuestion.includes('validate') || lowerQuestion.includes('user')) {
      const responses = [
        "I take a two-part research approach - qualitative first, then quantitative validation. Like when I interviewed 6 Amazon sellers about their PPC pain points, then organized synthesis sessions using FigJam with my Product Manager before running surveys to prioritize needs.",
        "Research is where I geek out! I love doing customer interviews - there's something about hearing users describe their actual pain points that you just can't get from analytics. Then I validate those insights with broader surveys. For Advertising Analytics, we got 216 participants to help us prioritize features.",
        "I organize synthesis sessions using virtual stickies in FigJam - it helps identify recurring themes. But I never stop at qual research. I follow up with quantitative validation because you need both the depth and the breadth to make confident design decisions."
      ]
      return starter + getRandomResponse(responses)
    }
    
    // Project/work questions
    if (lowerQuestion.includes('project') || lowerQuestion.includes('work') || lowerQuestion.includes('portfolio') || lowerQuestion.includes('example') || lowerQuestion.includes('jungle scout')) {
      const responses = [
        "The Advertising Analytics feature at Jungle Scout is one I'm really proud of. It was the first net new feature for Orange since 2021, and I owned the entire design process - from customer interviews with 6 sellers, to FigJam synthesis, to facilitating stakeholder workshops. We validated everything through a 216-participant survey.",
        "At Jungle Scout, I led the design for Advertising Analytics - helping Amazon sellers understand their PPC data. The challenge was taking complex advertising metrics that were 'foreign to customers' and creating insights they could actually act on. I worked closely with my PM (who was also a seller) to plan out business questions, then validated our data visualizations through UserZoom Go testing.",
        "I spearheaded Advertising Analytics as design owner, which taught me so much about cross-team collaboration. I had to facilitate workshops to get stakeholders aligned, work closely with engineering during implementation, and coordinate with marketing and video teams for launch. The key was pulling everyone into the process rather than presenting at the end."
      ]
      return starter + getRandomResponse(responses)
    }
    
    // Collaboration questions
    if (lowerQuestion.includes('collaboration') || lowerQuestion.includes('team') || lowerQuestion.includes('stakeholder') || lowerQuestion.includes('workshop')) {
      const responses = [
        "I'm proactive about bringing stakeholders into the process rather than presenting to them at the end. For Advertising Analytics, I ran a 60-minute brainstorming workshop to make sure everyone had a voice. I believe in 'pulling stakeholders in for collaboration and progress updates' throughout the project.",
        "Spearheading a new project requires proactiveness and cross-team collaboration. I've learned to periodically pull in stakeholders for feedback as the project progresses. The workshop I facilitated was particularly useful - it avoided presenting massive amounts of information during final sign-off.",
        "I coordinate across teams constantly - engineering during implementation, marketing for launch alignment, video teams for content. The key is making sure everyone understands the 'why' behind design decisions, not just the 'what.'"
      ]
      return starter + getRandomResponse(responses)
    }
    
    // Philosophy questions
    if (lowerQuestion.includes('philosophy') || lowerQuestion.includes('belief') || lowerQuestion.includes('principle') || lowerQuestion.includes('think')) {
      const responses = [
        "I have a strong 'problem-first' philosophy - I actively challenge briefs and avoid 'solution-eering.' It's dangerous when you create problems with solutions already in mind. I always validate customer needs first through interviews before defining solutions.",
        "Design is storytelling to me - it's about blending experience and connection whether I'm working on interfaces, beats, or shared moments. I see design as creating meaningful connections between people and technology.",
        "I believe designers should understand their medium. That's why I code in React and get my hands dirty with CSS animations. If you're designing for the web, you should understand how the web works. It makes me a better collaborator with engineering teams."
      ]
      return starter + getRandomResponse(responses)
    }
    
    // Tools questions
    if (lowerQuestion.includes('tool') || lowerQuestion.includes('software') || lowerQuestion.includes('figma') || lowerQuestion.includes('tech')) {
      const responses = [
        "I work primarily in Figma for design systems and interface work, plus I'm comfortable across Adobe Creative Suite. But my technical fluency sets me apart - I code in React and love working with CSS animations. I believe designers should understand their medium.",
        "FigJam is huge for me - I use it for research synthesis and collaboration constantly. For concept testing, UserZoom Go is my go-to. But honestly, I think my ability to code in React makes me unique. I can prototype interactions and work closely with engineering teams.",
        "My tool stack is pretty standard - Figma, Adobe Creative Suite, FigJam for collaboration. But I also code, which helps me stay close to the development process. I'm not afraid to get my hands dirty with CSS animations and interactions."
      ]
      return starter + getRandomResponse(responses)
    }

    // Data/complex questions
    if (lowerQuestion.includes('data') || lowerQuestion.includes('visualization') || lowerQuestion.includes('complex') || lowerQuestion.includes('analytics')) {
      const responses = [
        "I approach data visualization as a storytelling challenge. In Advertising Analytics, I had to take complex PPC data that was 'foreign to customers' and create compelling visualizations. I worked with my PM for a full week to plan out answers to customers' business questions, then validated through UserZoom Go testing.",
        "Making complex data accessible is all about understanding the user's mental model. For the advertising project, I had to learn how Amazon sellers think about their campaigns, then design visualizations that matched their existing understanding while revealing new insights.",
        "Data viz is where research really pays off. You can't just throw charts at users - you need to understand what questions they're trying to answer. That's why I spent so much time with our PM (who was also a seller) planning out the business logic behind each visualization."
      ]
      return starter + getRandomResponse(responses)
    }

    // Career/Microsoft questions
    if (lowerQuestion.includes('microsoft') || lowerQuestion.includes('career') || lowerQuestion.includes('experience') || lowerQuestion.includes('background')) {
      const responses = [
        "I'm currently a Product Designer 2 at Microsoft Azure - started in Cost Management in 2022 and recently moved to Azure Core. Before that, I was at Jungle Scout working on that Advertising Analytics project. Each role has taught me different things about design at scale.",
        "My path has been startup to enterprise - from Visier to Jungle Scout to Microsoft. Each environment taught me something different. Jungle Scout gave me that scrappy, validate-everything mindset, while Microsoft is teaching me about design systems at massive scale.",
        "At Microsoft, I've learned so much about designing for complex enterprise scenarios. It's different from the consumer-focused work at Jungle Scout, but the human-centered principles are the same. Just the scale and stakeholder complexity is much bigger."
      ]
      return starter + getRandomResponse(responses)
    }

    // Music/personal questions  
    if (lowerQuestion.includes('music') || lowerQuestion.includes('remix') || lowerQuestion.includes('personal') || lowerQuestion.includes('badminton')) {
      const responses = [
        "I remix music and see a lot of parallels with design - both are about rhythm, flow, and creating emotional connections. I often draw inspiration from music when thinking about user journeys and interaction timing.",
        "Music production has actually made me a better designer. Both require understanding timing, building tension and release, and creating experiences that feel effortless but are actually carefully crafted.",
        "I keep rhythm in life through badminton and running, but music is where I really experiment creatively. There's something about the technical precision of both music production and design that appeals to me."
      ]
      return starter + getRandomResponse(responses)
    }
    
    // Default responses - now with variety
    const defaultResponses = [
      "I'm Grant, a product designer who approaches design as storytelling - blending experience and connection. I work across digital experiences with a focus on user-centered design and creative technology. What specifically would you like to know about my work?",
      "I'm passionate about human-centered design and creative technology exploration. Currently at Microsoft Azure, previously at Jungle Scout where I led the Advertising Analytics project. What aspect of design interests you most?",
      "Design is storytelling to me - whether I'm working on interfaces, remixing music, or collaborating with teams. I'm particularly interested in how design creates meaningful connections between people and technology. What would you like to explore?"
    ]
    
    return starter + getRandomResponse(defaultResponses)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h3>Ask Grant about his design work</h3>
        <p>Try asking: "What's your design process?" or "Tell me about your research approach"</p>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            👋 Hi! I'm Grant's AI assistant. Ask me about his design work, process, or experience.
          </div>
        )}
        
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="message-content">
              {message.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message assistant loading">
            <div className="message-content">Thinking...</div>
          </div>
        )}
      </div>
      
      <div className="chat-input">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about Grant's design work..."
          disabled={isLoading}
        />
        <button 
          onClick={sendMessage} 
          disabled={isLoading || !inputValue.trim()}
        >
          Send
        </button>
      </div>
    </div>
  )
}