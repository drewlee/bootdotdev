from enum import Enum


class TextType(Enum):
    TEXT = "text"
    BOLD = "bold"
    ITALIC = "italic"
    CODE = "code"
    LINK = "link"
    IMAGE = "image"


class TextNode:
    def __init__(self, text, text_type, url=None):
        """Initializes an instance.

        Args:
            text (str): Text content of the node.
            text_type (TextType): The type of text formatting.
            url (str): Optional URL for link or image nodes.
        """
        self.text = text
        self.text_type = text_type
        self.url = url

    def __eq__(self, other):
        """Checks equality between two TextNode instances.

        Args:
            other (TextNode): The other instance to compare against.

        Returns:
            bool: True if all properties are equal, False otherwise.
        """
        return (
            self.text == other.text
            and self.text_type == other.text_type
            and self.url == other.url
        )

    def __repr__(self):
        """String representation of the instance for debugging purposes.

        Returns:
            str: Formatted to output all property values.
        """
        return (
            f'TextNode(text="{self.text}", '
            f'text_type="{self.text_type.value}", url="{self.url}")'
        )
