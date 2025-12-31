---
id: 001
title: "Book RAG Chatbot — Full Implementation + Floating Icon UI"
stage: spec
date: 2025-12-13
surface: agent
model: Claude Sonnet 4.5
feature: "1-rag-chatbot"
branch: "1-rag-chatbot"
user: "asrak"
command: "/sp.specify"
labels: ["rag-chatbot", "floating-ui", "docusaurus", "ai-agent"]
links:
  spec: "specs/1-rag-chatbot/spec.md"
  ticket: null
  adr: null
  pr: null
files:
  - "specs/1-rag-chatbot/spec.md"
  - "specs/1-rag-chatbot/checklists/requirements.md"
tests: []
---

# PHR: Book RAG Chatbot — Full Implementation + Floating Icon UI

## User Input

```
Book RAG Chatbot — Full Implementation + Floating Icon UI (MANDATORY)

CRITICAL FAILURE CONDITION:
If a floating chatbot icon is NOT visible in the book UI on all pages, this task is FAILED.

---

## 🎯 Goal

Build and deploy a fully functional Book RAG chatbot that:

- Uses OpenAI Agents SDK
- Uses Gemini 2.5 Flash via OpenAI-style external provider
- Retrieves knowledge ONLY from the robotics book (Qdrant)
- Appears in the book UI as a FLOATING CHAT ICON
- Works end-to-end (UI → FastAPI → Agent → Qdrant → UI)

---

## 1. MCP + Context7 (MANDATORY FIRST STEP)

Before generating ANY code, Claude Code MUST run:

context7 - resolve-library-id (MCP)(libraryName: "OpenAI Agents SDK")

Claude Code MUST strictly follow the returned documentation for:
- Agent creation
- Runner.run usage
- Tool schema
- External model provider configuration

---

## 2. Agent Requirements

### Agent Name
book_rag_agent

### Model
Gemini 2.5 Flash (external provider, OpenAI-compatible)

### Instructions
The agent MUST:
- ALWAYS call the rag_query tool before answering
- ONLY answer from retrieved chunks
- NEVER hallucinate
- ALWAYS include citations
- Ignore all external/world knowledge

---

## 3. Tooling

Expose exactly ONE function tool:

rag_query(query: str, mode: str, top_k: number)

Behavior:
- mode = "rag" → retrieve from Qdrant
- mode = "selected" → retrieve from user-selected text
- Return id, text, similarity score

---

## 4. Backend (FastAPI)

Create a FastAPI backend deployed on Hugging Face Spaces.

### Endpoint
POST /chat

Body:
```json
{
  "message": "user message",
  "selected_text": "string | null",
  "session_id": "uuid | null"
}
```
```

## Response Summary

Updated the existing specification in `specs/1-rag-chatbot/spec.md` to match the specific requirements for a Book RAG Chatbot with Floating Icon UI. Key changes made:

1. Updated the System Summary to emphasize the floating chat icon requirement
2. Added specific agent requirements with Gemini 2.5 Flash and hallucination prevention
3. Created detailed tooling requirements for the rag_query function
4. Added backend architecture with Hugging Face Spaces deployment
5. Added frontend architecture with floating chat icon UI requirements
6. Updated user stories to prioritize the floating icon accessibility as P1
7. Added functional requirements specifically for the floating icon UI
8. Updated success criteria to include metrics for the floating icon visibility
9. Made the specification more technology-agnostic while preserving essential functionality
10. Created a quality checklist at `specs/1-rag-chatbot/checklists/requirements.md`

The specification now properly emphasizes the critical requirement that a floating chatbot icon must be visible on all book pages, with this being the P1 user story.

## Outcome

The specification is complete and ready for the next phase (`/sp.plan`). All checklist items have been validated and completed.

## Evaluation

The specification successfully captures all requirements from the user input while maintaining focus on user value and business needs. The technology-agnostic approach ensures the specification remains focused on functionality rather than implementation details, while still preserving the critical requirements for the floating chat icon UI and AI agent behavior.