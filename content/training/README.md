# AI Training Data Structure

This directory contains training data for Grant's AI agent, organized into specialized categories for effective AI behavior and knowledge training.

## Directory Structure

### `/conversations/`
Training conversations that demonstrate desired interaction patterns, conversation flow, and response styles. These help the AI learn Grant's communication tone and preferred interaction patterns.

**Example files:**
- `portfolio-discussions.json` - Conversations about Grant's design work
- `career-guidance.json` - Professional advice conversations  
- `creative-process.json` - Discussions about design methodology

### `/behaviors/`
Behavioral training data that defines personality traits, response patterns, and interaction preferences. This shapes how the AI agent embodies Grant's professional persona.

**Example files:**
- `personality-traits.json` - Core personality characteristics
- `communication-style.json` - Tone, voice, and communication preferences
- `professional-values.json` - Work philosophy and values

### `/knowledge/`
Domain-specific knowledge that the AI should reference when answering questions. This includes expertise, methodologies, and specialized information.

**Example files:**
- `design-expertise.json` - Design knowledge and methodologies
- `tool-proficiency.json` - Software and tool expertise
- `industry-insights.json` - Design industry knowledge

### `/templates/`
Response templates and structured formats for common interaction types. These ensure consistent and well-formatted responses.

**Example files:**
- `project-showcase.json` - Template for presenting design projects
- `advice-responses.json` - Structure for giving professional advice
- `question-handling.json` - Templates for different question types

## Usage Notes

- All JSON files should follow consistent schema patterns
- Files will be automatically indexed by Azure AI Search for retrieval
- Keep training data focused and relevant to Grant's professional domain
- Update regularly as the AI agent evolves and learns