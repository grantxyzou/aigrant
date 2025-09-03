---
applyTo: '**'
---
aigrant is Grant’s AI-powered design portfolio + personal agent.

It showcases his design career through a conversational, AI-driven experience, while laying the foundation for a lightweight personal planner.

MVP (build now):

Frontend: React + Vite, hosted as Azure Static Web App (fast load, modern UX, dark mode, streaming chat).

Backend: Azure Functions handling secure API calls to Azure OpenAI. API keys are backend-only; secured with validation, CORS, and rate-limiting.

Content model: JSON/Markdown in /content (profile.json, projects/*.json, faq.json, testimonials.json).

Search: Indexed with Azure AI Search + embeddings for grounded Q&A with citations.

UI features: Chat landing page, prompt chips, answer blocks, receipts/citations drawer.

Architecture summary:

Browser (React) → /api/ask (Azure Function) → Azure OpenAI + AI Search → response → render in UI


Future scope (expand later):

Data layer: Cosmos DB for journal + tasks; Blob Storage for artifacts.

Ops & security: Key Vault (secrets), API Management, Front Door (routing), App Insights (monitoring).

Admin UI: Add wins/projects, trigger reindexing.

Agentic planner: Summarize weekly accomplishments, set priorities, act as private life/work assistant.

