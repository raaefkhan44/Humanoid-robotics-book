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