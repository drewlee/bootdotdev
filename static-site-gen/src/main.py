import os
import shutil
from os import path

REL_PUBLIC_DIR = "../public"
REL_STATIC_DIR = "../static"


def get_abs_dir(rel_dir):
    curr_dir = path.dirname(path.abspath(__file__))
    target_dir = path.normpath(path.join(curr_dir, rel_dir))
    return target_dir


def rm_dir(target_dir):
    if path.exists(target_dir):
        print(f'Removing dir at "{target_dir}"')
        shutil.rmtree(target_dir)


def copy_dir_contents(source, destination):
    if not path.exists(source):
        return

    if not path.exists(destination):
        os.mkdir(destination)

    file_list = os.listdir(source)
    if not file_list:
        return

    for name in file_list:
        if not name.startswith("."):
            src_path = path.join(source, name)

            if path.isdir(src_path):
                copy_dir_contents(src_path, path.join(destination, name))
            else:
                print(f'Copying "{name}" from "{source}" to "{destination}"')
                shutil.copy(src_path, destination)


def main():
    public_dir = get_abs_dir(REL_PUBLIC_DIR)
    rm_dir(public_dir)

    static_dir = get_abs_dir(REL_STATIC_DIR)
    copy_dir_contents(static_dir, public_dir)


if __name__ == "__main__":
    main()
