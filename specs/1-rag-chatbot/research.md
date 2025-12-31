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