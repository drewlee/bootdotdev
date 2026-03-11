# AI Agent

LLM-based Python CLI application using the Google Gemini API. Completed as part of the
[Build an AI Agent in Python](https://www.boot.dev/courses/build-ai-agent-python)
Boot.dev course.

## Usage

Create virtual environment.
```sh
$ uv sync
```

Activate the virtual environment.
```sh
$ source .venv/bin/activate
```

Run the LLM coding agent.
```sh
$ uv run main.py "<llm_text_prompt>"
```

## Requirements

Requires Gemini API key defined in `.env`.

```
GEMINI_API_KEY='<api_key>'
```
