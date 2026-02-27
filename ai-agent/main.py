import argparse
import os
from dotenv import load_dotenv
from google import genai


def main():
    load_dotenv()
    api_key = os.environ.get("GEMINI_API_KEY")
    if api_key is None:
        raise RuntimeError("Failed to load API key")

    parser = argparse.ArgumentParser(description="Chatbot")
    parser.add_argument("user_prompt", type=str, help="User prompt")
    parser.add_argument("--verbose", action="store_true", help="Enable verbose output")
    args = parser.parse_args()

    messages = [
        genai.types.Content(
            role="user", parts=[genai.types.Part(text=args.user_prompt)]
        )
    ]
    model = "gemini-2.5-flash"
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(model=model, contents=messages)

    if response.usage_metadata is None:
        raise RuntimeError("No response from Gemini API")

    if args.verbose:
        print(f"User prompt:\n{args.user_prompt}")
        print(f"Prompt tokens: {response.usage_metadata.prompt_token_count}")
        print(f"Response tokens: {response.usage_metadata.candidates_token_count}")
    print(f"Response:\n{response.text}")


if __name__ == "__main__":
    main()
