import unittest

from leaf_node import LeafNode


class TestLeafNode(unittest.TestCase):
    def test_leaf_to_html_b(self):
        node = LeafNode("b", "Hello, world!")
        self.assertEqual(node.to_html(), "<b>Hello, world!</b>")

    def test_leaf_to_html_i(self):
        node = LeafNode("i", "Hello, world!")
        self.assertEqual(node.to_html(), "<i>Hello, world!</i>")

    def test_leaf_to_html_a(self):
        node = LeafNode("a", "Boot dot dev", {"href": "https://www.boot.dev"})
        self.assertEqual(
            node.to_html(), '<a href="https://www.boot.dev">Boot dot dev</a>'
        )

    def test_leaf_to_html_img(self):
        node = LeafNode("img", "George Lucas", {"src": "lucas.png"})
        self.assertEqual(node.to_html(), '<img src="lucas.png" alt="George Lucas" />')

    def test_leaf_to_html_no_tag(self):
        node = LeafNode(None, "Hello, world!")
        self.assertEqual(node.to_html(), "Hello, world!")

    def test_repr(self):
        node = LeafNode("b", "Hello, world!")
        self.assertEqual(
            str(node), 'LeafNode(tag="b", value="Hello, world!", props="None")'
        )


if __name__ == "__main__":
    unittest.main()
