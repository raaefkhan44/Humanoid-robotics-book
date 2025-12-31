"""Quick test of Gemini API"""
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

print("\n" + "="*60)
print("GEMINI API TEST")
print("="*60 + "\n")

api_key = os.getenv("GEMINI_API_KEY")
print(f"API Key: {api_key[:10]}...{api_key[-5:]}")

try:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.5-flash')

    response = model.generate_content("Say 'API is working!' in exactly 3 words.")
    answer = response.text if hasattr(response, 'text') else str(response)

    print(f"\n[SUCCESS] Gemini API is working!")
    print(f"Response: {answer.strip()}\n")
    print("="*60)

except Exception as e:
    error_str = str(e)
    print(f"\n[FAILED] Gemini API Error:")

    if "429" in error_str or "quota" in error_str.lower():
        print("\nQUOTA EXCEEDED - This API key has hit its limit")
        print("Free tier: 20 requests/day")
        print("\nSolutions:")
        print("1. Wait for daily reset (midnight UTC)")
        print("2. Get a new API key: https://makersuite.google.com/app/apikey")
        print("3. Upgrade to paid tier")
    elif "401" in error_str or "invalid" in error_str.lower():
        print("\nINVALID API KEY")
        print("Please check your GEMINI_API_KEY in .env file")
    else:
        print(f"\n{error_str[:300]}")

    print("\n" + "="*60)
