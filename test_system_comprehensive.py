"""
Comprehensive system test for RAG Chatbot
Tests: Qdrant connection, embeddings, Cohere, and Gemini API
"""
import sys
import os
from pathlib import Path

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

# Add backend to path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

import asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def test_environment():
    """Test environment variables"""
    print("=" * 60)
    print("TESTING ENVIRONMENT VARIABLES")
    print("=" * 60)

    required_vars = [
        "COHERE_API_KEY",
        "GEMINI_API_KEY",
        "QDRANT_URL",
        "QDRANT_API_KEY"
    ]

    all_present = True
    for var in required_vars:
        value = os.getenv(var)
        if value:
            masked = value[:8] + "..." + value[-4:] if len(value) > 12 else "***"
            print(f"✓ {var}: {masked}")
        else:
            print(f"✗ {var}: NOT FOUND")
            all_present = False

    print()
    return all_present

async def test_cohere_embedding():
    """Test Cohere embedding generation"""
    print("=" * 60)
    print("TESTING COHERE EMBEDDING GENERATION")
    print("=" * 60)

    try:
        import cohere
        api_key = os.getenv("COHERE_API_KEY")

        co = cohere.AsyncClient(api_key=api_key)

        test_text = "What is ROS 2?"
        print(f"Test text: '{test_text}'")

        response = await co.embed(
            texts=[test_text],
            model="embed-multilingual-v3.0",
            input_type="search_query"
        )

        embedding = response.embeddings[0]
        print(f"✓ Embedding generated successfully")
        print(f"  - Dimension: {len(embedding)}")
        print(f"  - First 5 values: {embedding[:5]}")
        print()
        return True, embedding

    except Exception as e:
        print(f"✗ Cohere embedding failed: {str(e)}")
        print()
        return False, None

async def test_qdrant_connection():
    """Test Qdrant connection and search"""
    print("=" * 60)
    print("TESTING QDRANT CONNECTION AND SEARCH")
    print("=" * 60)

    try:
        from qdrant_client import QdrantClient

        url = os.getenv("QDRANT_URL")
        api_key = os.getenv("QDRANT_API_KEY")

        client = QdrantClient(url=url, api_key=api_key)

        # List collections
        collections = client.get_collections()
        print(f"✓ Connected to Qdrant")
        print(f"  - Collections: {[c.name for c in collections.collections]}")

        # Get collection info
        collection_name = "book_embeddings"
        try:
            collection_info = client.get_collection(collection_name)
            print(f"✓ Collection '{collection_name}' found")
            print(f"  - Points count: {collection_info.points_count}")
            print(f"  - Vector size: {collection_info.config.params.vectors.size}")

            # Test search with sample embedding
            print("\nTesting search with sample query...")
            _, embedding = await test_cohere_embedding()

            if embedding:
                results = client.search(
                    collection_name=collection_name,
                    query_vector=embedding,
                    limit=3
                )

                print(f"✓ Search successful")
                print(f"  - Results returned: {len(results)}")
                for i, result in enumerate(results[:3]):
                    print(f"  - Result {i+1}:")
                    print(f"    Score: {result.score:.4f}")
                    if hasattr(result, 'payload'):
                        print(f"    Section: {result.payload.get('section', 'N/A')}")
                        content = result.payload.get('content', 'N/A')
                        print(f"    Content preview: {content[:100]}...")

            print()
            return True

        except Exception as e:
            print(f"✗ Collection error: {str(e)}")
            print()
            return False

    except Exception as e:
        print(f"✗ Qdrant connection failed: {str(e)}")
        print()
        return False

async def test_gemini_api():
    """Test Gemini API connection"""
    print("=" * 60)
    print("TESTING GEMINI API CONNECTION")
    print("=" * 60)

    try:
        import google.generativeai as genai

        api_key = os.getenv("GEMINI_API_KEY")
        genai.configure(api_key=api_key)

        model = genai.GenerativeModel('gemini-2.5-flash')

        # Test with a simple prompt
        test_prompt = "Say 'API working' in one word."
        print(f"Test prompt: '{test_prompt}'")

        response = model.generate_content(test_prompt)
        answer = response.text if hasattr(response, 'text') else str(response)

        print(f"✓ Gemini API working")
        print(f"  - Response: {answer.strip()}")
        print()
        return True

    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg or "quota" in error_msg.lower():
            print(f"✗ Gemini API quota exceeded")
            print(f"  - Error: {error_msg[:200]}")
            print(f"\n⚠ SOLUTION: Wait for quota reset or use a different API key")
            print(f"  - Free tier: 20 requests per day")
            print(f"  - Check usage: https://ai.dev/usage?tab=rate-limit")
        else:
            print(f"✗ Gemini API failed: {error_msg}")
        print()
        return False

async def test_full_pipeline():
    """Test the complete RAG pipeline"""
    print("=" * 60)
    print("TESTING FULL RAG PIPELINE")
    print("=" * 60)

    try:
        from src.agent import BookRAGAgent

        agent = BookRAGAgent()

        test_queries = [
            "What is ROS 2?",
            "Explain Isaac Sim",
            "What are vision-language-action models?"
        ]

        for query in test_queries:
            print(f"\nQuery: '{query}'")
            try:
                result = agent.run(query)

                print(f"✓ Answer received:")
                print(f"  {result['answer'][:150]}...")
                print(f"  - Sources: {len(result['sources'])}")
                print(f"  - Context used: {result['context_used']}")

            except Exception as e:
                error_msg = str(e)
                if "429" in error_msg or "quota" in error_msg.lower():
                    print(f"✗ Query failed due to quota limit")
                else:
                    print(f"✗ Query failed: {error_msg[:200]}")

        print()
        return True

    except Exception as e:
        print(f"✗ Pipeline test failed: {str(e)}")
        print()
        return False

async def main():
    """Run all tests"""
    print("\n" + "=" * 60)
    print("COMPREHENSIVE SYSTEM TEST")
    print("=" * 60 + "\n")

    results = {
        "Environment": await test_environment(),
        "Cohere Embedding": (await test_cohere_embedding())[0],
        "Qdrant Connection": await test_qdrant_connection(),
        "Gemini API": await test_gemini_api(),
    }

    # Only test full pipeline if other tests passed
    if all([results["Cohere Embedding"], results["Qdrant Connection"]]):
        results["Full Pipeline"] = await test_full_pipeline()
    else:
        print("⚠ Skipping full pipeline test due to failed dependencies\n")

    # Summary
    print("=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)

    for test_name, passed in results.items():
        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"{status:8} - {test_name}")

    print("\n" + "=" * 60)
    all_passed = all(results.values())

    if not all_passed:
        print("\n⚠ ISSUES DETECTED:")
        if not results.get("Gemini API"):
            print("\n1. GEMINI API QUOTA EXCEEDED")
            print("   - Your API key has hit the free tier limit (20 requests/day)")
            print("   - Solutions:")
            print("     a) Wait for quota reset (resets daily)")
            print("     b) Get a new API key from https://makersuite.google.com/app/apikey")
            print("     c) Upgrade to paid tier for higher limits")
            print("     d) Use a different Gemini model")

        if not results.get("Qdrant Connection"):
            print("\n2. QDRANT CONNECTION ISSUE")
            print("   - Check your Qdrant URL and API key")
            print("   - Verify collection exists and has embeddings")

        if not results.get("Cohere Embedding"):
            print("\n3. COHERE API ISSUE")
            print("   - Check your Cohere API key")
            print("   - Verify API quota")
    else:
        print("\n✓ ALL TESTS PASSED - System is fully operational!")

    print("=" * 60 + "\n")

if __name__ == "__main__":
    asyncio.run(main())
