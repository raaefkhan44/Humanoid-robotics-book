---
id: 1
title: rag-chatbot-planning
stage: plan
date: 2025-12-10
surface: agent
model: claude-sonnet-4-5-20250929
feature: rag-chatbot
branch: 1-rag-chatbot
user: asrak
command: /sp.plan
labels: [planning,architecture,rag,chatbot]
links:
  spec: specs/1-rag-chatbot/spec.md
  plan: specs/1-rag-chatbot/plan.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/1-rag-chatbot/plan.md
  - specs/1-rag-chatbot/research.md
  - specs/1-rag-chatbot/data-model.md
  - specs/1-rag-chatbot/quickstart.md
  - specs/1-rag-chatbot/contracts/api-contract.md
tests:
  - architecture plan validated
  - data models defined
  - API contracts specified
---

## Prompt

### Create
Architecture sketch, section structure, research approach, quality validation plan for Task 2 — RAG Chatbot Integration using FastAPI, Qdrant, Neon, Docusaurus, and OpenAI Agents SDK with Context7 MCP Server.

---

## 1. Architecture Sketch

### System Diagram (High-Level)

Frontend (Docusaurus)
→ Chat Widget (React)
→ FastAPI Backend
→ RAG Pipeline
→ Qdrant Cloud (vector search)
→ Neon Postgres (chat logs + analytics)

Agent La 3.3 Selected-Text QA
- Capture DOM selection
- Send as "restricted context" to backend
- Agent system prompt must enforce:
> *You must only answer using the provided user-selected text.*

### 3.4 Chat Logging & Analytics
- Store logs in Neon for:
- User query
- Agent answer
- Context used
- Mode (`full` or `selected`)
- Timestamps

### 3.5 Deployment Research
- Ensure FastAPI supports CORS for Docusaurus domain
- Test Qdrant latency
- Ensure Neon connection pooling
- Use Async IO for improved performance

---

## 4. Quality Validation

### 4.1 RAG Validation
- Check retrieval relevance scores
- Inspector: returned payloads contain correct chunk text
- Validate embeddings integrity via random spot-check

### 4.2 Agent Behavior Validation
- Confirm agent loads SDK documentation via MCP
- Confirm tools registered properly:
- Retrieval tool
- Logging tool
- Selected-text tool

### 4.3 Functional Testing
- Full-book answering test
- Selected-text QA test
- Multi-turn conversation test
- Source grounding test
- Citation requirement test (optional)

### 4.4 Integration Testing
- API returns < 3 seconds
- Qdrant search < 1.2 seconds
- Neon inserts < 100 ms

### 4.5 Frontend Usability Test
- Widget UI responsiveness
- Selection-to-answer accuracy
- Mobile layout
- Error notifications

---

## 5. Decisions Needing Documentation

1. **Embedding Model Choice**
- `text-embedding-3-small` vs `text-embedding-3-large`

2. **Chunk Size Strategy**
- Sentence splitter?
- Character-based?
- Token window?

3. **Qdrant Re-Ranking**
- Should we enable hybrid retrieval?
- Should we integrate an LLM re-ranker?

4. **Streaming Answers**
- Should the frontend support streaming?

5. **Deployment Target**
- Railway vs Render vs Fly.io

6. **Agent Prompt Strategy**
- How strict grounding should be?
- Should MCP documentation be injected directly or summarized?

7. **UI Placement**
- Floating widget vs sidebar assistant.

## Response snapshot

# Implementation Plan: RAG Chatbot for Docusaurus Book

**Branch**: `1-rag-chatbot` | **Date**: 2025-12-10 | **Spec**: [specs/1-rag-chatbot/spec.md](specs/1-rag-chatbot/spec.md)
**Input**: Feature specification from `/specs/1-rag-chatbot/spec.md`

## Summary

Implementation of a Retrieval-Augmented Generation (RAG) chatbot for the Docusaurus-based unified book project using FastAPI backend, Qdrant Cloud for vector search, Neon Serverless Postgres for logging, and OpenAI Agents SDK for question answering. The system supports both full-book RAG mode and selected-text QA functionality where users can highlight text and ask questions about only that content.

## Technical Context

**Language/Version**: Python 3.11, JavaScript/TypeScript for frontend integration
**Primary Dependencies**: FastAPI, OpenAI Python SDK, Qdrant Python client, asyncpg/SQLAlchemy for Neon Postgres, Langchain for document processing
**Storage**: Qdrant Cloud for vector embeddings, Neon Serverless Postgres for chat logs and analytics
**Testing**: pytest for backend, Jest for frontend components
**Target Platform**: Linux server (backend), Web browser (frontend)
**Project Type**: Web application with separate backend API and Docusaurus frontend integration
**Performance Goals**: <3 seconds for query response, <1.2 seconds for Qdrant search, <100ms for Neon inserts
**Constraints**: <200ms p95 for API responses, <100MB memory for typical usage, must handle concurrent users
**Scale/Scope**: Support 1000+ book pages, 100+ concurrent users, 1M+ embeddings in vector store

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **Technical Accuracy**: RAG system must perform accurate retrieval and grounded answers as per constitution principle #31
2. **Validated Code Examples**: All backend APIs and frontend integration code must be validated and runnable
3. **RAG System Integration**: Chatbot answers must cite book sections and support text-selection queries as required by constitution
4. **Technology Stack Compliance**: Using FastAPI backend with OpenAI Agents/ChatKit integration as specified in constitution

## Project Structure

### Documentation (this feature)

```text
specs/1-rag-chatbot/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   ├── embedding_models.py
│   │   ├── chat_models.py
│   │   └── log_models.py
│   ├── services/
│   │   ├── rag_service.py
│   │   ├── embedding_service.py
│   │   ├── agent_service.py
│   │   ├── qdrant_service.py
│   │   ├── postgres_service.py
│   │   └── mcp_client.py
│   ├── api/
│   │   ├── routes/
│   │   │   ├── query_routes.py
│   │   │   ├── embed_routes.py
│   │   │   └── log_routes.py
│   │   └── main.py
│   ├── config/
│   │   ├── settings.py
│   │   └── database.py
│   └── utils/
│       ├── document_parser.py
│       └── text_chunker.py
└── tests/
    ├── unit/
    ├── integration/
    └── contract/

src/components/
├── ChatWidget/
│   ├── ChatWidget.tsx
│   ├── ChatWindow.tsx
│   ├── Message.tsx
│   └── SelectionHandler.tsx
└── hooks/
    └── useChat.ts
```

**Structure Decision**: Web application with separate backend API service and Docusaurus frontend integration. Backend handles all RAG processing, embeddings, and agent operations, while frontend provides the chat interface and text selection capabilities.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [N/A] | [No violations identified] | [All constitution requirements met] |

# Research: RAG Chatbot Implementation

## Decision: Embedding Model Choice
**Rationale**: After researching OpenAI's embedding models, `text-embedding-3-small` is recommended for this use case. It provides good performance at a lower cost compared to `text-embedding-3-large`. The smaller model is sufficient for book content retrieval where semantic similarity is more important than fine-grained differences.
**Alternatives considered**:
- `text-embedding-3-large`: Higher dimensional embeddings but significantly more expensive
- Sentence Transformers: Open-source alternatives but require more infrastructure management

## Decision: Chunk Size Strategy
**Rationale**: Using a character-based chunking strategy with 512-1024 character chunks and 100-character overlap. This balances context preservation with retrieval precision. Sentence-based chunking can result in very variable chunk sizes, while token-based chunking adds complexity without significant benefit for this use case.
**Alternatives considered**:
- Sentence splitter: Creates variable-sized chunks that might be too small or too large
- Fixed token windows: More complex to implement, requires tokenization library

## Decision: Qdrant Re-Ranking
**Rationale**: For the initial implementation, standard cosine similarity search in Qdrant is sufficient. Hybrid retrieval and LLM re-ranking add complexity and cost without guaranteed benefit for book content where semantic search performs well. These can be added as enhancements later.
**Alternatives considered**:
- Hybrid retrieval: Combines keyword and semantic search but adds complexity
- LLM re-ranker: More expensive and potentially overkill for book content

## Decision: Streaming Answers
**Rationale**: Streaming answers will be implemented in the frontend to improve user experience. FastAPI supports async streaming responses, and the OpenAI API supports streaming. This provides a more responsive experience as answers are generated.
**Alternatives considered**:
- Non-streaming: Simpler to implement but worse user experience
- Client-side buffering: Adds complexity without clear benefits

## Decision: Deployment Target
**Rationale**: Deploying to Railway is recommended for this project. It offers good Python support, easy PostgreSQL integration with Neon, and appropriate scaling for a book chatbot application. Render and Fly.io are also viable but Railway has better Python/PostgreSQL integration.
**Alternatives considered**:
- Render: Good alternative but slightly more complex Python configuration
- Fly.io: Good for global distribution but overkill for this use case

## Decision: Agent Prompt Strategy
**Rationale**: The MCP documentation will be summarized and injected into the agent's system prompt rather than full injection. This provides the agent with relevant documentation without overwhelming it with excessive context. The grounding rules will be explicit in the system prompt.
**Alternatives considered**:
- Full documentation injection: Would exceed context limits
- No documentation injection: Would miss the benefit of MCP server

## Decision: UI Placement
**Rationale**: A floating widget is recommended for the chat interface. It provides easy access without cluttering the main content area and can be easily toggled on/off. This is the standard pattern for chatbot integrations in documentation sites.
**Alternatives considered**:
- Sidebar assistant: Would take up valuable screen real estate in documentation
- Dedicated page: Less convenient for users reading the book

# Data Model: RAG Chatbot for Docusaurus Book

## Entity: Question
**Description**: A user query submitted to the RAG system
**Fields**:
- `id`: Unique identifier (UUID/string)
- `content`: The text of the user's question (string, required)
- `timestamp`: When the question was submitted (datetime, required)
- `session_id`: Identifier for the conversation session (string, optional)
- `source_mode`: How the question was submitted ('full' for full-book RAG, 'selected' for selected-text QA) (string, required)

## Entity: Book Content Chunk
**Description**: Processed segment of book content with metadata
**Fields**:
- `id`: Unique identifier (UUID/string)
- `content`: The text content of the chunk (string, required)
- `embedding`: Vector representation of the content (array/float, required)
- `file_path`: Path to the source markdown file (string, required)
- `section`: Section title where this chunk appears (string, optional)
- `chapter`: Chapter name/number (string, optional)
- `chunk_index`: Position of this chunk within the document (integer, required)
- `metadata`: Additional metadata (object, optional)

## Entity: Retrieved Context
**Description**: A set of relevant text chunks retrieved from the vector database
**Fields**:
- `question_id`: Reference to the original question (string, required)
- `chunks`: Array of relevant content chunks (array of Book Content Chunk references, required)
- `relevance_scores`: Similarity scores for each chunk (array of floats, required)
- `retrieval_timestamp`: When the retrieval was performed (datetime, required)

## Entity: Answer
**Description**: A response generated by the OpenAI agent based on retrieved context
**Fields**:
- `id`: Unique identifier (UUID/string)
- `question_id`: Reference to the original question (string, required)
- `content`: The text content of the answer (string, required)
- `timestamp`: When the answer was generated (datetime, required)
- `session_id`: Identifier for the conversation session (string, optional)
- `source_chunks`: References to the chunks that informed the answer (array of chunk IDs, optional)
- `confidence_score`: Agent's confidence in the answer (float, optional)

## Entity: Log Entry
**Description**: Record of user interaction including question, response, and metadata
**Fields**:
- `id`: Unique identifier (UUID/string)
- `question_id`: Reference to the question (string, required)
- `answer_id`: Reference to the answer (string, required)
- `user_session`: User session identifier (string, optional)
- `mode`: Operation mode ('full' or 'selected') (string, required)
- `timestamp`: When the interaction occurred (datetime, required)
- `user_feedback`: Optional user feedback on the answer quality (string, optional)

## Entity: Embedding Job
**Description**: Record of embedding generation jobs
**Fields**:
- `id`: Unique identifier (UUID/string)
- `status`: Current status of the job ('pending', 'processing', 'completed', 'failed') (string, required)
- `total_files`: Number of files to process (integer, required)
- `processed_files`: Number of files processed (integer, required)
- `total_embeddings`: Total number of embeddings generated (integer, required)
- `start_time`: When the job started (datetime, required)
- `end_time`: When the job completed (datetime, optional)
- `error_message`: Error details if job failed (string, optional)

## Relationships

- Question → 0..1 Answer (one-to-one, optional on Answer)
- Question → 1..* Retrieved Context (one-to-many)
- Retrieved Context → 1..* Book Content Chunk (one-to-many)
- Answer → 1 Log Entry (one-to-one)
- Log Entry → 1 Question (one-to-one)
- Log Entry → 1 Answer (one-to-one)

## Validation Rules

- Question content must be between 5 and 1000 characters
- Book Content Chunk content must be between 50 and 2000 characters
- Embedding vectors must match the expected dimension for the chosen model
- Timestamps must be in valid datetime format
- File paths must be valid relative paths within the book content directory
- Session IDs must follow the format /[a-zA-Z0-9-_]+/
- Source mode must be either 'full' or 'selected'

## State Transitions (for Embedding Job)

- `pending` → `processing` (when job starts)
- `processing` → `completed` (when all files processed successfully)
- `processing` → `failed` (when error occurs during processing)
- `pending` → `failed` (when validation fails before processing)

# Quickstart: RAG Chatbot for Docusaurus Book

## Prerequisites

- Python 3.11+
- Node.js 18+ (for Docusaurus development)
- Qdrant Cloud account (free tier sufficient)
- Neon Serverless Postgres account
- OpenAI API key
- Access to Context7 MCP Server for OpenAI Agent SDK documentation

## Environment Setup

1. **Create virtual environment and install backend dependencies:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install fastapi uvicorn openai qdrant-client python-dotenv sqlalchemy asyncpg langchain-community langchain-openai
```

2. **Create `.env` file with required environment variables:**
```env
OPENAI_API_KEY=your_openai_api_key
QDRANT_URL=your_qdrant_cluster_url
QDRANT_API_KEY=your_qdrant_api_key
NEON_DATABASE_URL=postgresql+asyncpg://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
CONTEXT7_MCP_SERVER_URL=your_context7_mcp_server_url
```

## Backend Setup

1. **Initialize Qdrant collection for embeddings:**
```python
from qdrant_client import QdrantClient
from qdrant_client.http import models

client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

# Create collection for book content chunks
client.recreate_collection(
    collection_name="book_content",
    vectors_config=models.VectorParams(size=1536, distance=models.Distance.COSINE),  # For text-embedding-3-small
    # Add any additional configuration as needed
)
```

2. **Initialize Neon Postgres tables:**
```sql
-- Create tables for chat logs and analytics
CREATE TABLE IF NOT EXISTS chat_logs (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    context_used TEXT,
    mode VARCHAR(20) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS embedding_jobs (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL,
    total_files INTEGER,
    processed_files INTEGER,
    total_embeddings INTEGER,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    error_message TEXT
);
```

3. **Start the FastAPI backend:**
```bash
cd backend
uvicorn src.api.main:app --reload --port 8000
```

## Frontend Integration

1. **Install frontend dependencies in your Docusaurus project:**
```bash
npm install axios @types/react
```

2. **Add the chat widget to your Docusaurus layout:**
```jsx
// In your Docusaurus layout or as a plugin
import ChatWidget from '../components/ChatWidget/ChatWidget';

// Add to your layout
<ChatWidget backendUrl="http://localhost:8000" />
```

3. **Implement text selection handler:**
```javascript
// Add to your Docusaurus pages to enable text selection functionality
document.addEventListener('mouseup', function() {
    const selection = window.getSelection();
    if (selection.toString().trim()) {
        // Pass selected text to chat widget
        window.dispatchEvent(new CustomEvent('textSelected', {
            detail: { text: selection.toString().trim() }
        }));
    }
});
```

## Initial Data Setup

1. **Parse and embed book content:**
```bash
# Run the embedding script to process all MD files
python -m src.services.embedding_service --source-path ./docs --collection-name book_content
```

2. **Verify embeddings were created:**
```bash
curl -X GET "http://localhost:8000/embeddings/count"
```

## Testing the System

1. **Test full-book RAG query:**
```bash
curl -X POST "http://localhost:8000/query" \
  -H "Content-Type: application/json" \
  -d '{"question": "What are the key concepts in Chapter 1?"}'
```

2. **Test selected-text QA:**
```bash
curl -X POST "http://localhost:8000/select-query" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Explain this concept?",
    "selected_text": "The concept of RAG involves retrieval and generation..."
  }'
```

3. **Verify logs are being stored:**
```bash
curl -X GET "http://localhost:8000/logs?limit=10"
```

## Development Workflow

1. **Run backend with auto-reload:**
```bash
uvicorn src.api.main:app --reload
```

2. **Run Docusaurus development server:**
```bash
npm run start
```

3. **Run tests:**
```bash
# Backend tests
python -m pytest tests/

# Frontend tests
npm run test
```

## Configuration Options

- **Qdrant settings**: Adjust vector dimensions based on embedding model used
- **OpenAI agent settings**: Configure temperature, max tokens, and system prompt
- **CORS settings**: Configure allowed origins in FastAPI app
- **Database connection pooling**: Adjust pool size based on expected load

## Troubleshooting

- **Qdrant connection issues**: Verify URL and API key in environment variables
- **Slow queries**: Check that embeddings are properly indexed and Qdrant is configured correctly
- **Agent not responding**: Verify OpenAI API key and check rate limits
- **Frontend not connecting**: Check CORS configuration and backend URL in frontend

# API Contract: RAG Chatbot Service

## Overview
This document defines the API contracts for the RAG Chatbot service that integrates with the Docusaurus-based book project. The service provides both full-book RAG and selected-text QA functionality.

## Base URL
`http://localhost:8000` (development) or your deployed backend URL

## Common Headers
- `Content-Type: application/json`
- `Accept: application/json`

## Endpoints

### POST /embed
Regenerate embeddings from all MD files and push to vector database.

#### Request
```json
{
  "source_path": "/path/to/book/content",
  "collection_name": "book_content"
}
```

#### Response (200 OK)
```json
{
  "status": "processing|completed|failed",
  "job_id": "string",
  "total_files": 120,
  "message": "Embedding job started successfully"
}
```

#### Response (400 Bad Request)
```json
{
  "error": "string",
  "details": "string"
}
```

### POST /query
Accept a question and return a RAG-enhanced answer based on book content.

#### Request
```json
{
  "question": "What are the key principles of ROS 2?",
  "session_id": "optional-session-identifier"
}
```

#### Response (200 OK)
```json
{
  "question": "What are the key principles of ROS 2?",
  "answer": "The key principles of ROS 2 include...",
  "sources": [
    {
      "file_path": "docs/module1-ros2-nervous-system/chapter-2-core-concepts.md",
      "section": "Core Concepts",
      "relevance_score": 0.85
    }
  ],
  "session_id": "optional-session-identifier",
  "timestamp": "2025-12-10T10:30:00Z"
}
```

#### Response (400 Bad Request)
```json
{
  "error": "Question is required",
  "details": "The question field cannot be empty"
}
```

### POST /select-query
Accept a question and selected text, return an answer based only on the provided text.

#### Request
```json
{
  "question": "Explain this concept?",
  "selected_text": "The concept of RAG involves retrieval and generation...",
  "session_id": "optional-session-identifier"
}
```

#### Response (200 OK)
```json
{
  "question": "Explain this concept?",
  "answer": "Based on the provided text, the concept refers to...",
  "sources": [],
  "session_id": "optional-session-identifier",
  "timestamp": "2025-12-10T10:30:00Z"
}
```

#### Response (400 Bad Request)
```json
{
  "error": "Both question and selected_text are required",
  "details": "The request must include both question and selected_text fields"
}
```

### GET /logs
Retrieve paginated chat logs from the database.

#### Query Parameters
- `limit` (optional, default: 20): Number of logs to return
- `offset` (optional, default: 0): Number of logs to skip
- `mode` (optional): Filter by mode ('full' or 'selected')

#### Response (200 OK)
```json
{
  "logs": [
    {
      "id": 1,
      "question": "What are the key principles of ROS 2?",
      "answer": "The key principles of ROS 2 include...",
      "mode": "full",
      "timestamp": "2025-12-10T10:30:00Z"
    }
  ],
  "total": 150,
  "limit": 20,
  "offset": 0
}
```

### GET /health
Check the health status of the service.

#### Response (200 OK)
```json
{
  "status": "healthy",
  "timestamp": "2025-12-10T10:30:00Z",
  "dependencies": {
    "qdrant": "connected",
    "postgres": "connected",
    "openai": "reachable"
  }
}
```

### GET /embeddings/count
Get the total count of embeddings in the vector database.

#### Response (200 OK)
```json
{
  "count": 1250,
  "collection_name": "book_content",
  "timestamp": "2025-12-10T10:30:00Z"
}
```

## Error Responses
All error responses follow this standard format:
```json
{
  "error": "Error message",
  "details": "Detailed error information",
  "timestamp": "2025-12-10T10:30:00Z",
  "request_id": "unique-request-id"
}
```

## Authentication
This API does not require authentication for basic operations. For production deployments, consider implementing API key authentication.

## Rate Limiting
The API implements rate limiting to prevent abuse:
- 100 requests per minute per IP address
- 10 requests per minute for embedding operations

## Outcome

- ✅ Impact: Created comprehensive implementation plan with architecture, data models, API contracts, and quickstart guide for RAG chatbot
- 🧪 Tests: All planning artifacts validated and documented
- 📁 Files: Created plan.md, research.md, data-model.md, quickstart.md, and API contract in specs/1-rag-chatbot/
- 🔁 Next prompts: Ready for /sp.tasks to generate implementation tasks
- 🧠 Reflection: Planning phase completed successfully with all technical decisions documented and architecture validated against constitution requirements

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): All constitution checks passed
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Generate tasks from this plan to begin implementation