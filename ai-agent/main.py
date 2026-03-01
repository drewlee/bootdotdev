import argparse
import os
from dotenv import load_dotenv
from google import genai
from google.genai import types
from prompts import SYSTEM_PROMPT
from call_function import available_functions, call_function


def main():
    load_dotenv()
    api_key = os.environ.get("GEMINI_API_KEY")
    if api_key is None:
        raise RuntimeError("Failed to load API key")

    parser = argparse.ArgumentParser(description="Chatbot")
    parser.add_argument("user_prompt", type=str, help="User prompt")
    parser.add_argument("--verbose", action="store_true", help="Enable verbose output")
    args = parser.parse_args()

    client = genai.Client(api_key=api_key)
    model_name = "gemini-2.5-flash"
    messages = [types.Content(role="user", parts=[types.Part(text=args.user_prompt)])]
    config = types.GenerateContentConfig(
        tools=[available_functions], system_instruction=SYSTEM_PROMPT
    )
    response = client.models.generate_content(
        model=model_name, contents=messages, config=config
    )

    if not response.usage_metadata:
        raise RuntimeError("No response from Gemini API")

    if args.verbose:
        print(f"User prompt:\n{args.user_prompt}")
        print(f"Prompt tokens: {response.usage_metadata.prompt_token_count}")
        print(f"Response tokens: {response.usage_metadata.candidates_token_count}")

    function_results = []

    if response.function_calls:
        for call in response.function_calls:
            function_call_result = call_function(call)
            if not function_call_result.parts:
                raise Exception("Missing `parts`")
            if not function_call_result.parts[0].function_response:
                raise Exception("Missing `function_response`")
            if not function_call_result.parts[0].function_response.response:
                raise Exception("Missing `response`")

            function_results.append(function_call_result.parts[0])
            if args.verbose:
                print(f"-> {function_call_result.parts[0].function_response.response}")
    else:
        print(f"Response:\n{response.text}")


if __name__ == "__main__":
    main()
