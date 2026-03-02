import argparse
import os
import sys
from dotenv import load_dotenv
from google import genai
from google.genai import types
from config import MAX_ITERS
from prompts import SYSTEM_PROMPT
from call_function import available_functions, call_function


def main():
    # Parse call args
    parser = argparse.ArgumentParser(description="AI Code Assistant")
    parser.add_argument("user_prompt", type=str, help="Prompt to send to Gemini")
    parser.add_argument("--verbose", action="store_true", help="Enable verbose output")
    args = parser.parse_args()

    # Load API key
    load_dotenv()
    api_key = os.environ.get("GEMINI_API_KEY")
    if api_key is None:
        raise RuntimeError("GEMINI_API_KEY environment variable not set")

    # Set up the params for querying the prompt
    client = genai.Client(api_key=api_key)
    messages = [types.Content(role="user", parts=[types.Part(text=args.user_prompt)])]
    model_name = "gemini-2.5-flash"
    if args.verbose:
        print(f"User prompt:\n{args.user_prompt}")

    response_text = None

    for _ in range(MAX_ITERS):
        config = types.GenerateContentConfig(
            tools=[available_functions], system_instruction=SYSTEM_PROMPT
        )
        response = client.models.generate_content(
            model=model_name, contents=messages, config=config
        )

        if not response.usage_metadata:
            raise RuntimeError("No response from Gemini API")

        if args.verbose:
            print(f"Prompt tokens: {response.usage_metadata.prompt_token_count}")
            print(f"Response tokens: {response.usage_metadata.candidates_token_count}")

        if response.candidates:
            for candidate in response.candidates:
                if candidate.content:
                    messages.append(candidate.content)

        if not response.function_calls:
            response_text = response.text
            break

        function_responses = []
        for function_call in response.function_calls:
            result = call_function(function_call, args.verbose)
            if (
                not result.parts
                or not result.parts[0].function_response
                or not result.parts[0].function_response.response
            ):
                raise RuntimeError(f"Empty function response for {function_call.name}")

            function_responses.append(result.parts[0])
            if args.verbose:
                print(f"-> {result.parts[0].function_response.response}")

        messages.append(types.Content(role="user", parts=function_responses))

    if not response_text:
        print(f"Maximum iterations ({MAX_ITERS}) reached")
        sys.exit(1)

    print(f"Response:\n{response_text}")


if __name__ == "__main__":
    main()
