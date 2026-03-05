from textnode import TextType, TextNode


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
