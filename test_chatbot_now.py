"""Test chatbot with updated API key"""
import requests
import json

print("\n" + "="*60)
print("CHATBOT ENDPOINT TEST")
print("="*60 + "\n")

url = "http://127.0.0.1:8000/api/chat"

test_cases = [
    {
        "query": "What is ROS 2?",
        "selected_text": None
    },
    {
        "query": "Explain Isaac Sim",
        "selected_text": None
    }
]

for i, test in enumerate(test_cases, 1):
    print(f"\n{i}. Testing: '{test['query']}'")
    print("-" * 60)

    payload = {
        "message": test["query"],
        "selected_text": test["selected_text"]
    }

    try:
        response = requests.post(url, json=payload, timeout=30)

        if response.status_code == 200:
            data = response.json()

            answer = data.get("answer", "No answer")
            sources = data.get("sources", [])

            print(f"\n[SUCCESS] Status: {response.status_code}")
            print(f"\nAnswer:\n{answer[:300]}...")
            print(f"\nSources: {len(sources)}")
            for j, source in enumerate(sources[:3], 1):
                print(f"  {j}. {source.get('section', 'N/A')} (score: {source.get('relevance_score', 0):.2f})")
        else:
            print(f"\n[FAILED] Status: {response.status_code}")
            print(f"Response: {response.text[:200]}")

    except Exception as e:
        print(f"\n[ERROR] {str(e)}")

print("\n" + "="*60)
print("TEST COMPLETE")
print("="*60 + "\n")
