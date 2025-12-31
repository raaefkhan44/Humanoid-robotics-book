# FIX 404 ERROR - Step-by-Step Debug Guide

## Current Status

**Backend**: ✅ RUNNING on http://127.0.0.1:8000
**Frontend**: ✅ RUNNING on http://localhost:3000
**Endpoint**: `/api/chat` exists and works via curl
**Problem**: Frontend getting 404 errors

---

## VERIFICATION COMPLETED

### ✅ Backend Route Exists
- Route: `POST /api/chat`
- Defined in: `backend/src/api/routes/query_routes.py`
- Mounted with prefix `/api` in `main.py`
- **Confirmed working** via curl test

### ✅ Frontend Makes Correct Request
- URL: `http://127.0.0.1:8000/api/chat`
- Method: POST
- Body: JSON with message field
- **Configuration is correct** in `BookChatbot.tsx`

### ✅ Backend Responds to Curl
```bash
curl -X POST http://127.0.0.1:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}'

Response: 200 OK with answer and sources
```

---

## ROOT CAUSE HYPOTHESIS

The 404 error you're seeing means:

**EITHER**:
1. You're testing with a DIFFERENT backend than the one I started
2. The browser is caching an old 404 response
3. There's a proxy/network issue between browser and backend
4. The frontend is running in production mode (not development)

---

## SOLUTION: DEBUG WITH TEST PAGE

I created `test_frontend_request.html` that mimics exactly what the chatbot does.

### Step 1: Open the Test Page
```bash
# Open this file in your browser:
test_frontend_request.html
```

### Step 2: Run Tests
1. Click "Test Development Mode Request"
2. Open Browser Console (F12)
3. Look for these logs:
   ```
   [TEST] Sending request to: http://127.0.0.1:8000/api/chat
   [TEST] Response status: 200
   [TEST] Response data: {answer: "...", sources: [...]}
   ```

### Step 3: Compare Results
- **If test page works**: Browser cache issue with main site
- **If test page fails**: Backend not reachable from browser

---

## ENHANCED LOGGING

I added request logging to the backend. Now every request will show:

```
🔵 INCOMING REQUEST: POST /api/chat
   Headers: {...}
✅ RESPONSE: 200 - POST /api/chat (2.5s)
```

### Check Backend Logs
The backend process should now log EVERY request it receives.

**If you don't see logs when clicking in the chatbot**:
→ The frontend request is NOT reaching the backend

**If you see logs with 404**:
→ Something is intercepting/redirecting the request

---

## DEBUG CHECKLIST

Run through these steps:

### 1. Verify Backend is YOUR Backend
```bash
curl http://127.0.0.1:8000/api/health
```
Should return: `{"status": "healthy", ...}`

### 2. Test Backend Endpoint
```bash
curl -X POST http://127.0.0.1:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is ROS 2?"}'
```
Should return: JSON with answer and sources

### 3. Open Test Page
Open `test_frontend_request.html` in browser and click "Test Development Mode Request"

### 4. Check Browser Console
Open DevTools (F12) → Console tab
Look for:
- `[TEST]` or `[BookChatbot]` log messages
- Network errors
- CORS errors

### 5. Check Network Tab
Open DevTools (F12) → Network tab
- Click chat button and send message
- Look for request to `/api/chat`
- Check status code
- Check response

### 6. Check Backend Logs
The backend terminal should show:
```
🔵 INCOMING REQUEST: POST /api/chat
```

**If you don't see this**: Frontend is calling a different backend or request not reaching it

---

## MOST LIKELY ISSUES & FIXES

### Issue 1: Browser Cache
**Symptom**: Test page works, but main site doesn't
**Fix**:
```
1. Open main site (localhost:3000)
2. Press Ctrl+Shift+R (hard reload)
3. Or: Clear browser cache
4. Or: Open incognito window
```

### Issue 2: Wrong Backend
**Symptom**: You're connected to a deployed backend, not local
**Check**: Look at console logs for the URL being called
**Fix**: Ensure NODE_ENV is 'development'

### Issue 3: Port Conflict
**Symptom**: Backend not responding
**Check**:
```bash
netstat -ano | grep ":8000"
```
**Fix**: Kill conflicting process and restart backend

### Issue 4: Frontend in Production Mode
**Symptom**: Calling relative `/api/chat` instead of `http://127.0.0.1:8000/api/chat`
**Check**: Console log shows `nodeEnv: "production"`
**Fix**: Ensure running with `npm start` (not `npm run serve`)

---

## STEP-BY-STEP DEBUGGING PROCEDURE

### Step 1: Test Backend Isolation
```bash
curl -X POST http://127.0.0.1:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}' | python -m json.tool
```

**Expected**: JSON response with answer
**If fails**: Backend is not running correctly

### Step 2: Test from Browser
Open `test_frontend_request.html` and run all tests

**Expected**: All tests pass
**If fails**: Network/CORS issue between browser and backend

### Step 3: Test Main Site
1. Open http://localhost:3000
2. Open Console (F12)
3. Click chat button
4. Send message
5. Watch console logs

**Look for**:
```javascript
[BookChatbot] Sending request: {
  url: "http://127.0.0.1:8000/api/chat",
  ...
}
```

### Step 4: Check Backend Logs
Look at backend terminal output

**Should see**:
```
🔵 INCOMING REQUEST: POST /api/chat
```

**If you don't see this**: Request not reaching backend

### Step 5: Check Network Tab
1. Open Network tab in DevTools
2. Send chat message
3. Look for `/api/chat` request
4. Click on it
5. Check:
   - Request URL
   - Status Code
   - Response

---

## EMERGENCY FIX: Direct Test

If nothing else works, create this test:

1. Open browser console on http://localhost:3000
2. Paste this code:
```javascript
fetch('http://127.0.0.1:8000/api/chat', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({message: 'test'})
})
.then(r => r.json())
.then(data => console.log('SUCCESS:', data))
.catch(err => console.error('ERROR:', err))
```
3. Press Enter

**If this works**: The backend is fine, issue is in chatbot component
**If this fails**: Network/CORS issue

---

## WHAT I VERIFIED

| Check | Status | Details |
|-------|--------|---------|
| Backend Running | ✅ | Port 8000 |
| Route Exists | ✅ | POST /api/chat |
| Curl Test | ✅ | 200 OK |
| Frontend Config | ✅ | Correct URL |
| CORS Enabled | ✅ | Allow all origins |
| Logging Added | ✅ | Request tracking |

---

## NEXT STEPS FOR YOU

1. **Open test page**: `test_frontend_request.html`
2. **Run Test 1**: "Test Development Mode Request"
3. **Check result**:
   - If SUCCESS → Backend works, browser cache issue
   - If FAIL → Note the error message

4. **Open main site**: http://localhost:3000
5. **Open Console** (F12)
6. **Click chatbot** and send message
7. **Copy all console logs** and share them

8. **Check backend terminal**
9. **Look for** `🔵 INCOMING REQUEST` logs
10. **If you don't see them** → Request not reaching backend

---

## FILES FOR DEBUGGING

- `test_frontend_request.html` - Standalone test page
- `DEBUG_REPORT.md` - Complete system verification
- `SYSTEM_RUNNING.md` - Current status
- This file - 404 troubleshooting guide

---

## CONTACT POINTS

The issue is ONE of these:

1. **Browser cache** → Hard reload
2. **Wrong backend** → Check URL in logs
3. **Network issue** → Test page will show
4. **Frontend mode** → Check NODE_ENV in logs

**The backend IS working** (verified via curl).
**The frontend config IS correct** (verified in code).
**The issue is in the connection between them.**

Use the test page to isolate where the problem is!
