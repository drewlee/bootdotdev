import os
import shutil
import sys
from os import path
from pathlib import Path
from md_to_html import markdown_to_html_node
from extract_markdown import extract_title

REL_PROJECT_ROOT = ".."
PUBLIC_DIR = "public"
STATIC_DIR = "static"
CONTENT_DIR = "content"
TMPL_FILE = "template.html"
DEFAULT_BASEPATH = "/"


def get_basepath():
    basepath = ""
    if len(sys.argv) > 1:
        basepath = sys.argv[1].strip()

    out = basepath if basepath != "" else DEFAULT_BASEPATH
    print(f'Using "{out}" as base path\n')

    return out


def get_abs_path(rel_path, raise_error=True):
    curr_dir = path.dirname(path.abspath(__file__))
    target_path = path.normpath(path.join(curr_dir, REL_PROJECT_ROOT, rel_path))

    if raise_error and not path.exists(target_path):
        raise FileNotFoundError(f'"{target_path}" is not a valid path')

    return target_path


def rm_dir(target_dir):
    if path.exists(target_dir):
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


def generate_page(from_path, template_path, dest_path, basepath):
    with open(from_path, encoding="utf-8") as file:
        markdown = file.read()

    with open(template_path, encoding="utf-8") as file:
        tmpl_html = file.read()

    print(
        (
            f'Generating page from "{from_path}" to '
            f'"{dest_path}" using "{template_path}"\n'
        )
    )

    doc_title = extract_title(markdown)
    html_node = markdown_to_html_node(markdown)
    html = html_node.to_html()

    tmpl_html = tmpl_html.replace("{{ Title }}", doc_title)
    tmpl_html = tmpl_html.replace("{{ Content }}", html)
    tmpl_html = tmpl_html.replace('href="/', f'href="{basepath}')
    tmpl_html = tmpl_html.replace('src="/', f'src="{basepath}')

    dest_dirname = path.dirname(dest_path)
    if not path.exists(dest_dirname):
        os.makedirs(dest_dirname)

    with open(dest_path, "w", encoding="utf-8") as file:
        file.write(tmpl_html)


def generate_pages_recursive(dir_path_content, template_path, dest_dir_path, basepath):
    file_list = os.listdir(dir_path_content)
    if not file_list:
        print(f'No files found at "{dir_path_content}"\n')
        return

    for name in file_list:
        file_path = path.join(dir_path_content, name)
        if path.isdir(file_path):
            generate_pages_recursive(
                file_path, template_path, path.join(dest_dir_path, name), basepath
            )
        elif Path(name).suffix == ".md":
            destination = path.join(dest_dir_path, Path(name).stem + ".html")
            generate_page(file_path, template_path, destination, basepath)


def main():
    basepath = get_basepath()

    public_dir = get_abs_path(PUBLIC_DIR, False)
    rm_dir(public_dir)

    static_dir = get_abs_path(STATIC_DIR)
    copy_dir_contents(static_dir, public_dir)

    content_dir = get_abs_path(CONTENT_DIR)
    tmpl_file = get_abs_path(TMPL_FILE)
    generate_pages_recursive(content_dir, tmpl_file, public_dir, basepath)


if __name__ == "__main__":
    main()
