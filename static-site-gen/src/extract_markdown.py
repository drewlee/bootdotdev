import re


def extract_markdown_images(text):
    return re.findall(r"!\[(.+?)\]\((.+?)\)", text)


def extract_markdown_links(text):
    return re.findall(r"\[(.+?)\]\((.+?)\)", text)


def markdown_to_blocks(markdown):
    blocks = markdown.split("\n\n")
    return list(filter(lambda x: x != "", map(lambda x: x.strip(), blocks)))
