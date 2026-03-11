from text_node import TextType
from leaf_node import LeafNode


def text_node_to_html_node(text_node):
    """
    Constructs an HTML LeafNode from the specified text node.

    Args:
        text_node (TextNode): Text node to use as the basis for the new HTML node.

    Returns:
        LeafNode: HTML leaf node.

    Raises:
        ValueError: Invalid TextType for the given text node.
    """
    match text_node.text_type:
        case TextType.TEXT:
            return LeafNode(None, text_node.text)
        case TextType.BOLD:
            return LeafNode("b", text_node.text)
        case TextType.ITALIC:
            return LeafNode("i", text_node.text)
        case TextType.CODE:
            return LeafNode("code", text_node.text)
        case TextType.LINK:
            return LeafNode("a", text_node.text, {"href": text_node.url})
        case TextType.IMAGE:
            return LeafNode("img", text_node.text, {"src": text_node.url})
        case _:
            raise ValueError(f"Invalid text type: {text_node.text_type}")
