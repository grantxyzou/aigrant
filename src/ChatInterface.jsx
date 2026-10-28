import { useState, useRef, useEffect } from 'react'
import { API_URL } from './config'
import perspectives from './perspectives.json'
import { caseStudies } from './caseStudies'

export default function ChatInterface({ role = null, onNavigate } = {}) {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)
  const [showPrompts, setShowPrompts] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const promptsRef = useRef(null)

  const defaultPrompts = [
    "Tell me about a recent project you worked on",
    "How do you approach ambiguous problems?",
    "What's your design process like?",
    "What do you work on at Microsoft?",
    "How do you work with engineers?"
  ]
  // Seed the prompts to what this role most wants to know
  const suggestedPrompts = (role && perspectives[role]?.askSeeds) || defaultPrompts
  // Where every answer points next
  const contact = (role && perspectives[role]?.cta) || { label: 'Get in touch', href: 'mailto:grant.zou@outlook.com' }

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
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInputValue('')
    setIsLoading(true)
    setIsOverlayOpen(true)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Answers go back with their [[id]] markers so the model keeps citing.
        body: JSON.stringify({ messages: updatedMessages.map(({ role, content }) => ({ role, content })), role })
      })

      const data = await response.json()

      if (response.status === 429) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          plain: true,
          content: data.error || "Slow down! You're asking too many questions. Try again in a couple minutes."
        }])
        return
      }

      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response, sources: data.sources || [] }])
      } else {
        throw new Error(data.error || 'API error')
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        plain: true,
        content: "I'm Grant, a product designer at Microsoft Azure. I design for the moments where products technically work but still fail users. The API is currently unavailable — feel free to explore my portfolio or try again shortly."
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
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

  // A citation opens the section it names, after the overlay gets out of the way.
  const openSource = (href) => {
    closeOverlay()
    onNavigate?.(href)
  }

  const formatMessage = (content, sources = []) => {
    if (!content) return null

    const paragraphs = content.split(/\n\n+/)

    return paragraphs.map((paragraph, pIndex) => {
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
                <li key={lIndex}>{formatInlineText(line.replace(/^[-•]\s*/, ''), sources)}</li>
              ))}
          </ul>
        )
      }

      const isNumberedList = lines.every(line =>
        /^\d+[.)]\s/.test(line.trim()) || line.trim() === ''
      )

      if (isNumberedList && lines.some(l => l.trim())) {
        return (
          <ol key={pIndex} className="message-list">
            {lines
              .filter(line => line.trim())
              .map((line, lIndex) => (
                <li key={lIndex}>{formatInlineText(line.replace(/^\d+[.)]\s*/, ''), sources)}</li>
              ))}
          </ol>
        )
      }

      return <p key={pIndex}>{formatInlineText(paragraph, sources)}</p>
    })
  }

  // Renders **bold** and [[source-id]] citations. A citation becomes its
  // number in this answer's source list; one the server didn't list is dropped.
  const formatInlineText = (text, sources = []) => {
    const parts = []
    let remaining = text
    let key = 0

    while (remaining) {
      const match = remaining.match(/\*\*(.+?)\*\*|\s*\[\[([^\]]+)\]\]/)
      if (match) {
        if (match.index > 0) {
          parts.push(<span key={key++}>{remaining.slice(0, match.index)}</span>)
        }
        if (match[1] !== undefined) {
          parts.push(<strong key={key++}>{match[1]}</strong>)
        } else {
          match[2].split(',').map((id) => id.trim()).forEach((id) => {
            const n = sources.findIndex((s) => s.id === id)
            if (n < 0) return
            const source = sources[n]
            parts.push(source.href
              ? <button key={key++} type="button" className="cite" onClick={() => openSource(source.href)} aria-label={`Source ${n + 1}: ${source.label}`}>{n + 1}</button>
              : <span key={key++} className="cite cite-static" aria-label={`Source ${n + 1}: ${source.label}`}>{n + 1}</span>)
          })
        }
        remaining = remaining.slice(match.index + match[0].length)
        continue
      }

      parts.push(<span key={key++}>{remaining}</span>)
      break
    }

    return parts.length > 0 ? parts : text
  }

  const SendIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  )

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
              onKeyDown={handleKeyDown}
              placeholder="Ask me a question..."
              disabled={isLoading}
              rows={1}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim()}
              aria-label="Send message"
            >
              <SendIcon />
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
        <div className="chat-overlay-bg-glow" />

        <div className="chat-overlay-header">
          <button className="close-button" onClick={closeOverlay} aria-label="Minimize chat">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div className="chat-title-wrapper">
            <span className="chat-title">Chat with Grant's AI</span>
            <span className="chat-disclaimer">gpt-4o-mini · numbers link to the source · may be incorrect</span>
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
                {message.role === 'assistant' ? formatMessage(message.content, message.sources) : message.content}
              </div>
              {message.role === 'assistant' && !message.plain && (
                message.sources?.length > 0 ? (
                  <ol className="message-sources" aria-label="Sources">
                    {message.sources.map((s, n) => (
                      <li key={s.id}>
                        <span className="message-source-n">{n + 1}</span>
                        {s.href
                          ? <button type="button" className="message-source-link" onClick={() => openSource(s.href)}>{s.label} →</button>
                          : <span className="message-source-static">{s.label}</span>}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="message-unsourced">No sources cited for this answer</div>
                )
              )}
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

        {/* Forward motion — never leave the visitor at a dead end */}
        {messages.some(m => m.role === 'assistant') && (
          <div className="chat-forward">
            <span className="chat-forward-label">Keep going</span>
            <div className="chat-forward-links">
              {Object.values(caseStudies).map(cs => (
                <button
                  key={cs.slug}
                  className="chat-forward-link"
                  onClick={() => { closeOverlay(); onNavigate?.(`/work/${cs.slug}`) }}
                >{cs.navLabel} →</button>
              ))}
              <a className="chat-forward-link chat-forward-cta" href={contact.href}>{contact.label} →</a>
            </div>
          </div>
        )}

        {/* Input inside overlay for continued conversation */}
        <div className="chat-overlay-input">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a follow-up question..."
            disabled={isLoading}
            rows={1}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputValue.trim()}
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {isOverlayOpen && <div className="chat-backdrop" onClick={closeOverlay} />}
    </>
  )
}
