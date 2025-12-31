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