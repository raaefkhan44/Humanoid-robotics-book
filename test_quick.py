"""Quick system test - synchronous version"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Fix encoding for Windows
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        pass

# Load env
load_dotenv()

print("\n" + "="*60)
print("QUICK SYSTEM TEST")
print("="*60 + "\n")

# Test 1: Environment Variables
print("1. ENVIRONMENT VARIABLES:")
print("-" * 40)
env_vars = ["COHERE_API_KEY", "GEMINI_API_KEY", "QDRANT_URL", "QDRANT_API_KEY"]
for var in env_vars:
    val = os.getenv(var)
    if val:
        masked = f"{val[:8]}...{val[-4:]}" if len(val) > 12 else "***"
        print(f"[OK] {var}: {masked}")
    else:
        print(f"[FAIL] {var}: NOT FOUND")

# Test 2: Qdrant Connection
print("\n2. QDRANT CONNECTION:")
print("-" * 40)
try:
    from qdrant_client import QdrantClient

    client = QdrantClient(
        url=os.getenv("QDRANT_URL"),
        api_key=os.getenv("QDRANT_API_KEY")
    )

    collections = client.get_collections()
    print(f"[OK] Connected to Qdrant")
    print(f"     Collections: {[c.name for c in collections.collections]}")

    # Check book_embeddings collection
    try:
        info = client.get_collection("book_embeddings")
        print(f"[OK] Collection 'book_embeddings' exists")
        print(f"     Points: {info.points_count}")
        print(f"     Vector size: {info.config.params.vectors.size}")
    except Exception as e:
        print(f"[FAIL] Collection check failed: {e}")

except Exception as e:
    print(f"[FAIL] Qdrant connection failed: {e}")

# Test 3: Cohere Embedding
print("\n3. COHERE EMBEDDING:")
print("-" * 40)
try:
    import cohere

    co = cohere.Client(os.getenv("COHERE_API_KEY"))

    response = co.embed(
        texts=["test query"],
        model="embed-multilingual-v3.0",
        input_type="search_query"
    )

    embedding = response.embeddings[0]
    print(f"[OK] Cohere embedding generated")
    print(f"     Dimension: {len(embedding)}")
    print(f"     First 3 values: {embedding[:3]}")

except Exception as e:
    print(f"[FAIL] Cohere failed: {e}")

# Test 4: Gemini API
print("\n4. GEMINI API:")
print("-" * 40)
try:
    import google.generativeai as genai

    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel('gemini-2.5-flash')

    response = model.generate_content("Say 'working' in one word")
    answer = response.text if hasattr(response, 'text') else str(response)

    print(f"[OK] Gemini API working")
    print(f"     Response: {answer.strip()}")

except Exception as e:
    error_str = str(e)
    if "429" in error_str or "quota" in error_str.lower():
        print(f"[FAIL] Gemini API: QUOTA EXCEEDED")
        print(f"       Free tier limit: 20 requests/day")
        print(f"       Wait for reset or get new API key")
    else:
        print(f"[FAIL] Gemini API failed: {error_str[:100]}")

# Test 5: Qdrant Search with Real Query
print("\n5. QDRANT SEARCH TEST:")
print("-" * 40)
try:
    import cohere
    from qdrant_client import QdrantClient

    # Generate embedding for test query
    co = cohere.Client(os.getenv("COHERE_API_KEY"))
    test_query = "What is ROS 2?"

    response = co.embed(
        texts=[test_query],
        model="embed-multilingual-v3.0",
        input_type="search_query"
    )
    query_embedding = response.embeddings[0]

    # Search Qdrant
    client = QdrantClient(
        url=os.getenv("QDRANT_URL"),
        api_key=os.getenv("QDRANT_API_KEY")
    )

    results = client.search(
        collection_name="book_embeddings",
        query_vector=query_embedding,
        limit=3
    )

    print(f"[OK] Search successful for: '{test_query}'")
    print(f"     Results found: {len(results)}")

    for i, result in enumerate(results):
        print(f"\n     Result {i+1}:")
        print(f"     - Score: {result.score:.4f}")
        print(f"     - Section: {result.payload.get('section', 'N/A')}")
        content = result.payload.get('content', 'N/A')
        print(f"     - Content: {content[:100]}...")

except Exception as e:
    print(f"[FAIL] Search test failed: {e}")

print("\n" + "="*60)
print("SUMMARY")
print("="*60)
print("\nKEY FINDINGS:")
print("- Embeddings (Cohere): Check status above")
print("- Vector DB (Qdrant): Check status above")
print("- LLM (Gemini): Check status above")
print("\nIf Gemini shows QUOTA EXCEEDED:")
print("  This is why chatbot returns error message")
print("  Solution: Wait for quota reset or use new API key")
print("="*60 + "\n")
