from text_node import TextType, TextNode
from extract_markdown import extract_markdown_images, extract_markdown_links


def split_nodes_delimiter(old_nodes, delimiter, text_type):
    """Splits text nodes on a delimiter and assigns the enclosed text the given type.

    Non-text nodes are passed through unchanged. Raises a SyntaxError if an
    opening delimiter has no matching closing delimiter.

    Args:
        old_nodes (list): List of text nodes to process.
        delimiter (str): The markdown delimiter to split on (e.g., `**`, `_`, `` ` ``).
        text_type (TextType): The TextType to assign to delimited text.

    Returns:
        list: New list of text nodes with delimited sections split out.

    Raises:
        SyntaxError: If a delimiter is opened but never closed.
    """
    new_nodes = []

    for node in old_nodes:
        if node.text_type != TextType.TEXT:
            new_nodes.append(node)
        else:
            range_start = 0
            for i in range(len(node.text) - len(delimiter) + 1):
                chars = node.text[i : i + len(delimiter)]

                if i > 0 and chars == delimiter:
                    range_start_sub_str = node.text[
                        range_start : range_start + len(delimiter)
                    ]
                    if range_start_sub_str == delimiter:
                        sub_str = node.text[range_start + len(delimiter) : i]
                        new_nodes.append(TextNode(sub_str, text_type))
                        range_start = i + len(delimiter)
                    else:
                        sub_str = node.text[range_start:i]
                        new_nodes.append(TextNode(sub_str, TextType.TEXT))
                        range_start = i

            if range_start < len(node.text) - len(delimiter) + 1:
                if node.text[range_start : range_start + len(delimiter)] == delimiter:
                    raise SyntaxError("Invalid Markdown syntax")

                sub_str = node.text[range_start:]
                new_nodes.append(TextNode(sub_str, TextType.TEXT))

    return new_nodes


def split_nodes_util(old_nodes, extract_fn, token_str, text_type):
    """Splits text nodes by extracting markdown tokens (images or links) using a
    helper function.

    Args:
        old_nodes (list): List of text nodes to process.
        extract_fn (callable): Function that extracts (text, url) tuples from a string.
        token_str (str): Format string used to reconstruct the token for splitting
            (e.g., `"![{text}]({url})"`).
        text_type (TextType): The TextType to assign to extracted nodes.

    Returns:
        list: New list of text nodes with matched tokens split out.
    """
    new_nodes = []

    for node in old_nodes:
        if node.text_type != TextType.TEXT:
            new_nodes.append(node)
        else:
            matches = extract_fn(node.text)
            curr_text = node.text

            for match in matches:
                token = token_str.format(text=match[0], url=match[1])
                index = curr_text.find(token)

                if index > 0:
                    new_text_node = TextNode(curr_text[:index], TextType.TEXT)
                    new_nodes.append(new_text_node)

                new_img_node = TextNode(match[0], text_type, match[1])
                new_nodes.append(new_img_node)
                curr_text = curr_text[index + len(token) :]

            if len(curr_text):
                new_text_node = TextNode(curr_text, TextType.TEXT)
                new_nodes.append(new_text_node)

    return new_nodes


def split_nodes_image(old_nodes):
    """Splits text nodes by extracting inline markdown images.

    Args:
        old_nodes (list): List of text nodes to process.

    Returns:
        list: New list of text nodes with image tokens split out.
    """
    return split_nodes_util(
        old_nodes, extract_markdown_images, "![{text}]({url})", TextType.IMAGE
    )


def split_nodes_link(old_nodes):
    """Splits text nodes by extracting inline markdown links.

    Args:
        old_nodes (list): List of text nodes to process.

    Returns:
        list: New list of text nodes with link tokens split out.
    """
    return split_nodes_util(
        old_nodes, extract_markdown_links, "[{text}]({url})", TextType.LINK
    )


def text_to_text_nodes(text):
    """Converts a raw markdown string into a list of typed TextNodes.

    Processes bold, italic, code, image, and link markdown syntax in order.

    Args:
        text (str): Raw markdown string.

    Returns:
        list: List of TextNodes with appropriate types assigned.
    """
    text_node = TextNode(text, TextType.TEXT)
    new_nodes = [text_node]

    new_nodes = split_nodes_delimiter(new_nodes, "**", TextType.BOLD)
    new_nodes = split_nodes_delimiter(new_nodes, "_", TextType.ITALIC)
    new_nodes = split_nodes_delimiter(new_nodes, "`", TextType.CODE)
    new_nodes = split_nodes_image(new_nodes)
    new_nodes = split_nodes_link(new_nodes)

    return new_nodes
