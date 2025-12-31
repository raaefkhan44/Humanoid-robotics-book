#!/bin/bash

# AI Chatbot System Diagnostic Script

echo "========================================"
echo "AI CHATBOT SYSTEM DIAGNOSTIC"
echo "========================================"
echo ""

# Check if backend is running
echo "[1] Checking Backend Server..."
if curl -s http://127.0.0.1:8000/api/health > /dev/null 2>&1; then
    echo "  ✓ Backend is RUNNING on port 8000"
    curl -s http://127.0.0.1:8000/api/health | python -m json.tool 2>/dev/null | head -10
else
    echo "  ✗ Backend is NOT RUNNING"
    echo "    Start it with: npm run start-backend"
    exit 1
fi

echo ""

# Check if frontend is running
echo "[2] Checking Frontend Server..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "  ✓ Frontend is RUNNING on port 3000"
else
    echo "  ✗ Frontend is NOT RUNNING"
    echo "    Start it with: npm start"
    exit 1
fi

echo ""

# Test chat endpoint
echo "[3] Testing Chat Endpoint..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://127.0.0.1:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is ROS 2?"}')

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo "  ✓ Chat endpoint returns 200 OK"
    echo "    Answer length: $(echo "$BODY" | python -c "import sys, json; data=json.load(sys.stdin); print(len(data.get('answer', '')))" 2>/dev/null || echo "N/A") characters"
    echo "    Sources count: $(echo "$BODY" | python -c "import sys, json; data=json.load(sys.stdin); print(len(data.get('sources', [])))" 2>/dev/null || echo "N/A")"
else
    echo "  ✗ Chat endpoint returns $HTTP_CODE"
    echo "    Response: $BODY"
    exit 1
fi

echo ""

# Check Qdrant
echo "[4] Checking Qdrant Data..."
echo "    Running: cd backend && python verify_qdrant.py"
echo "    (This may take a few seconds...)"
cd backend && python verify_qdrant.py > /tmp/qdrant_check.log 2>&1

if [ $? -eq 0 ]; then
    echo "  ✓ Qdrant verification PASSED"
    grep "Vector count:" /tmp/qdrant_check.log | head -1 || echo "    Check /tmp/qdrant_check.log for details"
else
    echo "  ✗ Qdrant verification FAILED"
    echo "    Check /tmp/qdrant_check.log for details"
    exit 1
fi

cd ..

echo ""
echo "========================================"
echo "✓ ALL SYSTEMS OPERATIONAL"
echo "========================================"
echo ""
echo "Your chatbot should be working!"
echo ""
echo "Next steps:"
echo "  1. Open: http://localhost:3000"
echo "  2. Look for blue chat button (bottom-right)"
echo "  3. Click and ask: 'What is ROS 2?'"
echo "  4. Open browser console (F12) to see logs"
echo ""
echo "If you see 404 errors, check the console for:"
echo "  [BookChatbot] Sending request: ..."
echo "  [BookChatbot] Response status: ..."
echo ""
