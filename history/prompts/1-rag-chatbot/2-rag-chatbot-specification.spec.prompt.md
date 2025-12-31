---
id: 2
title: rag-chatbot-specification
stage: spec
date: 2025-12-10
surface: agent
model: claude-sonnet-4-5-20250929
feature: rag-chatbot
branch: 1-rag-chatbot
user: asrak
command: /sp.specify
labels: [specification,rag,chatbot,docusaurus]
links:
  spec: specs/1-rag-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/1-rag-chatbot/spec.md
  - specs/1-rag-chatbot/checklists/requirements.md
tests:
  - spec quality checklist completed
---

## Prompt

### Goal
Specify the complete technical requirements for building and integrating a Retrieval-Augmented Generation (RAG) chatbot into the Docusaurus-based unified book project. The chatbot must use the OpenAI Agents/ChatKit SDK, FastAPI backend, Qdrant Cloud, Neon Serverless Postgres, and support selected-text answering. Context7 MCP Server must be used to fetch OpenAI Agent SDK documentation and ensure correctness during agent creation.

---

## 1. System Summary
Develop an AI-powered RAG chatbot embedded inside a Docusaurus book website. The chatbot retrieves information only from book content and supports two modes:

1. **Full-book RAG mode** – normal question answering using vector search.
2. **Selected-text QA** – users highlight text, and the chatbot answers using only that selected content.

The backend will use:
- **FastAPI** (Python)
- **OpenAI Agents/ChatKit SDK**
- **Qdrant Cloud Free Tier** for vector search
- **Neon Serverless Postgres** for logging
- **Context7 MCP Server** to fetch agent SDK docs during development

The frontend will use:
- **Docusaurus React widget**
- Embedded chat box UI
- Ability to pass selected DOM text to backend

---

## 2. Functional Requirements

### 2.1 RAG Data Preparation
- Parse all book `.md` files.
- Chunk documents using configurable chunking strategy.
- Generate embeddings using OpenAI embedding API.
- Store embeddings inside a dedicated Qdrant collection.
- Maintain metadata: file path, section, chapter, chunk index.

### 2.2 Retrieval Process
- Retrieve top-k chunks using cosine similarity search from Qdrant.
- Merge and format retrieved context.
- Send context → Agent for grounded answers.

### 2.3 Selected Text QA
- UI allows users to highlight text.
- Selected text sent to backend `/select-query`.
- Backend bypasses vector search and uses user-provided text as the retrieval context.
- Agent must strictly restrict answers to provided text.

### 2.4 Agent Requirements
- Built using **OpenAI Agents SDK**.
- Use **Context7 MCP Server** to fetch official SDK documentation:
- APIs
- code patterns
- tools API
- action definitions
- recommended best practices
- Agent must be configured with:
- Retrieval tool
- Logging tool
- Context injection
- Safety/compliance (standard OpenAI agent)

### 2.5 FastAPI Endpoints
#### `/embed`
- Regenerate embeddings from all MD files.
- Push to Qdrant.
- Return status + total vectors.

#### `/query`
- Accept: `{ question: string }`
- Perform: retrieval → agent → answer
- Log conversation to Neon Postgres.

#### `/select-query`
- Accept: `{ question: string, selected_text: string }`
- Send selected_text directly as the RAG context.
- Log usage.

#### `/logs`
- Provide paginated logs from Neon DB.

---

## 3. Backend Architecture

### 3.1 Components
- `rag_service.py` — Qdrant retrieval logic
- `embedding_service.py` — MD parsing + embedding generation
- `agent_service.py` — Agent constructed using OpenAI SDK
- `routes.py` — FastAPI endpoints
- `db.py` — Neon async DB client
- `mcp_client.py`
- Uses Context7 MCP Server
- Fetches **OpenAI Agent SDK documentation** dynamically
- Stores it locally for reference or injects into Agent system prompt

### 3.2 Agent Structure
- System Prompt:
- Must include rules on RAG grounding
- Must include documentation fetched from MCP Server
- Tools:
- `search_qdrant(query)`
- `log_to_postgres(data)`
- `a

## Response snapshot

# Feature Specification: RAG Chatbot for Docusaurus Book

**Feature Branch**: `1-rag-chatbot`
**Created**: 2025-12-10
**Status**: Draft
**Input**: User description: "### Goal
Specify the complete technical requirements for building and integrating a Retrieval-Augmented Generation (RAG) chatbot into the Docusaurus-based unified book project. The chatbot must use the OpenAI Agents/ChatKit SDK, FastAPI backend, Qdrant Cloud, Neon Serverless Postgres, and support selected-text answering. Context7 MCP Server must be used to fetch OpenAI Agent SDK documentation and ensure correctness during agent creation.

---

## 1. System Summary
Develop an AI-powered RAG chatbot embedded inside a Docusaurus book website. The chatbot retrieves information only from book content and supports two modes:

1. **Full-book RAG mode** – normal question answering using vector search.
2. **Selected-text QA** – users highlight text, and the chatbot answers using only that selected content.

The backend will use:
- **FastAPI** (Python)
- **OpenAI Agents/ChatKit SDK**
- **Qdrant Cloud Free Tier** for vector search
- **Neon Serverless Postgres** for logging
- **Context7 MCP Server** to fetch agent SDK docs during development

The frontend will use:
- **Docusaurus React widget**
- Embedded chat box UI
- Ability to pass selected DOM text to backend

---

## 2. Functional Requirements

### 2.1 RAG Data Preparation
- Parse all book `.md` files.
- Chunk documents using configurable chunking strategy.
- Generate embeddings using OpenAI embedding API.
- Store embeddings inside a dedicated Qdrant collection.
- Maintain metadata: file path, section, chapter, chunk index.

### 2.2 Retrieval Process
- Retrieve top-k chunks using cosine similarity search from Qdrant.
- Merge and format retrieved context.
- Send context → Agent for grounded answers.

### 2.3 Selected Text QA
- UI allows users to highlight text.
- Selected text sent to backend `/select-query`.
- Backend bypasses vector search and uses user-provided text as the retrieval context.
- Agent must strictly restrict answers to provided text.

### 2.4 Agent Requirements
- Built using **OpenAI Agents SDK**.
- Use **Context7 MCP Server** to fetch official SDK documentation:
- APIs
- code patterns
- tools API
- action definitions
- recommended best practices
- Agent must be configured with:
- Retrieval tool
- Logging tool
- Context injection
- Safety/compliance (standard OpenAI agent)

### 2.5 FastAPI Endpoints
#### `/embed`
- Regenerate embeddings from all MD files.
- Push to Qdrant.
- Return status + total vectors.

#### `/query`
- Accept: `{ question: string }`
- Perform: retrieval → agent → answer
- Log conversation to Neon Postgres.

#### `/select-query`
- Accept: `{ question: string, selected_text: string }`
- Send selected_text directly as the RAG context.
- Log usage.

#### `/logs`
- Provide paginated logs from Neon DB.

---

## 3. Backend Architecture

### 3.1 Components
- `rag_service.py` — Qdrant retrieval logic
- `embedding_service.py` — MD parsing + embedding generation
- `agent_service.py` — Agent constructed using OpenAI SDK
- `routes.py` — FastAPI endpoints
- `db.py` — Neon async DB client
- `mcp_client.py`
- Uses Context7 MCP Server
- Fetches **OpenAI Agent SDK documentation** dynamically
- Stores it locally for reference or injects into Agent system prompt

### 3.2 Agent Structure
- System Prompt:
- Must include rules on RAG grounding
- Must include documentation fetched from MCP Server
- Tools:
- `search_qdrant(query)`
- `log_to_postgres(data)`
- `a"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Full-book RAG Query (Priority: P1)

As a book reader, I want to ask questions about the book content and receive accurate answers based on the entire book, so I can quickly find information without manually searching through pages.

**Why this priority**: This is the core functionality that provides immediate value - users can ask questions and get intelligent responses based on the book content.

**Independent Test**: Can be fully tested by asking questions about book content and verifying that the responses are accurate and grounded in the actual book content, delivering value as a standalone RAG system.

**Acceptance Scenarios**:

1. **Given** a book with indexed content in the RAG system, **When** a user asks a question about book content, **Then** the system returns an accurate answer based on the relevant book sections
2. **Given** a user types a question in the chat interface, **When** they submit the question, **Then** the system processes the question through the RAG pipeline and returns a contextual response within 10 seconds

---

### User Story 2 - Selected Text Question Answering (Priority: P2)

As a book reader, I want to highlight specific text and ask questions about that text, so I can get detailed explanations about content I'm currently reading.

**Why this priority**: This provides a focused, enhanced reading experience that complements the main RAG functionality with targeted answers.

**Independent Test**: Can be fully tested by selecting text on a page, asking questions about it, and verifying the agent responds using only the provided text context, delivering value as a standalone selection-based Q&A feature.

**Acceptance Scenarios**:

1. **Given** a user has highlighted text on a book page, **When** they ask a question about that text, **Then** the system responds using only the highlighted text as context
2. **Given** a user has selected text, **When** they ask a question that requires broader context, **Then** the system acknowledges its limitation and responds only to what's available in the selected text

---

### User Story 3 - System Administration and Embedding Management (Priority: P3)

As a system administrator, I want to be able to regenerate embeddings when book content changes, so the RAG system remains up-to-date with the latest book information.

**Why this priority**: This ensures the system remains functional over time as content updates occur, providing long-term maintainability.

**Independent Test**: Can be fully tested by triggering an embedding regeneration process and verifying that new content is properly indexed in the vector database, delivering value as a standalone content management tool.

**Acceptance Scenarios**:

1. **Given** updated book content exists, **When** an admin triggers the `/embed` endpoint, **Then** the system reprocesses all MD files and updates the Qdrant vector store with new embeddings
2. **Given** a successful embedding process, **When** the process completes, **Then** the system returns a status report showing total vectors processed and stored

---

### Edge Cases

- What happens when the user asks a question that has no relevant content in the book?
- How does the system handle extremely long selected text that might exceed API limits?
- What happens when the vector database is temporarily unavailable?
- How does the system handle questions in languages different from the book content?
- What happens when there are multiple users making simultaneous requests?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST parse all book `.md` files to extract content for indexing
- **FR-002**: System MUST generate and store vector embeddings of book content in a vector database
- **FR-003**: Users MUST be able to ask questions about book content through a chat interface
- **FR-004**: System MUST retrieve relevant content chunks using similarity search from the vector database
- **FR-005**: System MUST use an AI agent system to generate contextual answers based on retrieved content
- **FR-006**: System MUST support selected-text QA where answers are grounded only in user-selected text
- **FR-007**: System MUST log all user interactions to a persistent database
- **FR-008**: System MUST provide an endpoint to regenerate embeddings from MD files
- **FR-009**: System MUST provide a query endpoint that accepts questions and returns RAG-enhanced answers
- **FR-010**: System MUST provide a selected-text query endpoint that answers questions based only on user-provided text
- **FR-011**: System MUST use documentation resources to ensure proper agent configuration during development
- **FR-012**: System MUST ensure agents are properly configured with retrieval and logging capabilities

### Key Entities *(include if feature involves data)*

- **Question**: A user query submitted to the RAG system, containing text and optional metadata
- **Retrieved Context**: A set of relevant text chunks retrieved from the vector database based on question similarity
- **Answer**: A response generated by the OpenAI agent based on retrieved context and original question
- **Embedding**: Vector representation of text content stored in Qdrant for similarity search
- **Log Entry**: Record of user interaction including question, response, timestamp, and user session
- **Book Content Chunk**: Processed segment of book content with metadata (file path, section, chapter, chunk index)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users receive relevant answers to their questions 90% of the time when asking about book content
- **SC-002**: The system processes user queries within 10 seconds for 95% of requests under normal load conditions
- **SC-003**: The selected-text QA functionality provides accurate responses based only on the selected text 95% of the time
- **SC-004**: System maintains 99% uptime for the core question-answering functionality during business hours
- **SC-005**: Content indexing process completes successfully within 30 minutes for a book with 1000 pages of content
- **SC-006**: Users rate the helpfulness of answers as 4 or higher out of 5 in satisfaction surveys
- **SC-007**: The system captures 100% of user interactions for audit and analytics purposes

## Outcome

- ✅ Impact: Created complete feature specification for RAG chatbot with user scenarios, functional requirements, and success criteria
- 🧪 Tests: Spec quality checklist completed with all items validated
- 📁 Files: Created spec.md and requirements checklist in specs/1-rag-chatbot/
- 🔁 Next prompts: Ready for /sp.clarify or /sp.plan to proceed with feature development
- 🧠 Reflection: Specification successfully translated technical requirements into user-focused, testable requirements while maintaining technology-agnostic success criteria

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): All validation checks passed
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed with planning phase to design architecture