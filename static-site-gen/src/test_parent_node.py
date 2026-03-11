import unittest

from parent_node import ParentNode
from leaf_node import LeafNode


class TestParentNode(unittest.TestCase):
    def test_to_html_with_children(self):
        child_node = LeafNode("b", "child node")
        parent_node = ParentNode("p", [child_node])
        self.assertEqual(parent_node.to_html(), "<p><b>child node</b></p>")

    def test_to_html_with_grandchildren(self):
        grandchild_node = LeafNode("b", "grandchild")
        child_node = ParentNode("p", [grandchild_node])
        parent_node = ParentNode("div", [child_node])
        self.assertEqual(
            parent_node.to_html(),
            "<div><p><b>grandchild</b></p></div>",
        )


if __name__ == "__main__":
    unittest.main()
