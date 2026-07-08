import { useState, useEffect, useRef } from 'react'
import CaseStudy from './CaseStudy'
import { STORY_URL } from './config'

// Side-rail prompts that re-steer the whole canvas (each recomposes the story).
const SUGGESTED = [
  'Why make validation opt-in instead of automatic?',
  'What could the system honestly verify?',
  'How did you avoid false completion?',
  'Why not redesign the whole flow?'
]

// Surfaced "thought process" while composing — reflects the real steps the
// composer takes (read the grounded source → focus the question → find the
// decision → sequence the arc). Shown as a ticking log during generation.
const THOUGHTS = [
  'Reading the Storage Mover source material',
  'Focusing on your question',
  'Finding the decision that matters',
  'Sequencing the story arc',
  'Composing the blocks'
]

// A dedicated experience: the AI composes a focused, grounded deep-dive in the
// main pane (revealed block-by-block so it feels built live) while the side rail
// lets the visitor re-steer the story. Reuses CaseStudy as the block renderer.
export default function StoryCanvas({ slug, question: initialQuestion, onBack, onNavigate }) {
  const [title, setTitle] = useState('')
  const [sections, setSections] = useState([])
  const [revealCount, setRevealCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [question, setQuestion] = useState(initialQuestion || 'Why honest validation?')
  const [input, setInput] = useState('')
  const [thoughtN, setThoughtN] = useState(0)
  const revealTimer = useRef(null)
  const thoughtTimer = useRef(null)

  const compose = async (q) => {
    setLoading(true)
    setSections([])
    setRevealCount(0)
    setThoughtN(0)
    setQuestion(q)
    try {
      const res = await fetch(STORY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: slug, question: q })
      })
      const data = await res.json()
      if (data.success && Array.isArray(data.sections) && data.sections.length) {
        setTitle(data.title || 'Deep dive')
        setSections(data.sections)
      } else {
        setTitle('Deep dive')
        setSections([{ body: [data.error || "I couldn't compose that one — try one of the prompts."] }])
      }
    } catch {
      setTitle('Deep dive')
      setSections([{ body: ['The composer is unavailable right now — please try again shortly.'] }])
    } finally {
      setLoading(false)
    }
  }

  // Compose on first mount.
  useEffect(() => { compose(question) }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  // Staged reveal: grow the visible block count over time so it assembles live.
  useEffect(() => {
    clearInterval(revealTimer.current)
    if (!sections.length) return
    setRevealCount(1)
    revealTimer.current = setInterval(() => {
      setRevealCount(c => {
        if (c >= sections.length) { clearInterval(revealTimer.current); return c }
        return c + 1
      })
    }, 650)
    return () => clearInterval(revealTimer.current)
  }, [sections])

  // Surface a "thought process" while the composer works (ticks through the steps).
  useEffect(() => {
    clearInterval(thoughtTimer.current)
    if (!loading) return
    thoughtTimer.current = setInterval(() => {
      setThoughtN(n => (n < THOUGHTS.length - 1 ? n + 1 : n))
    }, 900)
    return () => clearInterval(thoughtTimer.current)
  }, [loading])

  const submit = (e) => {
    e?.preventDefault()
    const q = input.trim()
    if (!q) return
    setInput('')
    compose(q)
  }

  const revealed = sections.slice(0, revealCount)
  const composing = loading || (sections.length > 0 && revealCount < sections.length)

  return (
    <div className="story-view">
      <div className="bg-aurora mood-tide" aria-hidden="true" />

      <div className="story-main">
        {sections.length === 0 ? (
          <div className="story-thinking" aria-live="polite">
            <div className="story-thinking-label">Composing the story</div>
            {THOUGHTS.slice(0, thoughtN + 1).map((t, i) => (
              <div key={i} className={`story-thought${i === thoughtN ? ' active' : ' done'}`}>
                <span className="story-thought-mark">
                  {i < thoughtN ? '✓' : <span className="story-dot" />}
                </span>
                <span>{t}{i === thoughtN ? '…' : ''}</span>
              </div>
            ))}
          </div>
        ) : (
          <>
            <CaseStudy key={title} data={{ title, accent: 'azure', sections: revealed }} onBack={onBack} />
            {composing && <div className="story-composing-inline"><span className="story-dot" /> composing…</div>}
          </>
        )}
      </div>

      <aside className="story-rail">
        <div className="story-rail-head">
          <div className="story-rail-title">Ask the story</div>
          <div className="story-rail-sub">composed live by gpt-4o-mini · content may be incorrect</div>
        </div>

        <div className="story-rail-current">Now showing: <em>{question}</em></div>

        <div className="story-rail-prompts">
          {SUGGESTED.map((p, i) => (
            <button key={i} className="story-rail-chip" onClick={() => compose(p)} disabled={loading}>{p}</button>
          ))}
        </div>

        <form className="story-rail-input" onSubmit={submit}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this project…"
            disabled={loading}
          />
          <button type="submit" aria-label="Compose" disabled={loading || !input.trim()}>→</button>
        </form>

        <button className="story-rail-exit" onClick={() => onNavigate?.(`/work/${slug}`)}>
          Read the full case study →
        </button>
      </aside>
    </div>
  )
}
