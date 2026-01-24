import './App.css'
import { useState, useEffect, useRef } from 'react'
import { FaInstagram, FaGithub, FaLinkedinIn } from 'react-icons/fa'
import ChatInterface from './ChatInterface'

const experience = [
  { role: 'Product designer 2', company: 'Microsoft (Azure core)', period: 'Apr 2025 – Present', location: 'Remote & Vancouver, CA' },
  { role: 'Product designer 2', company: 'Microsoft (Cost Management)', period: 'Jun 2022 – Apr 2025', location: 'Remote & Vancouver, CA' },
  { role: 'User experience designer I', company: 'Jungle Scout', period: 'Feb 2020 – May 2022', location: 'Remote & Vancouver, CA' },
  { role: 'User experience designer', company: 'Visier Inc.', period: 'May 2018 – Dec 2019', location: 'Vancouver, CA' },
]

export default function App(){
  const [typewriterText, setTypewriterText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showChat, setShowChat] = useState(false)
  const [introBlurb, setIntroBlurb] = useState('')
  const [isLoadingBlurb, setIsLoadingBlurb] = useState(true)
  const footerRef = useRef(null)
  
  const fullText = "you've reached the edge. i am still loading what's next..."

  const API_URL = import.meta.env.DEV 
    ? 'http://localhost:7071/api/ask' 
    : '/api/ask'

  const defaultBlurb = "Currently under construction. What you see here is only scaffolding; the full narrative is still being built. Stay tuned for a portfolio that doesn't just showcase, but converses."

  // Fetch dynamic intro blurb on page load
  useEffect(() => {
    const fetchIntroBlurb = async () => {
      // Check session storage first to avoid repeated calls
      const cached = sessionStorage.getItem('introBlurb')
      if (cached) {
        setIntroBlurb(cached)
        setIsLoadingBlurb(false)
        return
      }

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            question: '__INTRO_BLURB__',
            isIntroRequest: true 
          })
        })
        
        const data = await response.json()
        if (data.success && data.response) {
          setIntroBlurb(data.response)
          sessionStorage.setItem('introBlurb', data.response)
        } else {
          setIntroBlurb(defaultBlurb)
        }
      } catch (error) {
        console.error('Failed to fetch intro:', error)
        setIntroBlurb(defaultBlurb)
      } finally {
        setIsLoadingBlurb(false)
      }
    }

    fetchIntroBlurb()
  }, [])
  
  const startTypewriter = () => {
    if (hasAnimated) return
    
    setHasAnimated(true)
    setIsTyping(true)
    let index = 0
    setTypewriterText('')
    
    const typeInterval = setInterval(() => {
      if (index < fullText.length) {
        setTypewriterText(fullText.slice(0, index + 1))
        index++
      } else {
        clearInterval(typeInterval)
        setIsTyping(false)
      }
    }, 50)
  }
  
  // Secret chat access: ?chat=grant2026 OR #chat-grant2026
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const hash = window.location.hash
    
    if (params.get('chat') === 'grant2026' || hash === '#chat-grant2026') {
      setShowChat(true)
      sessionStorage.setItem('chatEnabled', 'true')
    } else if (sessionStorage.getItem('chatEnabled') === 'true') {
      setShowChat(true)
    }
  }, [])

  useEffect(() => {
    // Mouse tracking for parallax effect
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      setMousePosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Intersection observer for typewriter
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startTypewriter()
          }
        })
      },
      { threshold: 0.1 }
    )
    
    if (footerRef.current) {
      observer.observe(footerRef.current)
    }
    
    // Fallback: start animation after 2 seconds if not triggered by intersection
    const fallbackTimer = setTimeout(() => {
      if (!hasAnimated) {
        startTypewriter()
      }
    }, 2000)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      observer.disconnect()
      clearTimeout(fallbackTimer)
    }
  }, [])
  return (
    <>
      {/* Fixed Background */}
      <div 
        className="bg-aurora"
        style={{
          transform: `translate(${mousePosition.x * 5}px, ${mousePosition.y * 3}px)`
        }}
      >
        {/* Additional gradient layer */}
        <div 
          className="gradient-layer"
          style={{
            transform: `rotate(-58deg) translate(${mousePosition.x * -8}px, ${mousePosition.y * 6}px)`
          }}
        ></div>
      </div>
      
      {/* Scrollable Content */}
      <div className="responsive-container">
        {/* Header */}
        <div className="header-container">
          <div className="header-inner">
            <div className="header-left">
              <div>
                <span className="header-maybe">maybe:</span>
                <span className="header-name"> Grant Zou</span>
              </div>
              <div className="header-title">
                <div className="header-ai">ai</div>
                <div className="header-designer">product designer</div>
              </div>
            </div>
            <div className="header-right">
              <div className="construction-text">This website is still under construction</div>
              <div className="construction-emoji">🚧</div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="main-container">
          {/* Sidebar */}
          <div className="sidebar">
            <div className="sidebar-bio">
              <div className="bio-text">
                Grant remixes music, experiments with new technologies, and keeps rhythm in life through badminton and running. He sees design as storytelling: blending experience and connection, whether in beats, interfaces, or shared moments.
              </div>
            </div>
            
            {/* Desktop Social Links */}
            <div className="social-link">
              <FaInstagram className="social-icon-svg" />
              <a href="https://instagram.com/granitez" target="_blank" rel="noopener noreferrer" className="social-text">@granitez</a>
            </div>
            <div className="social-link">
              <FaLinkedinIn className="social-icon-svg" />
              <a href="https://www.linkedin.com/in/grantxyzou" target="_blank" rel="noopener noreferrer" className="social-text">linkedin.com/in/grantxyzou</a>
            </div>
            <div className="social-link social-link-last">
              <FaGithub className="social-icon-svg" />
              <a href="https://github.com/grantxyzou" target="_blank" rel="noopener noreferrer" className="social-text">github.com/grantxyzou</a>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="content">
            {/* About Me Section */}
            <div className="section about-section">
              <div className="section-title">About...me</div>
              <div className="section-content">
                <div className="about-text">
                  {isLoadingBlurb ? (
                    <span className="blurb-loading">Loading a fresh take...</span>
                  ) : (
                    introBlurb
                  )}
                </div>
              </div>
            </div>
            
            {/* Experience Section */}
            <div className="section experience-section">
              <div className="section-title">About his experience...</div>
              <div className="experience-list">
                {experience.map((exp, i) => (
                  <div key={i} className={`experience-item ${i > 0 ? 'experience-border' : ''}`}>
                    <div className="experience-content">
                      <div className="experience-role">{exp.role}</div>
                      <div className="experience-details">
                        <div className="experience-company">{exp.company}</div>
                        <div className="experience-period">{exp.period}</div>
                        <div className="experience-location">{exp.location}</div>
                      </div>
                    </div>
                    <div className="experience-dot" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Chat Interface - Now always rendered, input bar at bottom */}
            {showChat && <ChatInterface />}
            
            {/* Footer */}
            <div className="footer" ref={footerRef}>
              <div className="footer-content">
                <div className="footer-text typewriter">
                  {typewriterText || fullText}
                  {typewriterText && <span className={`cursor ${isTyping ? 'blinking' : 'steady'}`}>|</span>}
                </div>
              </div>
            </div>
          </div>
          
          {/* Social Links - Mobile Bottom */}
          <div className="social-links-mobile">
            <div className="social-link">
              <FaInstagram className="social-icon-svg" />
              <a href="https://instagram.com/granitez" target="_blank" rel="noopener noreferrer" className="social-text">@granitez</a>
            </div>
            <div className="social-link">
              <FaLinkedinIn className="social-icon-svg" />
              <a href="https://www.linkedin.com/in/grantxyzou" target="_blank" rel="noopener noreferrer" className="social-text">linkedin.com/in/grantxyzou</a>
            </div>
            <div className="social-link social-link-last">
              <FaGithub className="social-icon-svg" />
              <a href="https://github.com/grantxyzou" target="_blank" rel="noopener noreferrer" className="social-text">github.com/grantxyzou</a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
