import unittest

from split_nodes import (
    split_nodes_delimiter,
    split_nodes_image,
    split_nodes_link,
    text_to_text_nodes,
)
from text_node import TextType, TextNode


class TestSplitNodesDelimiter(unittest.TestCase):
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


class TestSplitNodesImage(unittest.TestCase):
    def test_split_image(self):
        node = TextNode(
            (
                "This is text with an ![image](https://i.imgur.com/zjjcJKZ.png) and "
                "another ![second image](https://i.imgur.com/3elNhQu.png)"
            ),
            TextType.TEXT,
        )
        new_nodes = split_nodes_image([node])

        self.assertListEqual(
            [
                TextNode("This is text with an ", TextType.TEXT),
                TextNode("image", TextType.IMAGE, "https://i.imgur.com/zjjcJKZ.png"),
                TextNode(" and another ", TextType.TEXT),
                TextNode(
                    "second image", TextType.IMAGE, "https://i.imgur.com/3elNhQu.png"
                ),
            ],
            new_nodes,
        )

    def test_split_image_whole(self):
        node = TextNode("![image](https://i.imgur.com/zjjcJKZ.png)", TextType.TEXT)
        new_nodes = split_nodes_image([node])

        self.assertListEqual(
            [TextNode("image", TextType.IMAGE, "https://i.imgur.com/zjjcJKZ.png")],
            new_nodes,
        )

    def test_split_image_first_half(self):
        node = TextNode(
            "![image](https://i.imgur.com/zjjcJKZ.png) and some more text!",
            TextType.TEXT,
        )
        new_nodes = split_nodes_image([node])

        self.assertListEqual(
            [
                TextNode("image", TextType.IMAGE, "https://i.imgur.com/zjjcJKZ.png"),
                TextNode(" and some more text!", TextType.TEXT),
            ],
            new_nodes,
        )

    def test_split_image_last_half(self):
        node = TextNode(
            "Some fine text and an ![image](https://i.imgur.com/zjjcJKZ.png)",
            TextType.TEXT,
        )
        new_nodes = split_nodes_image([node])

        self.assertListEqual(
            [
                TextNode("Some fine text and an ", TextType.TEXT),
                TextNode("image", TextType.IMAGE, "https://i.imgur.com/zjjcJKZ.png"),
            ],
            new_nodes,
        )

    def test_split_image_middle(self):
        node = TextNode(
            "Some text and an ![image](https://i.imgur.com/zjjcJKZ.png) and more text!",
            TextType.TEXT,
        )
        new_nodes = split_nodes_image([node])

        self.assertListEqual(
            [
                TextNode("Some text and an ", TextType.TEXT),
                TextNode("image", TextType.IMAGE, "https://i.imgur.com/zjjcJKZ.png"),
                TextNode(" and more text!", TextType.TEXT),
            ],
            new_nodes,
        )

    def test_split_image_none(self):
        node = TextNode("Some text with no images!", TextType.TEXT)
        new_nodes = split_nodes_image([node])

        self.assertListEqual([node], new_nodes)


class TestSplitNodesLink(unittest.TestCase):
    def test_split_link(self):
        node = TextNode(
            (
                "This is text with a link [to boot dev](https://www.boot.dev) and "
                "[to youtube](https://www.youtube.com/@bootdotdev)"
            ),
            TextType.TEXT,
        )
        new_nodes = split_nodes_link([node])

        self.assertListEqual(
            [
                TextNode("This is text with a link ", TextType.TEXT),
                TextNode("to boot dev", TextType.LINK, "https://www.boot.dev"),
                TextNode(" and ", TextType.TEXT),
                TextNode(
                    "to youtube", TextType.LINK, "https://www.youtube.com/@bootdotdev"
                ),
            ],
            new_nodes,
        )

    def test_split_link_whole(self):
        node = TextNode("[boot dot dev](https://www.boot.dev)", TextType.TEXT)
        new_nodes = split_nodes_link([node])

        self.assertListEqual(
            [
                TextNode("boot dot dev", TextType.LINK, "https://www.boot.dev"),
            ],
            new_nodes,
        )

    def test_split_link_first_half(self):
        node = TextNode(
            "[boot dot dev](https://www.boot.dev) and some more text!",
            TextType.TEXT,
        )
        new_nodes = split_nodes_link([node])

        self.assertListEqual(
            [
                TextNode("boot dot dev", TextType.LINK, "https://www.boot.dev"),
                TextNode(" and some more text!", TextType.TEXT),
            ],
            new_nodes,
        )

    def test_split_link_last_half(self):
        node = TextNode(
            "Some fine text and a [boot dot dev](https://www.boot.dev)",
            TextType.TEXT,
        )
        new_nodes = split_nodes_link([node])

        self.assertListEqual(
            [
                TextNode("Some fine text and a ", TextType.TEXT),
                TextNode("boot dot dev", TextType.LINK, "https://www.boot.dev"),
            ],
            new_nodes,
        )

    def test_split_link_middle(self):
        node = TextNode(
            "Some text and a [boot dot dev](https://www.boot.dev) and more text!",
            TextType.TEXT,
        )
        new_nodes = split_nodes_link([node])

        self.assertListEqual(
            [
                TextNode("Some text and a ", TextType.TEXT),
                TextNode("boot dot dev", TextType.LINK, "https://www.boot.dev"),
                TextNode(" and more text!", TextType.TEXT),
            ],
            new_nodes,
        )

    def test_split_link_none(self):
        node = TextNode("Some text with no links!", TextType.TEXT)
        new_nodes = split_nodes_link([node])

        self.assertListEqual([node], new_nodes)


class TestTextToTextnodes(unittest.TestCase):
    def test_text_to_textnodes(self):
        text = (
            "This is **text** with an _italic_ word and a `code block` and an "
            "![obi wan image](https://i.imgur.com/fJRm4Vk.jpeg) and a "
            "[link](https://boot.dev)"
        )
        new_nodes = text_to_text_nodes(text)

        self.assertListEqual(
            [
                TextNode("This is ", TextType.TEXT),
                TextNode("text", TextType.BOLD),
                TextNode(" with an ", TextType.TEXT),
                TextNode("italic", TextType.ITALIC),
                TextNode(" word and a ", TextType.TEXT),
                TextNode("code block", TextType.CODE),
                TextNode(" and an ", TextType.TEXT),
                TextNode(
                    "obi wan image", TextType.IMAGE, "https://i.imgur.com/fJRm4Vk.jpeg"
                ),
                TextNode(" and a ", TextType.TEXT),
                TextNode("link", TextType.LINK, "https://boot.dev"),
            ],
            new_nodes,
        )

    def test_text_to_textnodes_text_only(self):
        text = "This is some exemplary text."
        new_nodes = text_to_text_nodes(text)

        self.assertListEqual([TextNode(text, TextType.TEXT)], new_nodes)


if __name__ == "__main__":
    unittest.main()
