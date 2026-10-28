import { useState, useEffect } from 'react'
import CaseStudy from './CaseStudy'
import { caseStudies } from './caseStudies'
import { STORY_URL } from './config'

// Questions the rail offers per case study; each rewrites the whole story.
const SUGGESTED = {
  'azure-storage-mover-s3': [
    'Why make validation opt-in instead of automatic?',
    'What could the system honestly verify?',
    'How did you avoid false completion?',
    'Why not redesign the whole flow?',
  ],
  bpm: [
    'How do you build it without writing code?',
    'Why did you remove attendance streaks?',
    'What did the kudos feedback teach you?',
    'How did you go from one club to many?',
  ],
  'advertising-analytics': [
    'How did research shape the design?',
    'Why push back on a solution-first brief?',
    'How did you make the data actionable?',
    'How did you bring stakeholders along?',
  ],
}

// A story written for the visitor's question from one case study, in the main
// pane, with a rail to ask another. It shows only what is true at each moment:
// while waiting it says so and counts the real seconds; once the answer is in,
// it says who wrote it — the model, from the case study alone, or (when the
// model is unavailable) nobody new: the case study itself. Every block links
// to the section it came from. Reuses CaseStudy as the block renderer.
export default function StoryCanvas({ slug, question: initialQuestion, onBack, onNavigate }) {
  const cs = caseStudies[slug]
  const firstQuestion = initialQuestion || SUGGESTED[slug]?.[0] || 'Why did you design it this way?'
  const [question, setQuestion] = useState(firstQuestion)
  const [status, setStatus] = useState('writing') // writing | ready | error
  const [story, setStory] = useState(null)
  const [error, setError] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const [input, setInput] = useState('')
  const [railOpen, setRailOpen] = useState(false) // phone only: the rail starts folded

  const write = async (q) => {
    setQuestion(q)
    setStatus('writing')
    setStory(null)
    setError('')
    setRailOpen(false)
    // Keep the address shareable: it names the question being answered.
    const url = new URL(window.location)
    url.searchParams.set('q', q)
    window.history.replaceState(null, '', url)
    try {
      const res = await fetch(STORY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: slug, question: q })
      })
      const data = await res.json()
      if (res.ok && data.success && data.sections?.length) {
        setStory(data)
        setStatus('ready')
      } else {
        setError(data.error || 'The story could not be written.')
        setStatus('error')
      }
    } catch {
      setError('The story service could not be reached.')
      setStatus('error')
    }
  }

  useEffect(() => { write(firstQuestion) }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  // Real elapsed time while waiting — the only progress there is to report.
  useEffect(() => {
    if (status !== 'writing') return
    setElapsed(0)
    const t = setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [status, question])

  const submit = (e) => {
    e.preventDefault()
    const q = input.trim()
    if (!q) return
    setInput('')
    write(q)
  }

  const fromAI = story?.mode === 'ai'
  const notice = story && (
    <p className={`story-notice${fromAI ? '' : ' story-notice-fallback'}`}>
      {fromAI
        ? `Written just now by gpt-4o-mini, using only the ${cs.navLabel} case study. Each part links to the section it came from; the model can still get things wrong.`
        : `Live writing isn’t available right now, so this is the ${cs.navLabel} case study as Grant wrote it, section by section.`}
      {fromAI && story.dropped > 0 && ` ${story.dropped} part${story.dropped > 1 ? 's were' : ' was'} left out for not citing a section.`}
    </p>
  )

  const railStatus = status === 'writing'
    ? 'Writing…'
    : status === 'error'
      ? 'Not available'
      : fromAI ? 'Written by gpt-4o-mini from the case study' : 'Showing the case study'

  return (
    <div className="story-view">
      <div className="bg-aurora mood-tide" aria-hidden="true" />

      <div className="story-main">
        {status === 'writing' && (
          <div className="story-writing" role="status" aria-live="polite">
            <div className="story-writing-label">Writing a story from the {cs.navLabel} case study</div>
            <p className="story-writing-q">“{question}”</p>
            <div className="story-writing-wait">
              <span className="story-dot" aria-hidden="true" />
              Waiting for the answer · {elapsed}s
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="story-writing" role="alert">
            <div className="story-writing-label">{error}</div>
            <button className="story-rail-exit" onClick={() => onNavigate?.(`/work/${slug}`)}>
              Read the {cs.navLabel} case study instead →
            </button>
          </div>
        )}

        {status === 'ready' && (
          <CaseStudy
            key={`${story.mode}:${question}`}
            data={{ slug: `${slug}?${question}`, title: story.title, accent: 'azure', notice, sections: story.sections }}
            onBack={onBack}
            onCite={onNavigate}
          />
        )}
      </div>

      <aside className={`story-rail${railOpen ? ' open' : ''}`} aria-label="Ask the story">
        <button
          type="button"
          className="story-rail-toggle"
          aria-expanded={railOpen}
          onClick={() => setRailOpen((o) => !o)}
        >
          <span>Ask the story</span>
          <span className="story-rail-toggle-icon" aria-hidden="true">{railOpen ? '▾' : '▴'}</span>
        </button>

        <div className="story-rail-body">
          <div className="story-rail-head">
            <div className="story-rail-title">Ask the story</div>
            <div className="story-rail-sub">{railStatus}</div>
          </div>

          <div className="story-rail-current">
            {status === 'ready' && !fromAI ? 'You asked' : 'Answering'}: <em>{question}</em>
          </div>

          <div className="story-rail-prompts">
            {(SUGGESTED[slug] || []).map((p) => (
              <button key={p} className="story-rail-chip" onClick={() => write(p)} disabled={status === 'writing'}>{p}</button>
            ))}
          </div>

          <form className="story-rail-input" onSubmit={submit}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask about ${cs.navLabel}…`}
              disabled={status === 'writing'}
              aria-label={`Ask a question about ${cs.navLabel}`}
            />
            <button type="submit" aria-label="Write the story" disabled={status === 'writing' || !input.trim()}>→</button>
          </form>

          <button className="story-rail-exit" onClick={() => onNavigate?.(`/work/${slug}`)}>
            Read the full case study →
          </button>
        </div>
      </aside>
    </div>
  )
}
