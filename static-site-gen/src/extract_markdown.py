import re


def extract_markdown_images(text):
    return re.findall(r"!\[(.+?)\]\((.+?)\)", text)


def extract_markdown_links(text):
    return re.findall(r"\[(.+?)\]\((.+?)\)", text)


def markdown_to_blocks(markdown):
    blocks = markdown.split("\n\n")
    f_blocks = []
    for block in blocks:
        if block == "":
            continue
        f_blocks.append(block.strip())

    return f_blocks
