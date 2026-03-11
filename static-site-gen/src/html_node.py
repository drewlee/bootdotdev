class HTMLNode:
    """Abstract class to represent an HTML element.

    Attributes:
        tag (str): HTML tag name.
        value (str): Content of the HTML element.
        children (list(HTMLNode)): Child HTML elements.
        props (dict): HTML element attributes.
    """

    def __init__(self, tag=None, value=None, children=None, props=None):
        """
        Initializes an instance.

        Args:
            tag (str): HTML tag name.
            value (str): Content of the HTML element.
            children (list(HTMLNode)): Child HTML elements.
            props (dict): HTML element attributes.
        """
        self.tag = tag
        self.value = value
        self.children = children
        self.props = props

    def to_html(self):
        """
        Abstract method to be implemented by the sub-class.

        Raises:
            NotImplementedError: If the method isn't implemented by the sub-class.
        """
        raise NotImplementedError('"to_html" method not implemented by sub-class')

    def props_to_html(self):
        """
        Transforms the props dict into a string of HTML element attributes.

        Returns:
            str: HTML element attributes.
        """
        if not self.props:
            return ""

        out = ""
        for key, value in self.props.items():
            out += f' {key}="{value}"'

        return out

    def __repr__(self):
        """
        String representation of the instance for debugging purposes.

        Returns:
            str: Formatted to output all property values.
        """
        return (
            f'HTMLNode(tag="{self.tag}", value="{self.value}", '
            f'children="{self.children}", props="{self.props}")'
        )
