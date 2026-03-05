import unittest

from split_nodes import split_nodes_delimiter
from textnode import TextType, TextNode


class TestParentNode(unittest.TestCase):
    def test_split_nodes_delimiter_non_plain_text(self):
        node = TextNode("This is bold text", TextType.BOLD)
        new_nodes = split_nodes_delimiter([node], "", TextType.TEXT)
        self.assertListEqual(new_nodes, [node])

    def test_split_nodes_delimiter_code(self):
        node = TextNode("This is text with a `code block` word", TextType.TEXT)
        new_nodes = split_nodes_delimiter([node], "`", TextType.CODE)
        expected_nodes = [
            TextNode("This is text with a ", TextType.TEXT),
            TextNode("code block", TextType.CODE),
            TextNode(" word", TextType.TEXT),
        ]
        self.assertListEqual(new_nodes, expected_nodes)

    def test_split_nodes_delimiter_code_at_start(self):
        node = TextNode("`This is text` with a code block", TextType.TEXT)
        new_nodes = split_nodes_delimiter([node], "`", TextType.CODE)
        expected_nodes = [
            TextNode("This is text", TextType.CODE),
            TextNode(" with a code block", TextType.TEXT),
        ]
        self.assertListEqual(new_nodes, expected_nodes)

    def test_split_nodes_delimiter_code_at_end(self):
        node = TextNode("This is text with `a code block`", TextType.TEXT)
        new_nodes = split_nodes_delimiter([node], "`", TextType.CODE)
        expected_nodes = [
            TextNode("This is text with ", TextType.TEXT),
            TextNode("a code block", TextType.CODE),
        ]
        self.assertListEqual(new_nodes, expected_nodes)

    def test_split_nodes_delimiter_italic(self):
        node = TextNode("This is text with _italics_", TextType.TEXT)
        new_nodes = split_nodes_delimiter([node], "_", TextType.ITALIC)
        expected_nodes = [
            TextNode("This is text with ", TextType.TEXT),
            TextNode("italics", TextType.ITALIC),
        ]
        self.assertListEqual(new_nodes, expected_nodes)

    def test_split_nodes_delimiter_italic_whole_string(self):
        node = TextNode("_This is text with italics_", TextType.TEXT)
        new_nodes = split_nodes_delimiter([node], "_", TextType.ITALIC)
        expected_nodes = [
            TextNode("This is text with italics", TextType.ITALIC),
        ]
        self.assertListEqual(new_nodes, expected_nodes)

    def test_split_nodes_delimiter_bold(self):
        node = TextNode("This is **text** with many **bolded** words", TextType.TEXT)
        new_nodes = split_nodes_delimiter([node], "**", TextType.BOLD)
        expected_nodes = [
            TextNode("This is ", TextType.TEXT),
            TextNode("text", TextType.BOLD),
            TextNode(" with many ", TextType.TEXT),
            TextNode("bolded", TextType.BOLD),
            TextNode(" words", TextType.TEXT),
        ]
        self.assertListEqual(new_nodes, expected_nodes)

    def test_split_nodes_delimiter_bold_whole_string(self):
        node = TextNode("**This text is bold**", TextType.TEXT)
        new_nodes = split_nodes_delimiter([node], "**", TextType.BOLD)
        expected_nodes = [
            TextNode("This text is bold", TextType.BOLD),
        ]
        self.assertListEqual(new_nodes, expected_nodes)

    def test_split_nodes_delimiter_bold_at_start(self):
        node = TextNode("**This is a sentence** with bold text", TextType.TEXT)
        new_nodes = split_nodes_delimiter([node], "**", TextType.BOLD)
        expected_nodes = [
            TextNode("This is a sentence", TextType.BOLD),
            TextNode(" with bold text", TextType.TEXT),
        ]
        self.assertListEqual(new_nodes, expected_nodes)

    def test_split_nodes_delimiter_bold_at_end(self):
        node = TextNode("This is a sentence **with bold text**", TextType.TEXT)
        new_nodes = split_nodes_delimiter([node], "**", TextType.BOLD)
        expected_nodes = [
            TextNode("This is a sentence ", TextType.TEXT),
            TextNode("with bold text", TextType.BOLD),
        ]
        self.assertListEqual(new_nodes, expected_nodes)

    def test_split_nodes_delimiter_raises_exception(self):
        node = TextNode("This is a sentence **with bold text", TextType.TEXT)
        with self.assertRaises(SyntaxError):
            split_nodes_delimiter([node], "**", TextType.BOLD)


if __name__ == "__main__":
    unittest.main()
