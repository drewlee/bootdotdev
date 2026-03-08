import os
import shutil
from os import path
from md_to_html import markdown_to_html_node
from extract_markdown import extract_title

REL_PROJECT_ROOT = ".."
PUBLIC_DIR = "public"
STATIC_DIR = "static"


def get_abs_path(rel_path):
    curr_dir = path.dirname(path.abspath(__file__))
    target_path = path.normpath(path.join(curr_dir, REL_PROJECT_ROOT, rel_path))

    if not path.exists(target_path):
        raise FileNotFoundError(f'"{target_path}" is not a valid path')

    return target_path


def rm_dir(target_dir):
    print(f'Removing dir at "{target_dir}"\n')
    shutil.rmtree(target_dir)


def copy_dir_contents(source, destination):
    if not path.exists(destination):
        os.mkdir(destination)

    file_list = os.listdir(source)
    if not file_list:
        print(f'No files found at "{source}"\n')
        return

    for name in file_list:
        if not name.startswith("."):
            src_path = path.join(source, name)

            if path.isdir(src_path):
                copy_dir_contents(src_path, path.join(destination, name))
            else:
                print(f'Copying "{name}" from "{source}" to "{destination}"\n')
                shutil.copy(src_path, destination)


def generate_page(from_path, template_path, dest_path):
    abs_from_path = get_abs_path(from_path)
    with open(abs_from_path, encoding="utf-8") as file:
        markdown = file.read()

    abs_template_path = get_abs_path(template_path)
    with open(abs_template_path, encoding="utf-8") as file:
        tmpl_html = file.read()

    abs_dest_path = get_abs_path(dest_path)

    print(
        (
            f'Generating page from "{abs_from_path}" to '
            f'"{abs_dest_path}" using "{abs_template_path}"\n'
        )
    )

    html_node = markdown_to_html_node(markdown)
    html = html_node.to_html()

    doc_title = extract_title(markdown)
    tmpl_html = tmpl_html.replace("{{ Title }}", doc_title)
    tmpl_html = tmpl_html.replace("{{ Content }}", html)

    with open(path.join(abs_dest_path, "index.html"), "w", encoding="utf-8") as file:
        file.write(tmpl_html)


def main():
    public_dir = get_abs_path(PUBLIC_DIR)
    rm_dir(public_dir)

    static_dir = get_abs_path(STATIC_DIR)
    copy_dir_contents(static_dir, public_dir)

    generate_page("content/index.md", "template.html", PUBLIC_DIR)


if __name__ == "__main__":
    main()
