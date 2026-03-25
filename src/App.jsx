import './App.css'
import { useState, useEffect, useRef } from 'react'
import { FaInstagram, FaGithub, FaLinkedinIn, FaRegFileAlt } from 'react-icons/fa'
import perspectives from './perspectives.json'
import ChatInterface from './ChatInterface'

const experience = [
  {
    company: 'Microsoft · Azure',
    period: '2022 – Present',
    description: 'Designing across cost management, cloud infrastructure, and Copilot experiences. I began in Cost Management, focused on transparency and predictability, then moved into Azure Core to work closer to foundational infrastructure and agent-assisted workflows. Across both, the work centers on helping customers navigate complex systems where mistakes are costly and often discovered too late.',
    tags: ['Azure Portal', 'Copilot / AI', 'Cloud Infrastructure', 'Enterprise UX', 'Agentic Design'],
    viewWork: null
  },
  {
    company: 'Jungle Scout',
    period: '2020 – 2022',
    description: 'Designed analytics and data visualization for e-commerce sellers, translating dense operational data into actionable insights that supported real business decisions under uncertainty.',
    tags: ['Analytics UX', 'Data Visualization', 'User Research', 'E-commerce', 'B2C SaaS'],
    viewWork: null
  },
  {
    company: 'Visier',
    period: '2018 – 2019',
    description: 'Worked on people analytics, contributing to experiences where data intersected with organizational dynamics, hiring, and performance narratives.\n\nEarly in my career, I made mistakes, learned quickly, and built resilience. Visier allowed me to develop both the judgment and relationships that continue to shape how I design today.',
    tags: ['People Analytics', 'Data Viz', 'Information Architecture', 'B2B SaaS', 'HR Tech'],
    viewWork: null
  },
]

const TooltipLink = ({ href, tooltip, external, linkClass, children }) => (
  <span className="tooltip-link-wrapper">
    {href ? (
      <a
        href={href}
        className={`dotted-link${linkClass ? ` ${linkClass}` : ''}`}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ) : (
      <span className={`dotted-link${linkClass ? ` ${linkClass}` : ''}`}>{children}</span>
    )}
    <span className="tooltip-glass" aria-hidden="true">{tooltip}</span>
  </span>
)

const SocialIcons = () => (
  <div className="social-icons-row">
    <a href="https://instagram.com/granitez" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
    <a href="https://www.linkedin.com/in/grantxyzou" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
    <a href="https://github.com/grantxyzou" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
  </div>
)

const SocialLinks = () => (
  <>
    <div className="social-link">
      <FaInstagram className="social-icon-svg" />
      <a href="https://instagram.com/granitez" target="_blank" rel="noopener noreferrer" className="social-text">@granitez</a>
    </div>
    <div className="social-link">
      <FaLinkedinIn className="social-icon-svg" />
      <a href="https://www.linkedin.com/in/grantxyzou" target="_blank" rel="noopener noreferrer" className="social-text">linkedin.com/in/grantxyzou</a>
    </div>
    <div className="social-link">
      <FaGithub className="social-icon-svg" />
      <a href="https://github.com/grantxyzou" target="_blank" rel="noopener noreferrer" className="social-text">github.com/grantxyzou</a>
    </div>
    <div className="social-link social-link-last social-link-disabled">
      <FaRegFileAlt className="social-icon-svg" />
      <span className="social-text">Resume</span>
    </div>
  </>
)

function TypewriterTag({ text, delay = 0, className }) {
  const [displayed, setDisplayed] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setVisible(false)

    let typeInterval = null
    // Step 1: fade in the tag pill
    const fadeTimer = setTimeout(() => setVisible(true), delay)
    // Step 2: start typing after the fade-in settles (~180ms)
    const typeTimer = setTimeout(() => {
      let i = 0
      typeInterval = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) clearInterval(typeInterval)
      }, 28)
    }, delay + 180)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(typeTimer)
      if (typeInterval) clearInterval(typeInterval)
    }
  }, [text, delay])

  return (
    <span className={`${className} tag-fade-in${visible ? ' tag-visible' : ''}`}>
      <span className="tag-sizer" aria-hidden="true">{text}</span>
      <span className="tag-typer">{displayed}</span>
    </span>
  )
}

function PerspectiveTags({ tags, perspective }) {
  const [shownTags, setShownTags] = useState(tags)
  const [isExiting, setIsExiting] = useState(false)
  const [renderKey, setRenderKey] = useState(0)

  useEffect(() => {
    setIsExiting(true)
    const t = setTimeout(() => {
      setShownTags(tags)
      setIsExiting(false)
      setRenderKey(k => k + 1)
    }, 220)
    return () => clearTimeout(t)
  }, [perspective])

  return (
    <div className={`experience-tags${isExiting ? ' tags-exiting' : ''}`}>
      {!isExiting && shownTags.map((tag, k) => (
        <TypewriterTag
          key={`${renderKey}-${k}`}
          text={tag}
          delay={k * 100}
          className="experience-tag"
        />
      ))}
    </div>
  )
}

export default function App(){
  const [typewriterText, setTypewriterText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isScrolled, setIsScrolled] = useState(false)
  const [perspective, setPerspective] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    const as = params.get('as')
    return ['recruiter', 'collaborator', 'ask'].includes(as) ? as : null
  })
  const footerRef = useRef(null)

  const fullText = "A portfolio of design process, research, and complex systems work."


  // Sync URL param with perspective
  useEffect(() => {
    const url = new URL(window.location)
    if (perspective) {
      url.searchParams.set('as', perspective)
    } else {
      url.searchParams.delete('as')
    }
    window.history.replaceState(null, '', perspective ? url : url.pathname)
  }, [perspective])

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

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      setMousePosition({ x, y })
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)

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

    const fallbackTimer = setTimeout(() => {
      if (!hasAnimated) {
        startTypewriter()
      }
    }, 2000)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
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
        <div
          className="gradient-layer"
          style={{
            transform: `rotate(-58deg) translate(${mousePosition.x * -8}px, ${mousePosition.y * 6}px)`
          }}
        ></div>
      </div>

      {/* Sticky Header */}
      <header className={`header-sticky ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <div className="header-inner">
            <div className="header-left">
              <div>
                <span className="header-name">Grant Zou</span>
              </div>
              <div className="header-title">
                <div className="header-ai">ai</div>
                <div className="header-designer">product designer</div>
              </div>
            </div>
            <div className="header-right">
              <div className="perspectives-toggle" role="group" aria-label="Reading perspective">
                {['recruiter', 'collaborator', 'ask'].map(p => (
                  <button
                    key={p}
                    className={`perspectives-option${perspective === p ? ' active' : ''}`}
                    onClick={() => setPerspective(prev => prev === p ? null : p)}
                    aria-pressed={perspective === p}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="responsive-container">

        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-bio">
            <div className="bio-text">
              Grant <TooltipLink tooltip="coming soon">remixes music</TooltipLink>, <TooltipLink tooltip="coming soon">experiments with new technologies</TooltipLink>, and keeps rhythm in life through <TooltipLink href="/bpm" tooltip="BPM ↗" external linkClass="dotted-link-court">badminton</TooltipLink> and running. He sees design as storytelling: blending experience and connection, whether in beats, interfaces, or shared moments.
            </div>
          </div>
          <SocialLinks />
        </div>

        {/* Main Content */}
        <div className="main-container">
          <div className="content">
            {/* About Section */}
            <div className="section about-section">
              <div className="section-content">
                <div
                  key={perspective}
                  className={`about-text${perspective && perspective !== 'ask' ? ' perspective-fade' : ''}`}
                >
                  {perspective && perspective !== 'ask'
                    ? perspectives[perspective].intro
                    : 'An evolving, exploratory design portfolio where I\'m learning Azure infrastructure and AI hands-on, while experimenting with AI features as new ways to tell product stories.'
                  }
                </div>
              </div>
            </div>

            {/* Experience Section */}
            <div className="section experience-section">
              <div className="section-title">Work experience</div>
              <div className="experience-list">
                {experience.map((exp, i) => (
                  <div key={i} className={`experience-item ${i > 0 ? 'experience-border' : ''}`}>
                    <div className="experience-content">
                      <div className="experience-header">
                        <span className="experience-company">{exp.company}</span>
                        <span className="experience-period"> ({exp.period})</span>
                      </div>
                      {exp.role && (
                        <div className="experience-role">{exp.role}</div>
                      )}
                      {exp.description && (
                        <div className="experience-description">{exp.description}</div>
                      )}
                      {exp.bullets && (
                        <div className="experience-bullets">
                          {exp.bullets.map((bullet, j) => (
                            <div key={j} className="experience-bullet">→ {bullet}</div>
                          ))}
                        </div>
                      )}
                      {exp.location && (
                        <div className="experience-location">{exp.location}</div>
                      )}
                      {(() => {
                        const activeTags = perspective && perspective !== 'ask'
                          ? perspectives[perspective].workTags[exp.company]
                          : exp.tags
                        return activeTags && (
                          <PerspectiveTags
                            tags={activeTags}
                            perspective={perspective}
                          />
                        )
                      })()}
                      {exp.viewWork && (
                        <a href={exp.viewWork} className="experience-view-work">→ View work</a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat — shown when "ask" perspective is active */}
            {perspective === 'ask' && <ChatInterface />}

            {/* Footer */}
            <div className="footer" ref={footerRef}>
              <div className="footer-content">
                <div className="footer-text typewriter">
                  {typewriterText || fullText}
                  {typewriterText && <span className={`cursor ${isTyping ? 'blinking' : 'steady'}`}>|</span>}
                </div>
                <SocialIcons />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
