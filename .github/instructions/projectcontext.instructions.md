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

