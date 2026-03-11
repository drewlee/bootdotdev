from html_node import HTMLNode


class ParentNode(HTMLNode):
    """Representation of a block HTML element such as `p`, `ul`, and `blockquote`.

    Attributes:
        tag (str): HTML tag name.
        children (list(ParentNode | LeafNode)): Child HTML elements.
        props (dict): HTML element attributes.
    """

    def __init__(self, tag, children, props=None):
        """
        Initializes an instance.

        Args:
            tag (str): HTML tag name.
            children (list(ParentNode | LeafNode)): Child HTML elements.
            props (dict): HTML element attributes.
        """
        super().__init__(tag, None, children, props)

    def to_html(self):
        """
        Transforms the instance into an HTML string.

        Returns:
            str: String representation of the HTML element.

        Raises:
            ValueError: If the `tag` or `children` properties are unassigned.
        """
        if not self.tag:
            raise ValueError('"ParentNode" must have a tag')

        if not self.children:
            raise ValueError('"ParentNode" must have one or more children')

        out = f"<{self.tag}>"
        for node in self.children:
            out += node.to_html()
        out += f"</{self.tag}>"

        return out
