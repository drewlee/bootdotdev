import os
import subprocess
from google.genai import types


def run_python_file(working_directory, file_path, args=None):
    try:
        working_dir_abs = os.path.abspath(working_directory)
        target_file = os.path.normpath(os.path.join(working_dir_abs, file_path))
        if not os.path.isfile(target_file):
            return f'Error: "{file_path}" does not exist'

        valid_target_file = (
            os.path.commonpath([working_dir_abs, target_file]) == working_dir_abs
        )

        if not valid_target_file:
            return (
                f'Error: Cannot execute "{file_path}" as it is '
                "outside the permitted working directory"
            )

        if not file_path.endswith(".py"):
            return f'Error: "{file_path}" is not a Python file'

        command = ["python", target_file]
        if args:
            command.extend(args)

        # pylint: disable=[subprocess-run-check]
        completed = subprocess.run(
            command, cwd=working_dir_abs, capture_output=True, text=True, timeout=30
        )
        # pylint: enable=[subprocess-run-check]

        out = ""
        if completed.returncode > 0:
            out += f"Process exited with code {completed.returncode}\n"
        if completed.stdout:
            out += f"STDOUT: {completed.stdout}\n"
        elif completed.stderr:
            out += f"STDERR: {completed.stderr}\n"
        else:
            out += "No output produced"

        return out

    except Exception as e:  # pylint: disable=[broad-exception-caught]
        return f"Error: executing Python file: {e}"


schema_run_python_file = types.FunctionDeclaration(
    name="run_python_file",
    description=(
        "Executes the specified Python file, relative to the working directory, "
        "using the subprocess module"
    ),
    parameters=types.Schema(
        type=types.Type.OBJECT,
        properties={
            "file_path": types.Schema(
                type=types.Type.STRING,
                description=(
                    "File path of the Python file, relative to the working directory, "
                    "to execute"
                ),
            ),
            "args": types.Schema(
                type=types.Type.ARRAY,
                items=types.Schema(
                    type=types.Type.STRING,
                ),
                description="Additional arguments to pass into the subprocess module",
            ),
        },
        required=["file_path"],
    ),
)
