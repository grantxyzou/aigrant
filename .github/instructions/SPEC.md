# grantzou.com — Redesign Specification
> v2.0 · March 2026 · Based on live site audit

---

## Who you are
**Grant Zou** · AI product designer at Microsoft Azure (2022–Present)  
Previously: Jungle Scout (2020–2022), Visier (2018–2019)  
Site: [grantzou.com](https://grantzou.com)  
Goals: Land new roles · Attract freelance clients · Showcase personal projects

---

## 00 · Site Audit

### What's working
- `"ai product designer"` title — the lowercase "ai" prefix is a smart differentiator
- Dark gradient aesthetic is coherent and on-brand — don't abandon it, evolve it
- Personal bio voice ("remixes music, keeps rhythm in life") — memorable, protect it
- Work history arc (Azure → Jungle Scout → Visier) is compelling and well-written

### What needs work
- **Chat bar** ("Ask anything about Grant...") — creates friction, visitors don't know what to ask, buried below fold
- **AI toggle disclaimer** ("AI-generated content are being refined and improved") — reads as a warning, undermines the feature
- **No case studies linked** — work experience reads like a résumé, dead-ends at prose
- **Left column feels detached** — bio gets orphaned as right column scrolls

### Element status

| Element | Action |
|---|---|
| "ai product designer" title | ✅ Keep |
| Dark gradient aesthetic | ✅ Keep & refine |
| Personal bio | ✅ Keep — fix layout detachment |
| Work experience section | 🔄 Add skill tags + case study links |
| AI toggle ("Flip to AI version") | 🔄 Reframe as "Perspectives" |
| Chat bar "Ask anything about Grant" | ❌ Remove |
| Case studies / project pages | 🆕 Build |
| Resume link in nav | 🆕 Add |

---

## 01 · AI Feature Overhaul ⭐ Priority #1

### The problem
Two competing AI features (toggle + chat bar), both requiring effort from the visitor. The toggle's disclaimer signals incompleteness. The chat bar is invisible until scrolled to and offers no prompting.

### Specific issues
1. **Toggle disclaimer** — "AI-generated content are being refined and improved" is a liability statement on your own feature
2. **Chat is below the fold** — most visitors never find it
3. **Blank input** — "Ask anything" with no suggestions causes visitors to stall
4. **Two systems = confused mental model** — visitors can't tell what the toggle vs. chat does

---

### Recommended approach: "Perspectives" toggle (Option A)

**Concept:** Reframe the existing toggle from "AI on/off" to a 3-way segmented control:  
`Reading as: Recruiter · Collaborator · Client`

- On select: work entries surface relevant skill tags, hero copy adjusts emphasis
- No chat input. No disclaimer. The AI is doing the contextualizing, not the visitor.
- Feels like a lens, not a mode switch

**Why this works:** It keeps your existing toggle concept but reframes it as a confident feature — and it directly demonstrates what an "AI product designer" uniquely brings to a portfolio.

#### Implementation spec

| Concern | Spec |
|---|---|
| Toggle UI | Pill-style segmented control, top-right. 3 options. Selected: filled + subtle glow. Font: monospace small caps. |
| State | `useState` or URL param `?as=recruiter` (preferred — enables shareable links) |
| Content source | Phase 1: static JSON config mapping audience → {tags, tagline variant}. Phase 2: Claude API call. |
| Transition | 150ms crossfade on content swap. No layout shift — same structure, text/tags update in place. |
| First-time hint | Subtle pulse animation once after 2s on first visit (localStorage flag). Never repeats. |
| Remove | Chat input bar. Toggle disclaimer text. |
| New framing copy | "Reading as: Recruiter" — present tense, active |

#### Build phases

| Phase | Approach | Effort |
|---|---|---|
| Phase 1 — Ship now | Static JSON config. No API calls. Instant. Validate UX first. | Low |
| Phase 2 — Add Claude | `/api/perspectives?as=recruiter` → Claude generates 2-sentence contextual summary. Cache per session. | Medium |
| Phase 3 — Personalize | `?as=recruiter&company=stripe` → Claude personalizes framing per company. | High / Fun |

---

### Alternative: Inline AI highlights per work entry (Option B)
For each work block, an AI-generated "What this demonstrates" tag strip — surfaces skills and methods as scannable chips. No interaction required. Lower effort, good quick win.

### Alternative: Prompted questions instead of blank chat (Option C)
Replace empty input with 3–4 tappable pre-written prompts. Each returns a clean prose answer — no conversation, no typing. Good if you want to keep some conversational element.

---

## 02 · Layout & Visual Design

### Principle
The dark aesthetic and typographic foundation are right. Changes are structural — fix left column scroll detachment, add hierarchy to work entries, connect experience to case study pages.

### What to fix

| Issue | Fix |
|---|---|
| Left column detaches on scroll | Either make it a purposeful fixed card, or let it scroll and add sticky section labels instead |
| Work entries dead-end | Add `→ View work` CTA link at end of each work block |
| No skill signals | Add 3–5 method/skill tags below each work description |
| Section label spacing | Increase top padding on "Work experience" and other section headers |
| Dark mode toggle placement | Move to nav — top-right is now owned by Perspectives toggle |

### Revised homepage structure

```
NAV — wordmark left · Work · About · Resume · [dark toggle] right · [Perspectives toggle]

┌─────────────────────┬──────────────────────────────────────────┐
│ LEFT (fixed)        │ RIGHT (scrolls)                          │
│                     │                                          │
│ Grant Zou           │ Intro blurb (keep current)               │
│ ai product designer │ ──────────────────────────────────────── │
│                     │ WORK EXPERIENCE                          │
│ [bio — keep]        │ · Microsoft Azure → [tags] → View work → │
│                     │ · Jungle Scout    → [tags] → View work → │
│ @granitez           │ · Visier          → [tags] → View work → │
│ LinkedIn            │ ──────────────────────────────────────── │
│ GitHub              │ SELECTED PROJECTS (case study cards)     │
│                     │                                          │
│ [availability]      │ [Perspectives toggle output goes here]   │
└─────────────────────┴──────────────────────────────────────────┘
```

### Color — keep the dark palette

| Token | Value | Role |
|---|---|---|
| `--bg` | `#111010` | Base background |
| `--bg-card` | `#1a1918` | Card surfaces |
| `--ink` | `#e8e4dc` | Primary text |
| `--accent` | `#e8724a` | Interactive / Perspectives toggle |
| `--accent2` | `#5b8fff` | Links / tags |

### Typography — minor tuning
- Name display: tighten letter-spacing, bump weight to 600
- `"ai product designer"`: keep lowercase + muted — it's doing the work
- Body: increase line-height to 1.75
- Muted text: needs +15% contrast for WCAG AA compliance
- Tags: DM Mono, 11px, dark pill with subtle border

---

## 03 · Content & Copy

### What to add per work entry
- **3–5 skill/method tags** — these become the signal the Perspectives toggle surfaces
  - Azure: `Systems design` `Agent UX` `Cost transparency` `Copilot` `Infrastructure`
  - Jungle Scout: `Data visualization` `Analytics UX` `E-commerce`
  - Visier: `People analytics` `Data storytelling` `Enterprise UX`
- **`→ View work` link** — even if case study isn't built yet, use a coming-soon state

### AI toggle copy — before & after

| | Copy |
|---|---|
| ❌ Current | "AI-generated content are being refined and improved" |
| ✅ Proposed | "Reading as: Recruiter" / "Reading as: Collaborator" / "Reading as: Client" |

### Case study structure (when building them)
1. **Context & Problem** — 1 paragraph. Lead with user/business problem, not technology.
2. **My Role & Constraints** — team size, what you owned, timeline. Use "I" clearly.
3. **Research & Discovery** — methods, key insights. Highlight AI-assisted workflow where relevant.
4. **Design Decisions** — what options existed, why you chose this path.
5. **Outcome** — quantitative if possible, qualitative if not. Closing reflection sentence.

### Content gaps to fill

| Missing piece | Where | Priority |
|---|---|---|
| Skill tags per work entry | Below each work description | Must have |
| At least 1 Azure case study | `/work/azure-*` | Must have |
| `→ View work` links | End of each work block | Must have |
| Resume link | Nav | Should have |
| Availability signal | Left column | Should have |
| 2nd + 3rd case studies | `/work/jungle-scout`, `/work/visier` | Nice to have |

---

## 04 · Interactions & Animations

### Principle
The site already has appropriate restraint. Don't add animation for its own sake. The Perspectives toggle is the one interaction that should be impeccably polished — everything else is supporting cast.

### Perspectives toggle — interaction detail (as implemented)
- **Selection:** 200ms CSS transition on color + background. Active pill: gold (#c9a84c) fill. Unselected: opacity 0.45.
- **Intro text swap:** 300ms clean crossfade (opacity only — no translation, no glow).
- **Tag swap sequence:** Tags fade out (200ms) → 240ms wait → new tag pills fade in at full width (200ms, 120ms stagger) → text types in at 48ms/char starting 200ms after pill appears.
- **Tag width:** Ghost text (transparent) holds bounding box at full width. Typewriter overlays absolutely — pill never resizes.
- **URL param:** `?as=recruiter` — synced bidirectionally, enables shareable pre-filtered links.
- **Toggle off:** Clicking active pill deactivates (returns to default content).
- **First-time hint:** Not yet implemented.

### Other interactions

| Interaction | Spec | Priority |
|---|---|---|
| Work entry hover | Subtle left border accent, 150ms ease | Do |
| Social link hover | Handle slides right 2px + opacity 1, 150ms | Do |
| `→ View work` hover | Arrow translates +3px, underline slides in | Do |
| Page entrance | Stagger: name (0ms) → title (60ms) → bio (120ms) → work (200ms) | Do |
| Scroll-triggered entries | IntersectionObserver fade+slide, once per load | Optional |
| Custom cursor | Small dot, enlarges on interactive elements | Optional |

---

## 05 · Tech Stack

### Biggest issue
Current SPA renders blank HTML to crawlers. `grantzou.com` is not indexed. For a job search portfolio this matters — recruiters Google you. Fix: migrate to Next.js with static generation.

### Recommended stack

| Layer | Tool | Why |
|---|---|---|
| Framework | Next.js 14+ | SSG per page, App Router, React-compatible |
| Styling | Tailwind CSS + CSS vars | Matches dark token-based theme |
| Animations | Framer Motion | Layout animations for Perspectives toggle |
| AI feature | Anthropic API (`claude-sonnet-4-6`) | Perspectives copy generation, server-side only |
| Hosting | Vercel | Zero-config Next.js, free tier, fast CDN |
| Analytics | Fathom or Plausible | Privacy-first, GDPR compliant |

### Technical fixes needed
- **SEO:** Add `title`, `description`, `og:image` meta per page. Use `generateMetadata` in Next.js for dynamic case study pages.
- **API key security:** Anthropic key must be server-side only — use Next.js Route Handlers, never client JS.
- **Images:** Use `next/image` for automatic WebP, lazy loading, responsive srcsets.
- **Accessibility:** Check muted text contrast — target 4.5:1 minimum (WCAG AA).

---

## 06 · Launch Checklist

### 🔥 Quick wins
- [x] Remove chat bar placeholder ("Ask anything about Grant...") — updated to neutral text
- [x] Remove / replace disclaimer text on toggle — removed entirely
- [x] Add skill tags to each work entry (Azure, Jungle Scout, Visier) — mustard yellow pills
- [x] Add `→ View work` placeholder hooks to each work block — renders when `viewWork` URL is set
- [x] Add Resume link — moved to sidebar below GitHub, disabled with doc icon
- [x] Dotted tooltip links in bio — badminton (→ /bpm), music, AI explorations ("coming soon")
- [x] Fix AI training data — few-shot examples wired, sanitized, model default corrected
- [x] Patch npm vulnerabilities — 6 high/moderate fixed (March 2026)

### 🤖 AI Feature (Perspectives toggle) — Priority #1
- [x] Redesign toggle as segmented control — `recruiter · collaborator · ask` (client replaced with ask/chat)
- [x] Build static Perspectives config (`src/perspectives.json` — audience → tags + intro variant)
- [x] Add `?as=` URL param persistence
- [x] `ask` tab mounts ChatInterface; other tabs swap content with crossfade
- [x] Intro text: clean 300ms crossfade on perspective switch
- [x] Tags: fade out → pill fades in at full width → typewriter reveals text (48ms/char, 120ms stagger)
- [x] Toggle active color matches tag gold (#c9a84c)
- [ ] [Phase 2] Add Claude API route handler for dynamic copy

### 🔧 API & Backend — Priority #1.5
- [ ] **Wire `content/training/` into `api/training.js`** — 4 JSON files (design expertise, conversations, personality traits, response templates) exist but are never imported; AI is missing this context
- [ ] **Consolidate training context in `ask.js`** — bio/context is hardcoded inline in the function instead of pulling from `api/training.js`; the two can drift out of sync
- [ ] **Wire Resume link** — currently a disabled placeholder with no href
- [ ] Remove dead documentation from `content/training/README.md` — promises Azure AI Search integration that doesn't exist
- [ ] Fill `content/faq.json` and `content/testimonials.json` or delete them
- [ ] Fix ChatInterface fallback message — doesn't match the function's fallback responses (low priority)

### ✍️ Content — Priority #2
- [ ] Write at least 1 Azure case study at `/work/azure-*`
- [ ] Jungle Scout case study at `/work/jungle-scout`
- [ ] Visier case study at `/work/visier`
- [x] Confirm intro blurb is still current and accurate
- [ ] Add availability signal to left column

### 🔍 SEO & Performance — Priority #3
- [ ] Migrate to Next.js 14+ (SSG) — site currently invisible to Google crawlers
- [ ] Deploy to Vercel (zero-config Next.js hosting)
- [ ] Add meta title + description to homepage
- [ ] Add `og:image` for social sharing
- [ ] Add `sitemap.xml` and `robots.txt`
- [ ] Run Lighthouse — target 90+ Performance & Accessibility

### ♿ Accessibility
- [ ] Check muted text contrast (target 4.5:1 WCAG AA)
- [ ] Ensure Perspectives toggle is keyboard navigable (arrow keys + Enter)
- [ ] Alt text on all images

### 🚀 Polish
- [ ] Add page entrance stagger animation (name 0ms → title 60ms → bio 120ms → work 200ms)
- [ ] Work entry hover — subtle left border accent, 150ms ease
- [ ] `→ View work` hover — arrow translates +3px
