---
applyTo: '**'
---
aigrant is Grant's AI-powered design portfolio + personal agent.

It showcases his design career through a conversational, AI-driven experience, while laying the foundation for a lightweight personal planner.

## Current Stack

**Frontend:** React + Vite, hosted as Azure Static Web App
**Backend:** Azure Functions v4 (Node.js) at `/api/src/functions/ask.js`
**LLM:** Azure OpenAI (gpt-4o-mini deployment)
**Secret Access:** URL hash `#chat-grant2026` enables chat interface

## File Structure

```
aigrant/
├── .github/
│   ├── instructions/
│   │   └── projectcontext.instructions.md
│   └── workflows/
├── api/
│   ├── src/
│   │   └── functions/
│   │       └── ask.js            # Azure Function v4 for AI interactions
│   ├── host.json
│   ├── local.settings.json       # Local env (gitignored)
│   └── package.json
├── content/
│   ├── training/                 # AI training data
│   │   ├── README.md
│   │   ├── conversations/
│   │   │   └── portfolio-discussions.json
│   │   ├── behaviors/
│   │   │   └── personality-traits.json
│   │   ├── knowledge/
│   │   │   └── design-expertise.json
│   │   └── templates/
│   │       └── response-templates.json
│   ├── faq.json
│   ├── profile.json              # Grant's profile data
│   └── testimonials.json
├── src/
│   ├── App.jsx                   # Main app with dynamic intro blurb
│   ├── App.css                   # All styles including chat UI
│   ├── ChatInterface.jsx         # Chat overlay component
│   └── main.jsx
├── staticwebapp.config.json      # SPA routing config
├── package.json
├── vite.config.js
└── index.html
```

## Environment Variables (Azure Portal > Static Web Apps > Configuration)

```
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini
```

## Key Features Built

### Chat Interface (`/src/ChatInterface.jsx`)
- Fixed bottom input bar with shimmer border animation
- Slide-up overlay for conversation
- Prompt suggestions popup (menu icon with sparkle)
- Markdown formatting for AI responses (paragraphs, lists, bold)
- Auto-scroll and body scroll lock when overlay open
- Typing indicator while loading
- GPT disclaimer in header

### Dynamic Intro Blurb (`/src/App.jsx`)
- AI generates fresh, playful one-liner on page load
- Typewriter animation with organic timing (30-80ms random delays)
- Blinking cursor effect
- Session-cached to avoid repeated API calls

### API (`/api/src/functions/ask.js`)
- Azure Functions v4 programming model
- Handles both chat questions and intro blurb requests
- System prompt with Grant's personality, guardrails, response format
- Training context with accurate profile info
- Fallback responses if Azure OpenAI unavailable

### Training Data Structure
- `conversations/` - Q&A pairs from real projects
- `behaviors/` - Voice, values, traits, signature phrases
- `templates/` - Response ordering rules (project_explanation, reflection)
- `profile.json` - Complete profile with experience, skills, interests

## Content Input Formats

### Conversation Entry
```json
{
  "id": "conv-001",
  "topic": "Project Overview",
  "context": "cloud-infrastructure",
  "messages": [
    { "role": "user", "content": "Tell me about a recent project" },
    { "role": "assistant", "content": "I led design exploration for Azure Storage Mover..." }
  ],
  "keywords": ["Azure", "migration", "agentic UX"],
  "learning_notes": "Highlight infrastructure experience"
}
```

### Behaviors (`personality-traits.json`)
```json
{
  "voice": { "tone": "warm, thoughtful, quietly confident", "communication_style": "clear, structured, human" },
  "values": ["user-first decision making", "systems thinking", "empathy without losing rigor"],
  "traits": ["collaborative", "detail-oriented", "comfortable with complexity"],
  "signature_phrases": ["reduce false completion", "make the system legible", "designing for the moment before failure"]
}
```

## Architecture

```
Browser (React) 
  ↓
/api/ask (Azure Function v4)
  ↓
Azure OpenAI (gpt-4o-mini)
  ↓
Response → Markdown formatting → Render in UI
```

## Development Commands

```bash
# Frontend dev
npm run dev

# API local testing (requires Azure Functions Core Tools)
cd api && func start

# Deploy (auto via GitHub Actions on push to main)
git push origin main
```

---

## Development Log

### February 8, 2026 (Session 6)

**Layout Restructure:**
- Moved sidebar outside `main-container` as sibling in `responsive-container`
- Structure: `responsive-container` → `sidebar` + `main-container`
- Sidebar now truly independent, fixed at bottom-left
- Header constrained to max-width 1212px to align with content area

**Sidebar Behavior (Updated):**
- **>1280px**: `position: fixed`, `left: calc((100vw - 1212px) / 2)`, `bottom: 0`, `width: 368px`, `padding-bottom: 140px`
- **769-1280px**: `position: fixed`, `left: var(--page-padding)`, `bottom: 0`, `width: 280px`
- **≤768px**: Full-width bottom bar with social icons only (bio hidden)

**Footer Update:**
- Changed text to "Flip the toggle to see the version powered by AI"

**AI Training - Phase 1 Complete:**
- Added full Advertising Analytics project (Jungle Scout) with research details, key insights, solution structure
- Added Visier (2019) with 3 project highlights: Chart Visualization Settings, Careers Site Redesign, Recruitment Analytics
- New fallback keywords: "jungle scout", "advertising", "ppc", "copilot", "visier", "people analytics"
- Updated skills: information architecture, HR/people analytics domain
- Career arc now documented: Visier (2019) → Jungle Scout (2021-2022) → Microsoft Azure (2022-present)

**AI Training Audit:**
- Added comprehensive audit section to instructions
- Created 4-phase improvement checklist
- Documented how to add new projects
- Identified unused JSON files in `/content/training/`

**Phase 1 Checklist (Complete):**
- [x] Add full Advertising Analytics to trainingContext
- [x] Add fallback keywords for Jungle Scout, PPC, Copilot
- [x] Add Visier project details

**Remaining Work:**
- Phase 2: Content Depth (design artifacts, learnings, Azure Cost Management)
- Phase 3: Cleanup unused JSON files
- Phase 4: Advanced features (conversation memory, analytics)

### February 8, 2026 (Session 5)

**Sidebar Overflow Fix:**
- Changed `.responsive-container` from `overflow-x: hidden` to `overflow-x: visible`
- Added `overflow-x: hidden` to `html, body` to prevent horizontal scrollbar
- Sidebar now visible at all breakpoints without clipping

**Current Sidebar Behavior:**
- **>1280px**: `position: absolute`, `right: calc(100% + 20px)` (floats left of centered content)
- **769-1280px**: `position: relative`, flex layout with content
- **≤768px**: `display: none`, mobile social links shown instead

**Disabled Features:**
- Dynamic intro blurb generation (code preserved, not used)
- `/api/ask` endpoint still supports `isIntroRequest: true` requests

**Pending:**
- Test sidebar at all breakpoints in production
- More training conversations
- Conversation memory across turns
- Mobile sidebar alternative (bottom sheet?)

### January 25, 2026 (Session 4)

**Layout Overhaul - Centered Content:**
- Content area centered on viewport (max 824px)
- Sidebar positioned absolutely to left of content (368px, 20px gap)
- Total max width: 1212px when sidebar visible
- Medium screens (≤1280px): Falls back to flex layout
- Mobile (≤768px): Unchanged, sidebar hidden

**CSS Variables:**
```css
--page-padding: clamp(16px, 4vw, 88px)
--content-padding: clamp(12px, 2vw, 20px)
--content-max-width: 1440px (legacy, main-container now 824px)
```

**Header Updates:**
- Removed "maybe:" prefix, now just "Grant Zou"
- AI disclaimer updated: "AI-generated content are being refined and improved"
- Section title: "Work experience" (was "About his experience...")

**Experience Section Redesign:**
- Removed experience dots
- Removed role titles, company/period inline as header
- Full-width content (824px max)
- Rich descriptions with paragraph support

**Experience Content:**
- Microsoft · Azure (2022 – Present): Cost Management → Azure Core journey
- Jungle Scout (2020 – 2022): Analytics and data visualization
- Visier (2018 – 2019): People analytics, two-paragraph reflection

**AI Mode Behavior:**
- Removed localStorage persistence
- AI mode only activates with URL hash (#ai or #chat-grant2026)
- Default: Non-AI mode on grantzou.com

**Sidebar:**
- Uses `position: absolute` with `right: calc(100% + 20px)`
- `justify-content: flex-end` aligns content to bottom
- Responsive: becomes relative in flex layout on medium screens

### January 24, 2026 (Session 3)

**AI Mode Toggle:**
- Replaced construction text with toggle switch (green on-state)
- Toggle controls AI mode (enables chat input bar)
- AI disclaimer text appears when toggle is on (hidden on mobile)
- State persisted to localStorage

**URL Hash Routing:**
- `#ai` - Public AI mode (enables toggle + chat)
- `#chat-grant2026` - Secret override for full access
- Hash syncs with toggle state bidirectionally

**About Section:**
- Changed from dynamic AI-generated blurb to static text
- Content: "An evolving, exploratory design portfolio where I'm learning Azure infrastructure and AI hands-on, while experimenting with AI features as new ways to tell product stories."
- Removed title, kept description left-aligned
- 58px top/bottom padding, no top border

**Header Responsiveness:**
- Full-width flexbox layout (removed max-width constraint)
- Toggle stays on same row as name/title on all screen sizes
- AI disclaimer hidden on mobile (≤768px)
- Uses `justify-content: space-between` for symmetric alignment

**Aurora Background:**
- Made responsive with viewport units
- Width: `150vw` (was fixed 2375px/2838px)
- Left offset: `-25vw` (was fixed -280px/-205px)
- Now covers full screen on ultra-wide displays

**Border Standardization:**
- All content section borders: `1px #3B3B3C solid`
- Updated: `.section`, `.experience-section`, `.experience-border`, `.footer`
- About section: `border-top: none`

**Experience Section:**
- Fixed equal width for all text containers
- Uses `flex: 1` with `max-width: calc(100% - 44px)`
- Removed flex-wrap to prevent layout shifts

**Chat Input Animation:**
- Entrance animation on page load (1.5s glow effect)
- Background fades from transparent to semi-transparent
- Border glow pulses then settles

### January 24, 2026 (Session 2)

**Layout & Sticky Elements:**
- Header: sticky with scroll-triggered compact mode
  - Uses `isScrolled` state (triggers at 50px scroll)
  - Dynamic sizing with CSS `clamp()` for responsive scaling
  - Smooth cubic-bezier transitions on shrink
  - Background blur + semi-transparent overlay when scrolled
- Sidebar: converted to fixed floating component
  - `position: fixed` anchored to viewport bottom-left
  - Hidden on mobile (≤768px), shows mobile social links instead
  - Main content has `padding-left` to reserve space

**CSS Variables System:**
- `--page-padding: clamp(16px, 4vw, 88px)` - responsive page margins
- `--content-padding: clamp(12px, 2vw, 20px)` - inner content spacing
- `--content-max-width: 1440px` - max width constraint
- Header, sidebar, and content all use same variables for alignment

**Alignment Rules:**
- Header-left aligns with sidebar (grid layout with 368px column + 6px padding)
- Header-right aligns with content right edge (uses `--content-padding`)
- Experience strokes contained within content area (not edge-to-edge)

**Key CSS Classes:**
- `.header-sticky` - sticky header wrapper with `.scrolled` modifier
- `.sidebar` - fixed bottom-left floating panel
- `.main-container` - flex container with left padding for sidebar space

---

## AI Training Content Audit

### Current Architecture

**Actually Used (hardcoded in `ask.js`):**
| Component | Location | Purpose |
|-----------|----------|---------|
| `trainingContext` | ask.js L150-200 | Profile, philosophy, projects, skills, voice |
| `systemPrompt` | ask.js L200-240 | Personality, response rules, guardrails |
| `generateFallbackResponse()` | ask.js L303-321 | Keyword-based fallbacks when API fails |
| `generateIntroBlurb()` | ask.js L292-300 | Random intro taglines |

**Exists but NOT Used (orphaned files):**
| File | Status | Notes |
|------|--------|-------|
| `content/profile.json` | ❌ Unused | Duplicate of trainingContext |
| `content/training/behaviors/personality-traits.json` | ❌ Unused | Voice, values, traits |
| `content/training/conversations/portfolio-discussions.json` | ❌ Unused | Generic Q&A pairs |
| `content/training/knowledge/design-expertise.json` | ❌ Unused | Generic methodologies |
| `content/training/templates/response-templates.json` | ❌ Unused | Response structure rules |
| `content/faq.json` | ❌ Empty | — |
| `content/testimonials.json` | ❌ Empty | — |

### Improvement Checklist

#### Phase 1: Immediate (High Impact)
- [x] Add full Advertising Analytics project to `trainingContext`
- [x] Add fallback keywords: "jungle scout", "advertising", "ppc", "copilot"
- [x] Add Visier project details to `trainingContext`

#### Phase 2: Content Depth
- [ ] Add specific design artifacts ("I created a flow diagram to map...")
- [ ] Add "what would you do differently" learnings per project
- [ ] Add Azure Cost Management project details
- [ ] Add example user interview quotes/insights

#### Phase 3: Cleanup
- [ ] Delete or archive unused JSON files in `/content/training/`
- [ ] Consolidate `profile.json` data into `ask.js` or remove
- [ ] Populate `faq.json` with common questions OR delete
- [ ] Populate `testimonials.json` OR delete

#### Phase 4: Advanced Features
- [ ] Add conversation memory (multi-turn context)
- [ ] Add more guardrails for edge cases
- [ ] Consider dynamic loading from JSON (CMS-like)
- [ ] Add analytics on common questions

### How to Add New Projects

Add to `trainingContext` in `api/src/functions/ask.js`:

```javascript
// In KEY PROJECTS section:
- [Project Name] ([Company], [Year]):
  - Role: [Your roles]
  - Problem: [What users struggled with]
  - Research: [Methods and participants]
  - Key insight: [The aha moment]
  - Solution: [What you built/designed]
  - Learnings: [What you'd do differently]
  - Status: [Shipped/In progress]
```

Add fallback in `generateFallbackResponse()`:

```javascript
if (q.includes('keyword') || q.includes('project name')) {
    return "Brief response about this project...";
}
```

### Content Quality Guidelines

**Good training content:**
- Specific numbers (interviewed 6 users, surveyed 216)
- Named tools and methods (FigJam, UserZoom Go)
- Concrete outcomes (reduced abandonment, shipped Q1)
- Reflection and learnings

**Avoid:**
- Generic phrases ("user-centered design")
- Vague claims ("improved the experience")
- Missing context (what was the problem?)

---

### January 24, 2026 (Session 1)

**Session Summary:**
- Integrated Azure OpenAI with gpt-4o-mini deployment
- Built chat UI with overlay pattern, shimmer borders, ambient glow effects
- Added prompt suggestions popup with seamless shimmer handoff
- Implemented markdown formatting for AI responses
- Created dynamic intro blurb with typewriter animation
- Updated training data with accurate profile info
- Added GPT disclaimer in chat header
- Fixed security issue (removed API key from git, rotated key)
- Migrated from Azure Functions v3 to v4 programming model
- Implemented rate limiting (10 requests per 2 minutes)

**Pending:**
- More training conversations from additional case studies
- Conversation memory/context awareness across turns
- Mobile sidebar behavior refinement (currently hidden)

