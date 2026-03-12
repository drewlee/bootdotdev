from html_node import HTMLNode


class LeafNode(HTMLNode):
    """Representation of an inline HTML element such as `link`, `b`, and `code`.

    Attributes:
        tag (str): HTML tag name.
        value (str): Content of the HTML element.
        props (dict): HTML element attributes.
    """

    def __init__(self, tag, value, props=None):
        """Initializes an instance.

        Args:
            tag (str): HTML tag name.
            value (str): Content of the HTML element.
            props (dict): HTML element attributes.
        """
        super().__init__(tag, value, None, props)

    def to_html(self):
        """Transforms the instance into an HTML string.

        Returns:
            str: String representation of the HTML element.

        Raises:
            ValueError: If the `value` property is not specified.
        """
        if not self.value:
            raise ValueError('"LeafNode" must have a value')

        # Handle text nodes which have no tags
        if not self.tag:
            return self.value

        # `img` is a self closing tag and requires special handling
        if self.tag == "img":
            return f'<{self.tag}{self.props_to_html()} alt="{self.value}" />'

        return f"<{self.tag}{self.props_to_html()}>{self.value}</{self.tag}>"

    def __repr__(self):
        """String representation of the instance for debugging purposes.

        Returns:
            str: Formatted to output all property values.
        """
        return f'LeafNode(tag="{self.tag}", value="{self.value}", props="{self.props}")'
