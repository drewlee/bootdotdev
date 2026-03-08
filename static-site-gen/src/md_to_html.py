import re
from extract_markdown import markdown_to_blocks
from block_type import BlockType, block_to_block_type
from textnode import TextNode, TextType
from parentnode import ParentNode
from text_to_html import text_node_to_html_node
from split_nodes import text_to_textnodes


def get_heading_tag(text):
    matches = re.findall(r"^#{1,6}", text)
    return f"h{len(matches[0])}"


def get_ul_item_nodes(text):
    html_nodes = []
    lines = text.split("\n")

    for line in lines:
        line = re.sub(r"^-\s", "", line)
        child_nodes = text_to_children(line)
        li_node = ParentNode("li", child_nodes)
        html_nodes.append(li_node)

    return html_nodes


def get_ol_item_nodes(text):
    html_nodes = []
    lines = text.split("\n")

    for line in lines:
        line = re.sub(r"^\d+\.\s", "", line)
        child_nodes = text_to_children(line)
        li_node = ParentNode("li", child_nodes)
        html_nodes.append(li_node)

    return html_nodes


def strip_new_lines(text):
    return " ".join(text.split("\n"))


def strip_heading_markdown(text):
    return re.sub(r"^#{1,6}\s", "", text)


def strip_quote_markdown(text):
    return re.sub(r"^>\s?", "", text)


def strip_code_markdown(text):
    lines = text.split("\n")
    lines = lines[1:]
    lines[-1] = ""
    return "\n".join(lines)


def text_to_children(text):
    html_nodes = []
    text_nodes = text_to_textnodes(text)

    for text_node in text_nodes:
        html_node = text_node_to_html_node(text_node)
        html_nodes.append(html_node)

    return html_nodes


def markdown_to_html_node(markdown):
    parent_div_node = ParentNode("div", [])
    blocks = markdown_to_blocks(markdown)

    for block in blocks:
        block_type = block_to_block_type(block)

        if block_type == BlockType.PARAGRAPH:
            block = strip_new_lines(block)
            child_nodes = text_to_children(block)
            node = ParentNode("p", child_nodes)

            parent_div_node.children.append(node)

        if block_type == BlockType.HEADING:
            h_tag = get_heading_tag(block)
            block = strip_heading_markdown(block)

            child_nodes = text_to_children(block)
            node = ParentNode(h_tag, child_nodes)

            parent_div_node.children.append(node)

        if block_type == BlockType.CODE:
            block = strip_code_markdown(block)

            text_node = TextNode(block, TextType.CODE)
            node = text_node_to_html_node(text_node)
            pre_node = ParentNode("pre", [node])

            parent_div_node.children.append(pre_node)

        if block_type == BlockType.QUOTE:
            block = strip_quote_markdown(block)
            child_nodes = text_to_children(block)

            node = ParentNode("blockquote", child_nodes)
            parent_div_node.children.append(node)

        if block_type == BlockType.UNORDERED_LIST:
            li_nodes = get_ul_item_nodes(block)
            node = ParentNode("ul", li_nodes)

            parent_div_node.children.append(node)

        if block_type == BlockType.ORDERED_LIST:
            li_nodes = get_ol_item_nodes(block)
            node = ParentNode("ol", li_nodes)

            parent_div_node.children.append(node)

    return parent_div_node
