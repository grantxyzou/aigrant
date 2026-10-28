import './CaseStudy.css'
import { useEffect, useState } from 'react'
import { BPM_STATS_URL } from './config'

// Presentational case-study page. Framework-portable (no Vite/Next specifics),
// so it survives the eventual Next.js migration — only the routing shim changes.
//
// Props:
//   data   — one entry from caseStudies.js
//   onBack — optional handler for the "← Back" link (SPA nav). Falls back to href="/".

// Live totals from BPM, through the site's own /api/bpm-stats. It renders
// only when real numbers arrive: while loading, or if BPM can't be read, the
// page keeps the dated figures already written in the prose and shows nothing
// here — no placeholder zeros.
function BpmLiveStats() {
  const [stats, setStats] = useState(null)
  useEffect(() => {
    let live = true
    fetch(BPM_STATS_URL, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (live && data?.success) setStats(data.stats) })
      .catch(() => {})
    return () => { live = false }
  }, [])
  if (!stats) return null
  const tiles = [
    [stats.rosterSize, 'members on the roster'],
    [stats.playedLast4Sessions, 'played in the last 4 sessions'],
    [stats.openedLast28Days, 'opened the app in the last 28 days'],
  ].filter(([n]) => typeof n === 'number')
  const asOf = stats.asOf ? new Date(stats.asOf).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : null
  return (
    <aside className="cs-live" aria-label="Live numbers from BPM">
      <div className="cs-live-label"><span className="cs-live-dot" aria-hidden="true" />Live from BPM{asOf ? ` · ${asOf}` : ''}</div>
      <div className="cs-live-row">
        {tiles.map(([n, label]) => (
          <div key={label} className="cs-live-tile">
            <div className="cs-live-num">{n}</div>
            <div className="cs-live-text">{label}</div>
          </div>
        ))}
      </div>
    </aside>
  )
}

function Section({ block }) {
  if (block.liveStats === 'bpm') return <BpmLiveStats />

  if (block.callout) {
    return (
      <aside className="cs-callout" id={block.id}>
        <div className="cs-callout-label">{block.callout.label}</div>
        {block.callout.body.map((p, i) => (
          <p key={i} className="cs-callout-body">{p}</p>
        ))}
      </aside>
    )
  }

  if (block.figure && block.images) {
    return (
      <figure className="cs-figure-shots">
        <div className="cs-shots-row">
          {block.images.map((img) => (
            <img key={img.src} src={img.src} alt={img.alt} className="cs-shot" loading="lazy" />
          ))}
        </div>
        <figcaption className="cs-figure-caption">{block.figure}</figcaption>
      </figure>
    )
  }

  if (block.figure) {
    return (
      <figure className="cs-figure" aria-label={block.figure}>
        <span className="cs-figure-caption">{block.figure}</span>
      </figure>
    )
  }

  return (
    <section className="cs-section" id={block.id}>
      {block.heading && <h2 className="cs-heading">{block.heading}</h2>}
      {block.body && block.body.map((p, i) => (
        <p key={i} className="cs-body">{p}</p>
      ))}
      {block.list && (
        <ul className="cs-list">
          {block.list.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      )}
    </section>
  )
}

export default function CaseStudy({ data, onBack }) {
  // Restore scroll to top when a case study opens.
  // Open at the top, or at the section a link named (/work/<slug>#<id>):
  // the Ask chat's citations point at sections.
  useEffect(() => {
    const target = window.location.hash && document.getElementById(window.location.hash.slice(1))
    if (target) target.scrollIntoView({ block: 'start' })
    else window.scrollTo(0, 0)
  }, [data?.slug])

  if (!data) return null

  const handleBack = (e) => {
    if (onBack) { e.preventDefault(); onBack() }
  }

  return (
    <div className={`cs-page cs-accent-${data.accent || 'gold'}`}>
      <div className="cs-container">
        <a href="/" className="cs-back" onClick={handleBack}>← Back</a>

        <header className="cs-hero">
          <h1 className="cs-title">{data.title}</h1>
          {data.subtitle && <p className="cs-subtitle">{data.subtitle}</p>}
          {data.summary && <p className="cs-summary">{data.summary}</p>}

          {data.meta && (
            <dl className="cs-meta">
              {data.meta.map((m, i) => (
                <div key={i} className="cs-meta-row">
                  <dt>{m.label}</dt>
                  <dd>{m.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {data.tags && (
            <div className="cs-tags">
              {data.tags.map((t, i) => <span key={i} className="cs-tag">{t}</span>)}
            </div>
          )}
        </header>

        <div className="cs-body-blocks">
          {data.sections.map((block, i) => <Section key={i} block={block} />)}
        </div>

        <a href="/" className="cs-back cs-back-bottom" onClick={handleBack}>← Back to portfolio</a>
      </div>
    </div>
  )
}
