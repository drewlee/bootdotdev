import os
from config import MAX_CHARS  # pylint: disable=[import-error]
from google.genai import types


def get_file_content(working_directory, file_path):
    try:
        working_dir_abs = os.path.abspath(working_directory)
        target_file = os.path.normpath(os.path.join(working_dir_abs, file_path))
        if not os.path.isfile(target_file):
            return f'Error: File not found or is not a regular file: "{file_path}"'

        valid_target_file = (
            os.path.commonpath([working_dir_abs, target_file]) == working_dir_abs
        )

        if not valid_target_file:
            return (
                f'Error: Cannot read "{file_path}" as it is '
                "outside the permitted working directory"
            )

        with open(file=target_file, encoding="utf-8") as file:
            content = file.read(MAX_CHARS)
            if file.read(1):
                content += (
                    f'[...File "{file_path}" truncated at {MAX_CHARS} characters]'
                )

        return content
    except Exception as e:  # pylint: disable=[broad-exception-caught]
        return f"Error: {e}"


schema_get_file_content = types.FunctionDeclaration(
    name="get_file_content",
    description=(
        "Reads and outputs the content of the specified file, relative to "
        "the working directory"
    ),
    parameters=types.Schema(
        type=types.Type.OBJECT,
        properties={
            "file_path": types.Schema(
                type=types.Type.STRING,
                description=(
                    "File path of the file to read, relative to the working directory"
                ),
            ),
        },
        required=["file_path"],
    ),
)
