import re
from enum import Enum


class BlockType(Enum):
    PARAGRAPH = "paragraph"
    HEADING = "heading"
    CODE = "code"
    QUOTE = "quote"
    UNORDERED_LIST = "unordered_list"
    ORDERED_LIST = "ordered_list"


def block_to_block_type(block):
    if re.match(r"^#{1,6}\s[^\s]", block):
        return BlockType.HEADING

    if re.match(r"^(`{3})\n(.|\n)+\n\1$", block):
        return BlockType.CODE

    if re.match(r"^>\s?[^\s]", block):
        return BlockType.QUOTE

    block_lines = block.split("\n")

    is_valid_list = True
    for line in block_lines:
        if re.match(r"^-\s[^\s]", line) is None:
            is_valid_list = False

    if is_valid_list:
        return BlockType.UNORDERED_LIST

    is_valid_list = True
    for i, line in enumerate(block_lines, 1):
        if re.match(r"^" + str(i) + r"\.\s[^\s]", line) is None:
            is_valid_list = False

    if is_valid_list:
        return BlockType.ORDERED_LIST

    return BlockType.PARAGRAPH
