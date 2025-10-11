---
applyTo: '**'
---
aigrant is Grant’s AI-powered design portfolio + personal agent.

It showcases his design career through a conversational, AI-driven experience, while laying the foundation for a lightweight personal planner.

MVP (build now):

Frontend: React + Vite, hosted as Azure Static Web App (fast load, modern UX, dark mode, streaming chat).

Backend: Azure Functions handling secure API calls to Azure OpenAI. API keys are backend-only; secured with validation, CORS, and rate-limiting.

## File Structure

```
aigrant/
├── .github/
│   ├── instructions/
│   │   └── projectcontext.instructions.md
│   └── workflows/
├── api/
│   └── ask/
│       └── index.js              # Azure Function for AI interactions
├── content/
│   ├── training/                 # AI training data
│   │   ├── README.md            # Training data documentation
│   │   ├── conversations/       # Training conversations
│   │   │   └── portfolio-discussions.json
│   │   ├── behaviors/           # AI personality & behavior
│   │   │   └── personality-traits.json
│   │   ├── knowledge/           # Domain expertise
│   │   │   └── design-expertise.json
│   │   └── templates/           # Response templates
│   │       └── response-templates.json
│   ├── faq.json                 # FAQ content
│   ├── profile.json             # Profile data
│   ├── testimonials.json        # Testimonials
│   └── projects/                # Project showcase data
├── public/                      # Static assets
├── src/                         # React frontend
│   ├── App.jsx                  # Main application component
│   ├── App.css                  # Styles with animations
│   └── main.jsx                 # Entry point
├── package.json                 # Dependencies & scripts
├── vite.config.js              # Vite configuration
└── index.html                   # HTML template
```

Content model: JSON/Markdown in /content with structured data:
- Core content: profile.json, projects/*.json, faq.json, testimonials.json
- AI training data: /training/ subdirectory with conversations/, behaviors/, knowledge/, templates/
- Training structure: Organized JSON files for AI personality, expertise, response patterns, and conversation examples

Search: Indexed with Azure AI Search + embeddings for grounded Q&A with citations. Training data enhances AI responses with Grant's voice, expertise, and interaction patterns.

UI features: Chat landing page, prompt chips, answer blocks, receipts/citations drawer.

Architecture summary:

Browser (React) → /api/ask (Azure Function) → Azure OpenAI + AI Search → response → render in UI


Future scope (expand later):

Data layer: Cosmos DB for journal + tasks; Blob Storage for artifacts.

Ops & security: Key Vault (secrets), API Management, Front Door (routing), App Insights (monitoring).

Admin UI: Add wins/projects, trigger reindexing, manage training data (conversations, behaviors, knowledge updates).

Agentic planner: Summarize weekly accomplishments, set priorities, act as private life/work assistant. Training data enables personalized responses that reflect Grant's communication style, design philosophy, and professional expertise.

---

## Development Log - October 11, 2025

### AI Training Data Structure Implementation & POC

**What We Built Today:**

#### 1. AI Training Data Structure
Created organized training data system in `/content/training/`:
- `conversations/` - Training conversations from real case studies
- `behaviors/` - AI personality traits and communication style  
- `knowledge/` - Domain expertise and design methodologies
- `templates/` - Response structure templates
- `README.md` - Complete documentation

#### 2. Case Study Data Extraction
Analyzed Grant's Advertising Analytics case study to create authentic training conversations:
- Extracted Grant's actual terminology ("solution-eering", two-part research approach)
- Captured specific project details (6 Amazon sellers, 216 survey participants, FigJam synthesis)
- Preserved authentic voice and design philosophy
- Created 5 training conversations covering: project overview, research methodology, stakeholder collaboration, problem-framing philosophy, and data visualization expertise

#### 3. Chat Interface POC
Built working chat interface integrated into portfolio:
- React component (`/src/ChatInterface.jsx`) with clean UI matching site design
- Local response generation using training data (no Azure costs)
- Dynamic response variations to avoid repetitive answers
- Conversational starters and randomized responses
- Mobile responsive design with proper styling

#### 4. Azure Infrastructure Setup (Partial)
- Set up Azure Functions structure (`/api/ask/`)
- Created proper `host.json` and `function.json` configuration
- Installed Azure Functions Core Tools
- Identified Node.js compatibility issue (v24.7.0 not supported)
- Created local.settings.json for environment variables

#### 5. Training Data Features
Response system handles multiple question types:
- Design process and methodology questions
- Research approach and validation methods
- Project examples and case studies  
- Collaboration and stakeholder management
- Design philosophy and problem-solving approach
- Tools and technical skills
- Data visualization expertise
- Career background and Microsoft experience
- Personal interests (music, badminton)

**Current Status:**
✅ Training data structure complete and documented
✅ Chat interface working with authentic Grant responses
✅ Zero Azure costs - running locally only
❌ Azure Functions not connected (Node.js version issue)

**Files Modified/Created:**
- `/content/training/` - Complete directory structure
- `/content/training/conversations/portfolio-discussions.json` - Case study training data
- `/content/training/conversations/case-study-raw.txt` - Raw case study content
- `/content/training/behaviors/personality-traits.json` - AI personality definition
- `/content/training/knowledge/design-expertise.json` - Domain expertise
- `/content/training/templates/response-templates.json` - Response structures
- `/src/ChatInterface.jsx` - Working chat component
- `/src/App.jsx` - Added chat section to portfolio
- `/src/App.css` - Chat interface styling
- `/api/` - Azure Functions setup (incomplete)
- Updated project documentation

**Next Steps When Ready:**
1. Resolve Node.js compatibility for Azure Functions (downgrade or update functions)
2. Connect chat interface to Azure OpenAI API
3. Add more training conversations from additional case studies
4. Implement proper error handling and loading states
5. Add conversation memory and context awareness

**POC Success Metrics:**
- AI responses use Grant's authentic terminology ✅
- References specific projects and methodologies ✅  
- Maintains consistent voice across response variations ✅
- Provides varied, non-repetitive answers ✅
- Integrates seamlessly with existing portfolio design ✅

**Key Learning:**
Training data extraction from real case studies produces significantly more authentic AI responses than generic examples. The systematic approach of organizing training data by categories (conversations, behaviors, knowledge, templates) creates a scalable foundation for expanding the AI agent's capabilities.

