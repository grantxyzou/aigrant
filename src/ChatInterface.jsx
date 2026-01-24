import { useState, useRef, useEffect } from 'react'

const API_URL = import.meta.env.DEV 
  ? 'http://localhost:7071/api/ask' 
  : '/api/ask'

export default function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)
  const [showPrompts, setShowPrompts] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const promptsRef = useRef(null)

  const suggestedPrompts = [
    "Tell me about a recent project you worked on",
    "How do you approach ambiguous problems?",
    "What's your design process like?",
    "What do you work on at Microsoft?",
    "How do you work with engineers?"
  ]

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (isOverlayOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading, isOverlayOpen])

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (isOverlayOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOverlayOpen])

  // Close prompts when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (promptsRef.current && !promptsRef.current.contains(e.target)) {
        setShowPrompts(false)
      }
    }
    
    if (showPrompts) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPrompts])

  const handlePromptClick = (prompt) => {
    setInputValue(prompt)
    setShowPrompts(false)
    inputRef.current?.focus()
  }

  const sendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = { role: 'user', content: inputValue }
    setMessages(prev => [...prev, userMessage])
    const question = inputValue
    setInputValue('')
    setIsLoading(true)
    setIsOverlayOpen(true) // Open overlay when sending

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      })

      const data = await response.json()
      
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
      } else {
        throw new Error(data.error || 'API error')
      }
    } catch (error) {
      console.error('Chat error:', error)
      const fallbackResponse = generateFallbackResponse(question)
      setMessages(prev => [...prev, { role: 'assistant', content: fallbackResponse }])
    } finally {
      setIsLoading(false)
    }
  }

  const generateFallbackResponse = (question) => {
    return "I'm Grant, a product designer at Microsoft Azure. I approach design as storytelling - blending experience and connection. The API is currently unavailable, but feel free to explore my portfolio or try again later!"
  }

  const isRelevantQuestion = (question) => {
    const grantKeywords = [
      'grant', 'design', 'portfolio', 'project', 'ux', 'ui', 'microsoft',
      'experience', 'work', 'skill', 'research', 'case study', 'process',
      'hire', 'contact', 'background', 'music', 'badminton', 'you', 'your'
    ];
    const lowerQ = question.toLowerCase();
    return grantKeywords.some(keyword => lowerQ.includes(keyword)) || 
           question.length < 50; // Allow short questions, let AI handle
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const closeOverlay = () => {
    setIsOverlayOpen(false)
  }

  const clearAndClose = () => {
    setMessages([])
    setIsOverlayOpen(false)
  }

  const openOverlay = () => {
    setIsOverlayOpen(true)
  }

  // Format message content with basic markdown support
  const formatMessage = (content) => {
    if (!content) return null
    
    // Split into paragraphs
    const paragraphs = content.split(/\n\n+/)
    
    return paragraphs.map((paragraph, pIndex) => {
      // Check if it's a bullet list
      const lines = paragraph.split('\n')
      const isBulletList = lines.every(line => 
        line.trim().startsWith('- ') || 
        line.trim().startsWith('• ') || 
        line.trim() === ''
      )
      
      if (isBulletList && lines.some(l => l.trim())) {
        return (
          <ul key={pIndex} className="message-list">
            {lines
              .filter(line => line.trim())
              .map((line, lIndex) => (
                <li key={lIndex}>{formatInlineText(line.replace(/^[-•]\s*/, ''))}</li>
              ))}
          </ul>
        )
      }
      
      // Check for numbered list
      const isNumberedList = lines.every(line => 
        /^\d+[.)]\s/.test(line.trim()) || line.trim() === ''
      )
      
      if (isNumberedList && lines.some(l => l.trim())) {
        return (
          <ol key={pIndex} className="message-list">
            {lines
              .filter(line => line.trim())
              .map((line, lIndex) => (
                <li key={lIndex}>{formatInlineText(line.replace(/^\d+[.)]\s*/, ''))}</li>
              ))}
          </ol>
        )
      }
      
      // Regular paragraph
      return <p key={pIndex}>{formatInlineText(paragraph)}</p>
    })
  }
  
  // Format inline text (bold, italic)
  const formatInlineText = (text) => {
    // Handle **bold** and *italic*
    const parts = []
    let remaining = text
    let key = 0
    
    while (remaining) {
      // Check for bold
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/)
      if (boldMatch) {
        const index = remaining.indexOf(boldMatch[0])
        if (index > 0) {
          parts.push(<span key={key++}>{remaining.slice(0, index)}</span>)
        }
        parts.push(<strong key={key++}>{boldMatch[1]}</strong>)
        remaining = remaining.slice(index + boldMatch[0].length)
        continue
      }
      
      // No more formatting, add rest
      parts.push(<span key={key++}>{remaining}</span>)
      break
    }
    
    return parts.length > 0 ? parts : text
  }

  return (
    <>
      {/* Fixed Bottom Input Bar */}
      <div className={`chat-input-bar ${isOverlayOpen ? 'hidden' : ''}`}>
        <div className={`chat-input-wrapper ${showPrompts ? 'prompts-open' : ''}`}>
          {/* Prompts popup */}
          {showPrompts && (
            <div className="prompts-popup" ref={promptsRef}>
              <div className="prompts-header">Try asking...</div>
              {suggestedPrompts.map((prompt, index) => (
                <button 
                  key={index}
                  className="prompt-chip"
                  onClick={() => handlePromptClick(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
          
          <div className={`chat-input-container ${showPrompts ? 'prompts-open' : ''}`}>
            <button 
              className="prompts-toggle-button"
              onClick={() => setShowPrompts(!showPrompts)}
              aria-label="Show suggested prompts"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="8" x2="16" y2="8"></line>
                <line x1="4" y1="14" x2="14" y2="14"></line>
                <line x1="4" y1="20" x2="12" y2="20"></line>
                <path d="M19 2l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" fill="currentColor" stroke="none"></path>
              </svg>
            </button>
            
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything about Grant..."
              disabled={isLoading}
              rows={1}
          />
          <button 
            onClick={sendMessage} 
            disabled={isLoading || !inputValue.trim()}
            aria-label="Send message"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
          </div>
        </div>
        
        {/* Expand button - shows when there are messages and overlay is closed */}
        {messages.length > 0 && (
          <button className="expand-chat-button" onClick={openOverlay} aria-label="Expand chat">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>
        )}
      </div>

      {/* Chat Overlay */}
      <div className={`chat-overlay ${isOverlayOpen ? 'open' : ''}`}>
        {/* Background glow layer */}
        <div className="chat-overlay-bg-glow" />
        
        <div className="chat-overlay-header">
          <button className="close-button" onClick={closeOverlay} aria-label="Minimize chat">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div className="chat-title-wrapper">
            <span className="chat-title">Chat with Grant's AI</span>
            <span className="chat-disclaimer">generated by gpt-4o-mini · content may be incorrect</span>
          </div>
          <button className="clear-button" onClick={clearAndClose} aria-label="Clear chat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="chat-overlay-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <div className="message-content">
                {message.role === 'assistant' ? formatMessage(message.content) : message.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message assistant loading">
              <div className="message-content">
                <span className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input inside overlay for continued conversation */}
        <div className="chat-overlay-input">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a follow-up question..."
            disabled={isLoading}
            rows={1}
          />
          <button 
            onClick={sendMessage} 
            disabled={isLoading || !inputValue.trim()}
            aria-label="Send message"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {isOverlayOpen && <div className="chat-backdrop" onClick={closeOverlay} />}
    </>
  )
}
