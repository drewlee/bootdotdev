from textnode import TextType, TextNode
from extract_markdown import extract_markdown_images, extract_markdown_links


def split_nodes_delimiter(old_nodes, delimiter, text_type):
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


def split_nodes_image(old_nodes):
    new_nodes = []

    for node in old_nodes:
        matches = extract_markdown_images(node.text)
        curr_text = node.text

        for match in matches:
            token = f"![{match[0]}]({match[1]})"
            index = curr_text.find(token)

            if index > 0:
                new_text_node = TextNode(curr_text[:index], TextType.TEXT)
                new_nodes.append(new_text_node)

            new_img_node = TextNode(match[0], TextType.IMAGE, match[1])
            new_nodes.append(new_img_node)
            curr_text = curr_text[index + len(token) :]

        if len(curr_text):
            new_text_node = TextNode(curr_text, TextType.TEXT)
            new_nodes.append(new_text_node)

    return new_nodes


def split_nodes_link(old_nodes):
    new_nodes = []

    for node in old_nodes:
        matches = extract_markdown_links(node.text)
        curr_text = node.text

        for match in matches:
            token = f"[{match[0]}]({match[1]})"
            index = curr_text.find(token)

            if index > 0:
                new_text_node = TextNode(curr_text[:index], TextType.TEXT)
                new_nodes.append(new_text_node)

            new_link_node = TextNode(match[0], TextType.LINK, match[1])
            new_nodes.append(new_link_node)
            curr_text = curr_text[index + len(token) :]

        if len(curr_text):
            new_text_node = TextNode(curr_text, TextType.TEXT)
            new_nodes.append(new_text_node)

    return new_nodes
