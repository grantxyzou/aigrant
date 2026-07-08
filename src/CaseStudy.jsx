import './CaseStudy.css'
import { useEffect } from 'react'

// Presentational case-study page. Framework-portable (no Vite/Next specifics),
// so it survives the eventual Next.js migration — only the routing shim changes.
//
// Props:
//   data   — one entry from caseStudies.js
//   onBack — optional handler for the "← Back" link (SPA nav). Falls back to href="/".

function Section({ block }) {
  if (block.callout) {
    return (
      <aside className="cs-callout">
        <div className="cs-callout-label">{block.callout.label}</div>
        {block.callout.body.map((p, i) => (
          <p key={i} className="cs-callout-body">{p}</p>
        ))}
      </aside>
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
    <section className="cs-section">
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
  useEffect(() => { window.scrollTo(0, 0) }, [data?.slug])

  if (!data) return null

  const handleBack = (e) => {
    if (onBack) { e.preventDefault(); onBack() }
  }

  return (
    <div className="cs-page">
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
