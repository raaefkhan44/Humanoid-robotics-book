# Quick Start Guide - AI Chatbot

## 🚀 Start the Application

```bash
npm run start-all
```

This single command starts:
- Backend API server (port 8000)
- Frontend Docusaurus site (port 3000)

## 📚 Embed Book Content (First Time Only)

```bash
python run_embedding.py
```

This processes all markdown files in `docs/` and loads them into the vector database.

## ✅ Verify It's Working

1. Open browser: http://localhost:3000
2. Navigate to any page in the book
3. Look for the **blue floating chat button** in the bottom-right corner
4. Click the button to open the chat
5. Type a question: "What is ROS 2?"
6. You should get an answer with citations from the book

## 🎨 What You'll See

### Floating Icon
- Blue circular button (bottom-right corner)
- Pulsing animation
- Hover shows "Ask about the book"
- Click to open chat panel

### Chat Interface
- 400×600px modern chat window
- Gradient blue header
- User messages: Blue, right-aligned
- AI responses: White/gray, left-aligned
- Source citations below each answer
- Timestamps on all messages

## 🔧 Troubleshooting

### Chatbot Not Visible?
1. Clear browser cache: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Check browser console for errors (F12)
3. Verify Tailwind CSS is enabled in `src/css/custom.css`

### Backend Not Responding?
1. Check backend is running: `curl http://127.0.0.1:8000/api/health`
2. Verify `.env` file exists in `backend/` directory
3. Check all API keys are set in `.env`

### No Answers?
1. Run: `python run_embedding.py`
2. Verify embeddings loaded successfully
3. Check backend logs for errors

## 📖 Full Documentation

- **Setup Guide**: See `CHATBOT_SETUP.md`
- **Implementation Details**: See `CHATBOT_IMPLEMENTATION.md`

## 🎯 Key Features

✅ Floating chat icon on every page
✅ RAG-powered answers from book content only
✅ Source citations with relevance scores
✅ Text selection for context-aware Q&A
✅ Session persistence across pages
✅ Dark mode support
✅ Mobile responsive
✅ Professional, modern UI

## 🔑 Required Environment Variables

Create `backend/.env` with:

```env
GEMINI_API_KEY=your_key_here
COHERE_API_KEY=your_key_here
QDRANT_URL=your_qdrant_url_here
QDRANT_API_KEY=your_key_here
```

Get free API keys:
- Gemini: https://ai.google.dev/
- Cohere: https://cohere.com/
- Qdrant: https://cloud.qdrant.io/

## 💡 Tips

- **Select text** on any page to ask context-specific questions
- **Session persists** - chat history is maintained across page navigation
- **Citations** - every answer shows which parts of the book it came from
- **Keyboard shortcut** - Press Enter to send messages

Enjoy your AI-powered textbook! 🎉
