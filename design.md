# Design System — grantzou.com

Reference for colors, typography, components, and interaction patterns.

---

## Color Tokens

| Token | Value | Usage |
|---|---|---|
| Background | `#111010` | Page base |
| Card surface | `#1a1918` | Elevated cards, overlays |
| Primary text | `#e8e4dc` (`--ink`) | Body copy |
| Muted text | `rgba(255,255,255,0.55–0.80)` | Secondary labels, metadata |
| Accent orange | `#e8724a` | Interactive elements, CTAs |
| Accent blue | `#5b8fff` | Links (replaced by mustard for tags) |
| Mustard yellow | `#c9a84c` | Skill tags (border + text + bg wash) |
| Court green | `#52a850` | Badminton dotted underline |
| Border | `#3B3B3C` | Section dividers, experience borders |
| Overlay bg | `rgba(255,255,255,0.07–0.08)` | Glass/frost surfaces |

---

## Typography

| Role | Font | Size | Weight |
|---|---|---|---|
| Name display | IBM Plex Sans | 24–32px (clamp) | 600 |
| Section title | IBM Plex Sans | 13px | 500 |
| Body / bio | IBM Plex Sans | 16px | 400 |
| Experience description | IBM Plex Sans | 16px | 400 |
| Tags / mono labels | IBM Plex Mono | 12px | 400 |
| Tooltip | IBM Plex Mono | 12px | 400 |
| Muted metadata | IBM Plex Sans | 13px | 400 |

Line heights: `1.4` (display) · `1.5` (body) · `22–24px` (experience text)

---

## Layout

```
NAV (sticky) ──────────────────────────────────────
 Grant Zou · ai product designer         [Resume↓] [toggle]

┌─── SIDEBAR (fixed/scrolls) ──┬─── MAIN (scrolls) ────────┐
│ Bio text                      │ About blurb               │
│                               │ ─────────────────────     │
│ @granitez (Instagram)         │ WORK EXPERIENCE           │
│ LinkedIn                      │  · Microsoft Azure        │
│ GitHub                        │    description            │
│ Resume (disabled)             │    [tags] [tags] [tags]   │
│                               │  · Jungle Scout           │
│                               │  · Visier                 │
│                               │ ─────────────────────     │
│                               │ [Chat — AI mode only]     │
│                               │ Footer typewriter         │
└───────────────────────────────┴───────────────────────────┘
```

Padding: `clamp(16px, 4vw, 88px)` · Max width: `1440px`

---

## Components

### Experience Item
```
Company · Period
Role (optional)
Description text
[tag] [tag] [tag]          ← mustard yellow pills
→ View work               ← renders only when viewWork URL is set
```

### Skill Tag `.experience-tag`
- Color: `#c9a84c`
- Border: `1px solid rgba(201, 168, 76, 0.3)`
- Background: `rgba(201, 168, 76, 0.07)`
- Font: IBM Plex Mono 12px
- Padding: `3px 8px` · Radius: `4px`

### Tooltip Link `.tooltip-link-wrapper`
Wraps any inline text with:
- Dotted underline: `2px` thick, `5px` offset, `rgba(255,255,255,0.45)`
- On hover: underline brightens to `rgba(255,255,255,0.85)`
- Tooltip: liquid glass frost (`backdrop-filter: blur(24px) saturate(180%)`)
- Tooltip animates up 4px + fade in (0.18s ease)

**Variants:**
- Default — white dotted underline, "coming soon" tooltip
- `.dotted-link-court` — `#52a850` court green, used on "badminton" → `/bpm`

### Social Link `.social-link`
- Icon (react-icons) + text label
- `.social-link-disabled` — `opacity: 0.3`, `pointer-events: none` (Resume)

### AI Chat (visible in AI mode only)
- Fixed bottom input bar → triggers full-screen overlay
- Full conversation history sent to `/api/ask` on each message
- Suggested prompts popup (sparkle icon)
- Markdown parsing: bold, bullet lists, numbered lists
- Liquid glass chat overlay with typing indicator

### Sticky Header
- Scrolled state: triggered at `scrollY > 50`
- Left: name + "ai product designer" badge
- Right: AI toggle (will become Perspectives segmented control)

---

## Interactions

| Interaction | Spec | Status |
|---|---|---|
| Background parallax | Mouse-tracked gradient shift | ✅ Live |
| Footer typewriter | IntersectionObserver + 2s fallback | ✅ Live |
| AI toggle | Boolean on/off, `#ai` hash, chat overlay | ✅ Live |
| Tooltip links | Dotted underline + frost glass tooltip | ✅ Live |
| Tag rendering | Mustard pills from `exp.tags[]` array | ✅ Live |
| View work link | Renders from `exp.viewWork` URL | ✅ Wired (no URLs yet) |
| Perspectives toggle | 3-way segmented control | ⬜ Not built |
| Work entry hover | Subtle left border accent | ⬜ Not built |
| Page entrance stagger | name → title → bio → work | ⬜ Not built |
| `→ View work` hover | Arrow translates +3px | ⬜ Not built |

---

## Animations

| Name | Property | Duration | Easing |
|---|---|---|---|
| Tooltip appear | opacity + translateY(4px→0) | 180ms | ease |
| Tooltip dotted underline | text-decoration-color | 150ms | ease |
| AI toggle slide | translateX | — | ease |
| Background parallax | transform | continuous | — |
| Perspectives crossfade (planned) | opacity + translateY(4px) | 150ms | ease |
| Perspectives toggle selection (planned) | background + color | 200ms | ease |

---

## Planned: Perspectives Toggle

Replaces the current AI on/off toggle.

```
[ Recruiter · Collaborator · Client ]   ← pill segmented control, top-right
```

- Selected: filled background + subtle glow
- Unselected: `opacity: 0.45`
- URL param: `?as=recruiter` (shareable links)
- Content: static JSON config → Phase 2: Claude API

Config shape (`src/perspectives.json` — to build):
```json
{
  "recruiter": {
    "tagline": "...",
    "highlightTags": ["Enterprise UX", "Copilot / AI", "Systems thinking"],
    "focusAreas": ["azure", "jungle"]
  },
  "collaborator": { ... },
  "client": { ... }
}
```

---

## Planned: Case Studies

Route: `/work/azure-*`, `/work/jungle-scout`, `/work/visier`

Structure per page:
1. Context & Problem
2. My Role & Constraints
3. Research & Discovery
4. Design Decisions
5. Outcome

Requires: React Router (or Next.js pages in future migration)

---

## File Map

| File | What it owns |
|---|---|
| `src/App.jsx` | Layout, experience data, nav, TooltipLink, SocialLinks |
| `src/App.css` | All visual styles — tokens, layout, components, animations |
| `src/ChatInterface.jsx` | Chat overlay, message formatting, API calls |
| `src/config.js` | API URL (dev vs prod switch) |
| `api/src/functions/ask.js` | API handler, system prompt, few-shot injection, rate limiter |
| `api/training.js` | Personality + few-shot examples (source of truth for AI voice) |
| `content/profile.json` | Grant's bio/experience (reference — not deployed) |
| `content/training/` | Rich training JSON (reference — not deployed) |
| `.github/instructions/SPEC.md` | Full redesign specification + launch checklist |
| `design.md` | This file — design system reference |
| `README.md` | Project setup, stack, cloud services |
