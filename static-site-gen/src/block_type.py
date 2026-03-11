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
    if re.match(r"#{1,6}\s[^\s]", block):
        return BlockType.HEADING

    if re.fullmatch(r"^(`{3})\n(.|\n)+\n\1$", block):
        return BlockType.CODE

    block_lines = block.split("\n")

    if re.match(r">\s?[^\s]", block):
        is_valid = True
        for line in block_lines:
            # Subsequent lines can be empty as long as they start with `>`
            if re.match(r">\s?", line) is None:
                is_valid = False

        if is_valid:
            return BlockType.QUOTE

    is_valid = True
    for line in block_lines:
        if re.match(r"-\s[^\s]", line) is None:
            is_valid = False

    if is_valid:
        return BlockType.UNORDERED_LIST

    is_valid = True
    for i, line in enumerate(block_lines, 1):
        if re.match(str(i) + r"\.\s[^\s]", line) is None:
            is_valid = False

    if is_valid:
        return BlockType.ORDERED_LIST

    return BlockType.PARAGRAPH
