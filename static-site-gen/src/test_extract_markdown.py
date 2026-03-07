import unittest
from extract_markdown import (
    extract_markdown_images,
    extract_markdown_links,
    markdown_to_blocks,
)


class TestExtractMarkdown(unittest.TestCase):
    def test_extract_markdown_images(self):
        matches = extract_markdown_images(
            "This is text with an ![image](https://i.imgur.com/zjjcJKZ.png)"
        )
        self.assertListEqual([("image", "https://i.imgur.com/zjjcJKZ.png")], matches)

    def test_extract_markdown_images_multiple(self):
        matches = extract_markdown_images(
            (
                "This is text with a ![rick roll](https://i.imgur.com/aKaOqIh.gif) and "
                "![obi wan](https://i.imgur.com/fJRm4Vk.jpeg)"
            )
        )
        self.assertListEqual(
            [
                ("rick roll", "https://i.imgur.com/aKaOqIh.gif"),
                ("obi wan", "https://i.imgur.com/fJRm4Vk.jpeg"),
            ],
            matches,
        )

    def test_extract_markdown_images_none(self):
        matches = extract_markdown_images("This is text with no images")
        self.assertListEqual([], matches)

    def test_extract_markdown_links(self):
        matches = extract_markdown_links(
            "This is text with a link [to boot dev](https://www.boot.dev)"
        )
        self.assertListEqual([("to boot dev", "https://www.boot.dev")], matches)

    def test_extract_markdown_links_multiple(self):
        matches = extract_markdown_links(
            (
                "This is text with a link [to boot dev](https://www.boot.dev) and "
                "[to youtube](https://www.youtube.com/@bootdotdev)"
            )
        )
        self.assertListEqual(
            [
                ("to boot dev", "https://www.boot.dev"),
                ("to youtube", "https://www.youtube.com/@bootdotdev"),
            ],
            matches,
        )

    def test_extract_markdown_links_none(self):
        matches = extract_markdown_links("This is text with no links")
        self.assertListEqual([], matches)


class TestMarkdownToBlocks(unittest.TestCase):
    def test_markdown_to_blocks(self):
        md = """
This is **bolded** paragraph

This is another paragraph with _italic_ text and `code` here
This is the same paragraph on a new line

- This is a list
- with items
"""
        blocks = markdown_to_blocks(md)
        self.assertListEqual(
            blocks,
            [
                "This is **bolded** paragraph",
                (
                    "This is another paragraph with _italic_ text and `code` here\n"
                    "This is the same paragraph on a new line"
                ),
                "- This is a list\n- with items",
            ],
        )

    def test_markdown_to_blocks_whitespace(self):
        md = """
    Foo

        Bar

Baz
"""
        blocks = markdown_to_blocks(md)
        self.assertListEqual(blocks, ["Foo", "Bar", "Baz"])

    def test_markdown_to_blocks_empty(self):
        blocks = markdown_to_blocks("")
        self.assertListEqual(blocks, [])


if __name__ == "__main__":
    unittest.main()
