# grantzou.com

AI portfolio for Grant Zou — product designer at Microsoft Azure.

Live: [grantzou.com](https://grantzou.com)

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19 + Vite 7 |
| Styling | TailwindCSS 4 + custom CSS (IBM Plex Sans/Mono) |
| Backend | Azure Functions v4 (Node.js) |
| AI | Azure OpenAI — `gpt-4o-mini` |
| Hosting | Azure Static Web Apps |
| CI/CD | GitHub Actions — push to `main` triggers deploy (~2 min) |

---

## Cloud Services

| Resource | Region | Purpose |
|---|---|---|
| Azure Static Web Apps | Global CDN | Hosts frontend + routes `/api/*` to Functions |
| Azure Functions (in Static Web App) | — | Serverless API (`/api/ask`) |
| Azure OpenAI `grantxyzou-agentic-analysis-reso` | East US 2 | gpt-4o-mini completions — **active** |
| Azure OpenAI `aigrant` | Canada Central | No deployment — unused |

---

## Local Development

```bash
npm run dev:all       # Vite :5173 + Azure Functions :7071
npm run dev           # Frontend only
npm run dev:api       # Functions only (cd api && func start)
npm run build         # Production build → /dist
```

Requires `api/local.settings.json` (gitignored):

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AZURE_OPENAI_ENDPOINT": "https://grantxyzou-agentic-analysis-reso.cognitiveservices.azure.com/",
    "AZURE_OPENAI_API_KEY": "<your-key>",
    "AZURE_OPENAI_DEPLOYMENT": "gpt-4o-mini"
  }
}
```

---

## Project Structure

```
aigrant/
├── src/                          # React frontend
│   ├── App.jsx                   # Main component — layout, experience, nav
│   ├── App.css                   # All styles (CSS vars + Tailwind)
│   ├── ChatInterface.jsx         # AI chat overlay component
│   ├── config.js                 # API URL (dev vs prod)
│   └── main.jsx                  # Entry point
│
├── api/                          # Azure Functions (deployed separately)
│   ├── src/functions/ask.js      # Main API handler — rate limit, AI call, fallbacks
│   ├── training.js               # Personality + few-shot examples (wired into ask.js)
│   ├── host.json                 # Functions config
│   └── local.settings.json       # Local env vars (gitignored — never commit)
│
├── content/                      # Source training data (NOT deployed with functions)
│   ├── profile.json              # Source of truth for Grant's bio/experience
│   ├── training/
│   │   ├── behaviors/personality-traits.json
│   │   ├── conversations/portfolio-discussions.json
│   │   ├── knowledge/design-expertise.json
│   │   └── templates/response-templates.json
│   ├── faq.json                  # Empty — to fill
│   └── testimonials.json         # Empty — to fill
│
├── .github/
│   ├── instructions/SPEC.md      # Full redesign specification
│   └── workflows/                # GitHub Actions CI/CD
│
├── staticwebapp.config.json      # Routing + redirects (incl. /bpm → badminton app)
├── design.md                     # Design system reference
└── vite.config.js
```

---

## API: `/api/ask`

**POST** — conversation mode
```json
{ "messages": [{ "role": "user", "content": "..." }, ...] }
```

**POST** — intro blurb
```json
{ "isIntroRequest": true }
```

**Rate limit:** 10 requests / 2 min per IP (in-memory — resets on cold start)

**Response:**
```json
{ "success": true, "response": "...", "question": "..." }
```

---

## Deployment

Push to `main` → GitHub Actions builds with Vite → deploys to Azure Static Web Apps.

Production env vars are set in Azure Portal → Static Web App → Environment Variables.

---

## Security Notes

- API keys are environment variables only — never in source code
- `api/local.settings.json` is gitignored
- CORS: `Access-Control-Allow-Origin: *` (acceptable for public portfolio API)
- Rate limiting is in-memory — does not persist across Azure Function cold starts
- `content/` directory is NOT deployed with the function (local dev only)
- Run `npm audit` regularly — last clean audit: March 2026

---

## What's Done / What's Next

See [`design.md`](./design.md) for design system reference.
See [`.github/instructions/SPEC.md`](./.github/instructions/SPEC.md) for full roadmap.

### Done
- AI chat with full conversation history + Azure OpenAI
- Training data wired into API (few-shot examples, sanitized)
- Skill tags on all work entries (mustard yellow)
- Dotted tooltip links in bio (music, tech, badminton → /bpm)
- Resume in sidebar (disabled, doc icon)
- AI disclaimer removed
- Typewriter footer updated
- Default model corrected to gpt-4o-mini
- npm vulnerabilities patched (March 2026)

### Next
1. **Perspectives toggle** — replace AI toggle with Recruiter · Collaborator · Client segmented control (`?as=recruiter` URL param)
2. **Case studies** — at least 1 Azure case study at `/work/azure-*`
3. **Next.js migration** — SSG for SEO; site currently invisible to Google
