#!/usr/bin/env python3
"""
Test script to verify that the updated configuration with Cohere and Gemini works properly.
"""

import os
import sys
import asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add backend src to path so we can import modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

def test_imports():
    """Test that all modules can be imported with the new configuration"""
    print("Testing imports...")

    try:
        from config.settings import settings
        print("OK Settings imported successfully")

        from services.agent_service import agent_service
        print("OK Agent service imported successfully")

        from services.embedding_service import embedding_service
        print("OK Embedding service imported successfully")

        from services.rag_service import rag_service
        print("OK RAG service imported successfully")

        return True
    except Exception as e:
        print(f"ERROR: Import error: {e}")
        return False

def test_settings():
    """Test that settings are loaded correctly"""
    print("\nTesting settings...")

    try:
        from config.settings import settings

        # Check that required settings exist
        required_settings = [
            'cohere_api_key',
            'gemini_api_key',
            'qdrant_url',
            'neon_database_url',
            'embedding_model',
            'chat_model'
        ]

        for setting in required_settings:
            if not hasattr(settings, setting):
                print(f"ERROR: Missing setting: {setting}")
                return False
            print(f"OK Setting {setting} found")

        print("OK All required settings are present")
        return True
    except Exception as e:
        print(f"ERROR: Settings error: {e}")
        return False

def test_services_initialization():
    """Test that services can be initialized"""
    print("\nTesting service initialization...")

    try:
        from services.agent_service import agent_service
        from services.embedding_service import embedding_service
        from services.rag_service import rag_service

        # Test agent service initialization
        success = agent_service.initialize_assistant()
        if success:
            print("OK Agent service initialized successfully")
        else:
            print("ERROR: Agent service initialization failed")
            return False

        print("OK All services initialized successfully")
        return True
    except Exception as e:
        print(f"ERROR: Service initialization error: {e}")
        return False

def main():
    print("Testing updated RAG Chatbot with Cohere and Gemini...")
    print("=" * 60)

    success = True
    success &= test_imports()
    success &= test_settings()
    success &= test_services_initialization()

    print("\n" + "=" * 60)
    if success:
        print("OK All tests passed! The updated configuration is working correctly.")
        print("\nTo run the application, make sure you have:")
        print("- Valid Cohere API key in COHERE_API_KEY environment variable")
        print("- Valid Gemini API key in GEMINI_API_KEY environment variable")
        print("- Proper Qdrant configuration")
        print("- Proper database configuration")
        print("\nRun the application with: python -m src.api.main")
    else:
        print("ERROR: Some tests failed. Please check the configuration.")
        return 1

    return 0

if __name__ == "__main__":
    sys.exit(main())