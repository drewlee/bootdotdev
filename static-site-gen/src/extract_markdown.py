import re


def extract_markdown_images(text):
    """Extracts all image alt text and URLs from the provided markdown string.

    Args:
        text (str): Markdown string to search.

    Returns:
        list: List of (alt_text, url) tuples for each image found.
    """
    return re.findall(r"!\[(.+?)\]\((.+?)\)", text)


def extract_markdown_links(text):
    """Extracts all link text and URLs from the provided markdown string.

    Args:
        text (str): Markdown string to search.

    Returns:
        list: List of (link_text, url) tuples for each link found.
    """
    return re.findall(r"\[(.+?)\]\((.+?)\)", text)


def markdown_to_blocks(markdown):
    """Splits a markdown string into a list of content blocks separated by blank lines.

    Args:
        markdown (str): Raw markdown string.

    Returns:
        list: List of non-empty, stripped content blocks.
    """
    blocks = markdown.split("\n\n")
    return list(filter(lambda x: x != "", map(lambda x: x.strip(), blocks)))


def extract_title(markdown):
    """Extracts the primary heading (h1) text from a markdown string.

    Args:
        markdown (str): Raw markdown string.

    Returns:
        str: The text content of the first h1 heading.

    Raises:
        ValueError: If no h1 heading is found in the markdown.
    """
    pattern = r"^#\s"
    blocks = markdown_to_blocks(markdown)

    for block in blocks:
        if re.match(pattern, block):
            return re.sub(pattern, "", block)

    raise ValueError("Missing primary document heading")
