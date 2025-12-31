# Feature Specification: Book RAG Chatbot — Full Implementation + Floating Icon UI

**Feature Branch**: `1-rag-chatbot`
**Created**: 2025-12-13
**Status**: Draft
**Input**: User description: "Book RAG Chatbot — Full Implementation + Floating Icon UI (MANDATORY)

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

## 1. System Summary
Develop an AI-powered RAG chatbot embedded inside a Docusaurus book website as a floating icon that appears on all pages. The chatbot retrieves information only from book content and supports two modes:

1. **Full-book RAG mode** – normal question answering using vector search from Qdrant.
2. **Selected-text QA** – users highlight text, and the chatbot answers using only that selected content.

The backend will use:
- Server-side API framework deployed on cloud hosting
- AI agent system with advanced language model for question answering
- Vector database for semantic search of book content
- Documentation system to ensure proper agent configuration during development

The frontend will use:
- Web-based UI component with a floating chat icon visible on all pages
- Embedded chat interface
- Ability to pass selected text to backend

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
- AI agent system with advanced language model for question answering
- Agent name: **book_rag_agent**
- Instructions: The agent MUST:
  - ALWAYS retrieve relevant content before answering
  - ONLY answer from retrieved book content
  - NEVER hallucinate or provide external information
  - ALWAYS include citations to source material
  - Ignore all external/world knowledge and only use provided content
- Documentation system to ensure proper agent configuration during development:
  - Agent creation patterns
  - Tool usage patterns
  - Tool schema definitions
  - Model provider configuration
- Agent must be configured with:
  - Retrieval tool (with query, mode, and result count parameters)
  - Context injection
  - Safety/compliance measures

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

## 3. Tooling Requirements

### 3.1 Retrieval Tool
- Expose exactly ONE function tool for content retrieval
- Behavior:
  - Full-book mode → retrieve from book content database
  - Selected-text mode → retrieve from user-selected text
  - Return relevant content with source identification and relevance score

---

## 4. Backend Architecture

### 4.1 API Backend Deployment
- Deploy on cloud hosting platform
- Endpoint: POST `/chat`
- Request body:
```json
{
  "message": "user message",
  "selected_text": "text | null",
  "session_id": "identifier | null"
}
```

---

## 5. Frontend Architecture

### 5.1 Floating Chat Icon UI
- CRITICAL: A floating chatbot icon MUST be visible in the book UI on ALL pages
- The icon should be persistent and accessible regardless of page scroll position
- Clicking the icon opens the chat interface
- The chat interface should be embedded in the Docusaurus site
- The UI must work seamlessly with the existing Docusaurus theme

### 5.2 Components
- `rag_service.py` — Qdrant retrieval logic
- `embedding_service.py` — MD parsing + embedding generation
- `agent_service.py` — Agent constructed using OpenAI SDK
- `routes.py` — FastAPI endpoints
- `db.py` — Neon async DB client
- `mcp_client.py`
- Uses Context7 MCP Server
- Fetches **OpenAI Agent SDK documentation** dynamically
- Stores it locally for reference or injects into Agent system prompt

### 5.3 Agent Structure
- System Prompt:
  - Must include rules on RAG grounding
  - Must include documentation fetched from MCP Server
- Tools:
  - `rag_query(query, mode, top_k)`
  - `a"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Floating Chat Icon Accessibility (Priority: P1)

As a book reader, I want to see a floating chatbot icon visible on all pages of the book, so I can access the RAG chatbot functionality anytime without navigating to a specific location.

**Why this priority**: This is a CRITICAL requirement - if the floating chatbot icon is NOT visible in the book UI on all pages, the task is FAILED according to the feature requirements. This provides the primary access point to all other functionality.

**Independent Test**: Can be fully tested by navigating to any page in the book and verifying that the floating chat icon is visible and accessible, delivering value as the primary UI access point.

**Acceptance Scenarios**:

1. **Given** any page in the book is loaded, **When** the page renders, **Then** a floating chatbot icon is visible and accessible regardless of scroll position
2. **Given** a user is reading any page in the book, **When** they click the floating chat icon, **Then** the chat interface opens and is ready for interaction

---

### User Story 2 - Full-book RAG Query (Priority: P2)

As a book reader, I want to ask questions about the book content and receive accurate answers based on the entire book, so I can quickly find information without manually searching through pages.

**Why this priority**: This is the core functionality that provides immediate value - users can ask questions and get intelligent responses based on the book content.

**Independent Test**: Can be fully tested by asking questions about book content and verifying that the responses are accurate and grounded in the actual book content, delivering value as a standalone RAG system.

**Acceptance Scenarios**:

1. **Given** a book with indexed content in the RAG system, **When** a user asks a question about book content, **Then** the system returns an accurate answer based on the relevant book sections
2. **Given** a user types a question in the chat interface, **When** they submit the question, **Then** the system processes the question through the RAG pipeline and returns a contextual response within 10 seconds

---

### User Story 3 - Selected Text Question Answering (Priority: P3)

As a book reader, I want to highlight specific text and ask questions about that text, so I can get detailed explanations about content I'm currently reading.

**Why this priority**: This provides a focused, enhanced reading experience that complements the main RAG functionality with targeted answers.

**Independent Test**: Can be fully tested by selecting text on a page, asking questions about it, and verifying the agent responds using only the provided text context, delivering value as a standalone selection-based Q&A feature.

**Acceptance Scenarios**:

1. **Given** a user has highlighted text on a book page, **When** they ask a question about that text, **Then** the system responds using only the highlighted text as context
2. **Given** a user has selected text, **When** they ask a question that requires broader context, **Then** the system acknowledges its limitation and responds only to what's available in the selected text

---

### Edge Cases

- What happens when the user asks a question that has no relevant content in the book?
- How does the system handle extremely long selected text that might exceed system processing limits?
- What happens when the content search system is temporarily unavailable?
- How does the system handle questions in languages different from the book content?
- What happens when there are multiple users making simultaneous requests?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a floating chatbot icon that is visible on ALL pages of the book UI
- **FR-002**: System MUST ensure the floating chatbot icon remains accessible regardless of page scroll position
- **FR-003**: System MUST allow users to click the floating chatbot icon to open the chat interface
- **FR-004**: System MUST parse all book `.md` files to extract content for indexing
- **FR-005**: System MUST generate and store semantic representations of book content in a content database
- **FR-006**: Users MUST be able to ask questions about book content through a chat interface
- **FR-007**: System MUST retrieve relevant content chunks using similarity search from the content database
- **FR-008**: System MUST use an AI agent system (book_rag_agent) with advanced language model to generate contextual answers based on retrieved content
- **FR-009**: System MUST support selected-text QA where answers are grounded only in user-selected text
- **FR-010**: System MUST log all user interactions to a persistent database
- **FR-011**: System MUST provide an endpoint to regenerate content embeddings from book files
- **FR-012**: System MUST provide a POST `/chat` endpoint that accepts message, selected_text, and session_id parameters
- **FR-013**: System MUST use the content retrieval tool with appropriate parameters for all retrievals
- **FR-014**: System MUST ensure the agent always retrieves content before answering
- **FR-015**: System MUST ensure the agent only answers from retrieved content and never hallucinates
- **FR-016**: System MUST ensure the agent always includes citations in responses
- **FR-017**: System MUST ensure the agent ignores all external/world knowledge
- **FR-018**: System MUST use documentation resources to ensure proper agent configuration during development

### Key Entities *(include if feature involves data)*

- **Question**: A user query submitted to the RAG system, containing text and optional metadata
- **Retrieved Context**: A set of relevant text chunks retrieved from the content database based on question similarity
- **Answer**: A response generated by the OpenAI agent based on retrieved context and original question
- **Embedding**: Semantic representation of text content stored for similarity search
- **Log Entry**: Record of user interaction including question, response, timestamp, and user session
- **Book Content Chunk**: Processed segment of book content with metadata (file path, section, chapter, chunk index)
- **Floating Chat Icon**: UI element that remains visible on all book pages and provides access to the chat interface
- **Session ID**: Unique identifier for tracking user conversation history across multiple interactions
- **Content Retrieval Tool**: Function tool that retrieves information from book content database with query parameters
- **Agent (book_rag_agent)**: AI agent with advanced language model and specific instructions to avoid hallucination and use only provided content

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The floating chatbot icon is visible and accessible on 100% of book pages regardless of scroll position
- **SC-002**: Users can access the chat interface by clicking the floating icon within 1 second of the page load
- **SC-003**: Users receive relevant answers to their questions 90% of the time when asking about book content
- **SC-004**: The system processes user queries within 10 seconds for 95% of requests under normal load conditions
- **SC-005**: The selected-text QA functionality provides accurate responses based only on the selected text 95% of the time
- **SC-006**: System maintains 99% uptime for the core question-answering functionality during business hours
- **SC-007**: Content indexing process completes successfully within 30 minutes for a book with 1000 pages of content
- **SC-008**: Users rate the helpfulness of answers as 4 or higher out of 5 in satisfaction surveys
- **SC-009**: The system captures 100% of user interactions for audit and analytics purposes
- **SC-010**: The AI system achieves 95% accuracy in providing answers grounded only in book content without hallucination