import unittest

from htmlnode import HTMLNode


class TestHTMLNode(unittest.TestCase):
    def test_none_props(self):
        node = HTMLNode()
        self.assertEqual(node.props_to_html(), "")

    def test_empty_dict_props(self):
        node = HTMLNode(props={})
        self.assertEqual(node.props_to_html(), "")

    def test_props(self):
        node = HTMLNode(props={"href": "https://www.google.com", "target": "_blank"})
        self.assertEqual(
            node.props_to_html(), ' href="https://www.google.com" target="_blank"'
        )

    def test_html_node_repr(self):
        node = HTMLNode("p", None, None, {"class": "foo", "id": "bar"})
        self.assertEqual(
            str(node),
            (
                'HTMLNode(tag="p", value="None", children="None", '
                "props=\"{'class': 'foo', 'id': 'bar'}\")"
            ),
        )


if __name__ == "__main__":
    unittest.main()
