# AI Chatbot Setup & Running Guide

## Overview

Your Physical AI & Humanoid Robotics Textbook now has a **fully integrated RAG-powered AI chatbot** that appears on every page. This guide explains how to run and verify the complete system.

## Architecture

### Frontend
- **Framework**: Docusaurus (React-based)
- **Chatbot UI**: Custom React/TypeScript component with Tailwind CSS
- **Location**: Floating button (bottom-right) on all pages
- **Features**:
  - Floating chat icon with pulse animation
  - Modern chat interface with gradient design
  - Text selection support
  - Source citations from the book
  - Dark mode support
  - Session persistence

### Backend
- **Framework**: FastAPI (Python)
- **AI Model**: Google Gemini 2.5 Flash
- **Embeddings**: Cohere `embed-multilingual-v3.0`
- **Vector DB**: Qdrant Cloud
- **Features**:
  - RAG (Retrieval-Augmented Generation)
  - Context-aware responses
  - Source citations with relevance scores
  - Rate limiting & request validation
  - Session management

## Prerequisites

### Required Environment Variables

Create a `.env` file in the `backend/` directory with:

```env
# AI Models
GEMINI_API_KEY=your_gemini_api_key_here
COHERE_API_KEY=your_cohere_api_key_here

# Vector Database
QDRANT_URL=https://your-qdrant-cluster.qdrant.io
QDRANT_API_KEY=your_qdrant_api_key_here

# Database (Optional - for logging)
NEON_DATABASE_URL=postgresql+asyncpg://user:pass@host/db
```

### Get API Keys

1. **Gemini API** (Free tier available): https://ai.google.dev/
2. **Cohere API** (Free tier available): https://cohere.com/
3. **Qdrant Cloud** (Free tier available): https://cloud.qdrant.io/

## Installation

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
cd ..
```

## Running the System

### Option 1: Run Everything Together (Recommended)

This command starts both the frontend and backend simultaneously:

```bash
npm run start-all
```

This will:
- Start the backend API server on `http://127.0.0.1:8000`
- Start the Docusaurus frontend on `http://localhost:3000`
- Both services run in the same terminal with color-coded output

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
npm run start-backend
# or
cd backend && python -m uvicorn src.api.main:app --host 127.0.0.1 --port 8000 --reload
```

**Terminal 2 - Frontend:**
```bash
npm start
```

## Embedding Book Content

Before using the chatbot, you need to embed the book content into the vector database:

### Option 1: Using the Embedding Script

```bash
python run_embedding.py
```

This script will:
1. Start a temporary backend server on port 8001
2. Scan all markdown files in the `docs/` directory
3. Process and embed them into Qdrant
4. Show progress and confirmation

### Option 2: Manual API Call

If the backend is already running on port 8000:

```bash
curl -X POST http://127.0.0.1:8000/api/embed \
  -H "Content-Type: application/json" \
  -d '{"source_path": "docs", "collection_name": "book_content"}'
```

## Verifying the Installation

### 1. Check Backend Health

```bash
curl http://127.0.0.1:8000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-20T...",
  "services": {
    "gemini": "connected",
    "cohere": "connected",
    "qdrant": "connected"
  }
}
```

### 2. Check Frontend

1. Open your browser to `http://localhost:3000`
2. Navigate to any page in the book
3. Look for the **blue floating chat button** in the bottom-right corner
4. Click it to open the chat interface

### 3. Test the Chatbot

1. Click the floating chat icon
2. Type a question like "What is ROS 2?"
3. The chatbot should:
   - Show a "Thinking..." animation
   - Return an answer based on your book content
   - Display source citations from the book
   - Show relevance scores for each source

## Features Guide

### Floating Chat Icon
- **Location**: Bottom-right corner of every page
- **Design**: Blue gradient circle with chat icon
- **Animation**: Pulsing indicator
- **Hover**: Shows "Ask about the book" tooltip

### Chat Interface
- **Size**: 400px × 600px
- **Header**: Gradient blue with "AI Book Assistant" title
- **Messages**:
  - User messages: Blue gradient, right-aligned
  - AI responses: White/gray, left-aligned
  - Timestamps on all messages
- **Sources**: Displayed below AI responses with relevance scores
- **Selected Text**: Shows highlighted text from the page as context

### Text Selection Feature
1. Select any text on the book page (minimum 10 characters)
2. The selected text appears in the chat as "Selected Context"
3. Ask a question about the selected text
4. The AI uses the selected text as additional context
5. Click the X to clear the selected text

### Session Persistence
- Chat history is maintained during navigation
- Session ID is stored in browser localStorage
- Chat context is preserved across page changes

## Troubleshooting

### Chatbot Not Visible

1. **Check Tailwind CSS is enabled**
   - Open `src/css/custom.css`
   - Ensure these lines are NOT commented out:
     ```css
     @tailwind base;
     @tailwind components;
     @tailwind utilities;
     ```

2. **Clear browser cache**
   - Hard reload: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

3. **Check console for errors**
   - Open DevTools (F12)
   - Look for any React or TypeScript errors

### Backend Connection Errors

1. **Verify backend is running**
   ```bash
   curl http://127.0.0.1:8000/api/health
   ```

2. **Check CORS settings**
   - Backend allows all origins by default in `src/api/main.py`

3. **Verify environment variables**
   ```bash
   cd backend
   python -c "from src.config.settings import settings; print(settings)"
   ```

### No Answers from Chatbot

1. **Verify embeddings are loaded**
   ```bash
   curl http://127.0.0.1:8000/api/embed/status
   ```

2. **Re-run embedding script**
   ```bash
   python run_embedding.py
   ```

3. **Check API keys**
   - Ensure all API keys in `.env` are valid
   - Check Qdrant cluster is accessible

### Rate Limiting

If you see "Rate limit exceeded" errors:
- Default limit: 60 requests per minute
- Wait 60 seconds and try again
- Or adjust rate limits in `backend/src/middleware/rate_limiter.py`

## API Endpoints

### Chat Endpoint
```
POST /api/chat
Content-Type: application/json

{
  "message": "What is ROS 2?",
  "selected_text": "optional highlighted text",
  "session_id": "optional_session_id"
}
```

Response:
```json
{
  "answer": "ROS 2 is...",
  "sources": [
    {
      "file_path": "docs/module1-ros2-nervous-system/chapter-1-introduction.md",
      "section": "Introduction to ROS 2",
      "relevance_score": 0.92
    }
  ],
  "session_id": "uuid-here"
}
```

### Health Check
```
GET /api/health
```

### Embedding
```
POST /api/embed
Content-Type: application/json

{
  "source_path": "docs",
  "collection_name": "book_content"
}
```

## File Structure

```
humanoid-robotics-book/
├── src/
│   ├── components/
│   │   └── BookChatbot.tsx          # Main chatbot component
│   ├── theme/
│   │   ├── Layout.js                # Global layout wrapper (mounts chatbot)
│   │   └── Root.tsx                 # Root component
│   └── css/
│       └── custom.css               # Custom styles + Tailwind imports
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── main.py             # FastAPI app
│   │   │   └── routes/
│   │   │       └── query_routes.py  # /api/chat endpoint
│   │   ├── agent.py                 # RAG agent logic
│   │   └── connection.py            # AI client connections
│   └── .env                         # Environment variables
├── docs/                            # Book content (Markdown files)
├── package.json
├── docusaurus.config.js
├── tailwind.config.js
├── start-all.js                     # Run both frontend + backend
└── run_embedding.py                 # Embed book content
```

## Development Tips

### Hot Reload
- Frontend: Automatic with Docusaurus
- Backend: Automatic with `--reload` flag

### Styling the Chatbot
- Component: `src/components/BookChatbot.tsx`
- Uses Tailwind utility classes
- Supports dark mode via Docusaurus theme

### Modifying AI Behavior
- RAG logic: `backend/src/agent.py`
- Prompt engineering: Update system prompts in `agent.py`
- Retrieval settings: Adjust `top_k` parameter

### Adding New Features
1. Update `BookChatbot.tsx` for UI changes
2. Update `query_routes.py` for API changes
3. Update `agent.py` for AI logic changes

## Production Deployment

### Frontend (Docusaurus)
```bash
npm run build
npm run serve
```

Deploy to: Vercel, Netlify, GitHub Pages, etc.

### Backend (FastAPI)
```bash
cd backend
uvicorn src.api.main:app --host 0.0.0.0 --port 8000
```

Deploy to: Railway, Render, AWS Lambda, Google Cloud Run, etc.

### Environment Variables
- Update CORS origins in production
- Use production URLs for API endpoints
- Secure all API keys

## Support

For issues or questions:
1. Check the console for errors (F12 in browser)
2. Check backend logs
3. Verify all API keys are valid
4. Ensure embeddings are loaded

## Summary

You now have a **fully functional RAG-powered AI chatbot** that:
- ✅ Appears on every page as a floating button
- ✅ Uses modern, professional UI design
- ✅ Answers questions from your book content only
- ✅ Shows source citations with relevance scores
- ✅ Supports text selection for context-aware Q&A
- ✅ Persists session across page navigation
- ✅ Powered by Gemini 2.5 Flash + Qdrant vector search

Enjoy your AI-powered textbook! 🎉
