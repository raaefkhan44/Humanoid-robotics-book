"""Test chatbot with real query"""
import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

from src.agent import BookRAGAgent

# Create agent
agent = BookRAGAgent()

# Test queries
test_queries = [
    "What is ROS 2?",
    "Explain Isaac Sim",
    "What are the key features of humanoid robotics?"
]

print("\n" + "="*60)
print("CHATBOT QUERY TEST")
print("="*60 + "\n")

for i, query in enumerate(test_queries, 1):
    print(f"\n{i}. Query: '{query}'")
    print("-" * 60)

    try:
        result = agent.run(query)

        print(f"\nAnswer:\n{result['answer']}\n")
        print(f"Sources ({len(result['sources'])}):")
        for j, source in enumerate(result['sources'][:3], 1):
            print(f"  {j}. {source['section']} (score: {source['relevance_score']:.2f})")

        print(f"\nContext used: {result['context_used']}")

    except Exception as e:
        print(f"\nERROR: {str(e)}")

print("\n" + "="*60)
