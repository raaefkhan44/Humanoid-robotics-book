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