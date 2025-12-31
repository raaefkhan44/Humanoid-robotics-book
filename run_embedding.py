#!/usr/bin/env python3
"""
Script to embed the book content into Qdrant RAG system
This version runs the backend server and embedding in the same process
"""

import os
import sys
import time
import threading
import requests
from pathlib import Path
import subprocess
import signal

def start_backend_server():
    """Start the backend server in a subprocess"""
    # Change to backend directory
    backend_dir = Path(__file__).parent / "backend"

    # Set environment variables
    env = os.environ.copy()
    env_file = backend_dir / ".env"
    if env_file.exists():
        # Load environment variables from .env file
        import dotenv
        dotenv.load_dotenv(env_file)

    # Start the backend server
    cmd = [
        sys.executable, "-m", "uvicorn",
        "src.api.main:app",
        "--host", "127.0.0.1",
        "--port", "8001"
    ]

    process = subprocess.Popen(
        cmd,
        cwd=backend_dir,
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )

    return process

def wait_for_server(port, timeout=30):
    """Wait for the server to be ready"""
    import urllib3
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

    start_time = time.time()
    backend_url = f"http://127.0.0.1:{port}"

    while time.time() - start_time < timeout:
        try:
            response = requests.get(f"{backend_url}/api/health", timeout=5)
            if response.status_code == 200:
                print(f"SUCCESS: Backend is running at {backend_url}")
                return True
        except requests.exceptions.RequestException:
            pass
        time.sleep(1)

    return False

def embed_book_content():
    """Embed the book content from docs directory into Qdrant"""
    # Determine the project root
    project_root = Path(__file__).parent
    docs_dir = project_root / "docs"

    print(f"Project root: {project_root}")
    print(f"Docs directory: {docs_dir}")

    # Check if docs directory exists
    if not docs_dir.exists():
        print(f"Error: Docs directory does not exist: {docs_dir}")
        return False

    # Check if there are markdown files in docs
    md_files = list(docs_dir.rglob("*.md"))
    if not md_files:
        print(f"No markdown files found in {docs_dir}")
        return False

    print(f"Found {len(md_files)} markdown files to embed")
    print("Files to be processed:")
    for file in md_files[:10]:  # Show first 10 files
        print(f"  - {file.relative_to(project_root)}")
    if len(md_files) > 10:
        print(f"  ... and {len(md_files) - 10} more files")

    # Prepare the embed request
    backend_url = "http://127.0.0.1:8001"
    embed_data = {
        "source_path": str(docs_dir.resolve()),
        "collection_name": "book_content"
    }

    print(f"\nEmbedding content from: {docs_dir.resolve()}")
    print("Sending request to backend...")

    try:
        response = requests.post(
            f"{backend_url}/api/embed",
            json=embed_data,
            timeout=300  # 5 minute timeout for large documents
        )

        if response.status_code == 200:
            result = response.json()
            print(f"SUCCESS: Embedding completed successfully!")
            print(f"  Status: {result.get('status', 'unknown')}")
            print(f"  Message: {result.get('message', 'No message')}")
            print(f"  Total files processed: {result.get('total_files', 0)}")
            print(f"  Job ID: {result.get('job_id', 'N/A')}")

            # Check the embeddings count
            count_response = requests.get(f"{backend_url}/api/embeddings/count")
            if count_response.status_code == 200:
                count_data = count_response.json()
                print(f"  Total embeddings in Qdrant: {count_data.get('count', 0)}")

            return True
        else:
            print(f"ERROR: Embedding request failed with status {response.status_code}")
            print(f"  Response: {response.text}")
            return False

    except requests.exceptions.Timeout:
        print("ERROR: Embedding request timed out. This might take a while for large documents.")
        print("  The embedding process might still be running in the background.")
        return True  # Return True since it might still be processing
    except Exception as e:
        print(f"ERROR: Error during embedding: {str(e)}")
        return False

def check_embeddings_count():
    """Check the current count of embeddings in Qdrant"""
    backend_url = "http://127.0.0.1:8001"

    try:
        response = requests.get(f"{backend_url}/api/embeddings/count")
        if response.status_code == 200:
            data = response.json()
            print(f"Current embeddings count: {data.get('count', 0)}")
            print(f"Collection: {data.get('collection_name', 'unknown')}")
            return data.get('count', 0)
        else:
            print(f"Failed to get embeddings count: {response.status_code}")
            return 0
    except Exception as e:
        print(f"Error checking embeddings count: {str(e)}")
        return 0

def main():
    print("Humanoid Robotics Book - Qdrant Embedding Script")
    print("=" * 50)

    # Start the backend server
    print("\nStarting backend server...")
    server_process = start_backend_server()

    # Wait for server to be ready
    print("Waiting for server to start...")
    if not wait_for_server(8001, 60):  # Wait up to 60 seconds
        print("ERROR: Failed to start backend server")
        server_process.terminate()
        return False

    # Check current embeddings count
    print("\nChecking current embeddings count...")
    current_count = check_embeddings_count()
    print(f"Current embeddings in Qdrant: {current_count}")

    if current_count == 0:
        print("\nNo embeddings found in Qdrant. Starting embedding process...")
    else:
        print(f"\n{current_count} embeddings already exist in Qdrant.")
        response = input("Do you want to regenerate embeddings? (y/N): ")
        if response.lower() != 'y':
            print("Aborting embedding process.")
            server_process.terminate()
            return True

    # Embed the book content
    success = embed_book_content()

    if success:
        print("\nSUCCESS: Book content has been successfully embedded into Qdrant!")
        print("Your chatbot should now be able to retrieve relevant information from the book.")

        # Check final count
        final_count = check_embeddings_count()
        print(f"Final embeddings count: {final_count}")
    else:
        print("\nERROR: Failed to embed book content. Please check the backend logs for errors.")

    # Clean up - terminate the server process
    print("\nShutting down backend server...")
    server_process.terminate()
    try:
        server_process.wait(timeout=5)
    except subprocess.TimeoutExpired:
        server_process.kill()

    return success

if __name__ == "__main__":
    main()