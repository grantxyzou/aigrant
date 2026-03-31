# AI Training Data — Source Files

This directory contains the source training data for Grant's AI chat (`ask` tab on grantzou.com). These files are **not deployed** — only `api/training.js` is deployed with the Azure Function.

## How it works

These files are the **source of truth**. When you update them, you must also update `api/training.js` manually — that's the compiled file the AI actually reads at runtime.

> `content/training/` → edit here → copy relevant content into `api/training.js` → deploy

---

## Files

### `knowledge/design-expertise.json`
Design philosophy, expertise areas, methodologies, and tools. The key fields (`design_philosophy`, `expertise_areas`, `methodologies`, `tools_and_technologies`) are compiled into the `trainingContext` string in `api/training.js`.

### `behaviors/personality-traits.json`
Voice, tone, values, traits, and signature phrases. Mirrors the `personality` export in `api/training.js`.

### `templates/response-templates.json`
Two response structure templates:
- `project_explanation` — context → role → challenge → decision → impact
- `reflection` — insight → tradeoff → next time

These are included in `api/training.js` under the `RESPONSE STRUCTURE TEMPLATES` section of `trainingContext`.

### `conversations/portfolio-discussions.json`
9 structured training conversations covering design process, tool expertise, project walkthroughs, research methodology, and stakeholder collaboration. The best examples are compiled into `fewShotExamples` in `api/training.js`.

### `conversations/case-study-raw.txt`
Raw case study content for the Jungle Scout Advertising Analytics project. Key facts from this are incorporated into the `KEY PROJECTS` section of `trainingContext` in `api/training.js`.

---

## What's currently wired (as of March 2026)

| File | Status |
|---|---|
| `knowledge/design-expertise.json` | ✅ Key content compiled into `api/training.js` |
| `behaviors/personality-traits.json` | ✅ Mirrors `personality` export in `api/training.js` |
| `templates/response-templates.json` | ✅ Compiled into `trainingContext` |
| `conversations/portfolio-discussions.json` | ✅ Best examples in `fewShotExamples` (7 total) |
| `conversations/case-study-raw.txt` | ✅ Key facts in `trainingContext` under KEY PROJECTS |

---

## When to update

- Adding a new project → update `case-study-raw.txt` and compile into `api/training.js`
- Changing voice/tone → update `personality-traits.json` and `api/training.js`
- Adding FAQ or testimonials → update `content/faq.json` and `content/testimonials.json` (deferred — files exist but are empty, not currently prioritized)
