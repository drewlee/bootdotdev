import os
from google.genai import types


def get_files_info(working_directory, directory="."):
    try:
        working_dir_abs = os.path.abspath(working_directory)
        target_dir = os.path.normpath(os.path.join(working_dir_abs, directory))
        if not os.path.isdir(target_dir):
            return f'Error: "{target_dir}" is not a directory'

        valid_target_dir = (
            os.path.commonpath([working_dir_abs, target_dir]) == working_dir_abs
        )

        if not valid_target_dir:
            return (
                f'Error: Cannot list "{directory}" as it is '
                "outside the permitted working directory"
            )

        out_list = []
        for item in os.listdir(target_dir):
            file_path = os.path.join(target_dir, item)
            file_size = os.path.getsize(file_path)
            is_dir = os.path.isdir(file_path)
            out_list.append(f"- {item}: file_size={file_size} bytes, is_dir={is_dir}")
        out_list.sort()

        return "\n".join(out_list)

    except Exception as e:  # pylint: disable=[broad-exception-caught]
        return f"Error: {e}"


schema_get_files_info = types.FunctionDeclaration(
    name="get_files_info",
    description=(
        "Lists files in a specified directory relative to the working "
        "directory, providing file size and directory status"
    ),
    parameters=types.Schema(
        type=types.Type.OBJECT,
        properties={
            "directory": types.Schema(
                type=types.Type.STRING,
                description=(
                    "Directory path to list files from, relative to the working "
                    "directory (default is the working directory itself)"
                ),
            ),
        },
    ),
)
