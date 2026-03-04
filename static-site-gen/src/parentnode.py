from htmlnode import HTMLNode


class ParentNode(HTMLNode):
    def __init__(self, tag, children, props=None):
        super().__init__(tag=tag, children=children, props=props)

    def to_html(self):
        if not self.tag:
            raise ValueError('"ParentNode" must have a value')

        if not self.children:
            raise ValueError('"ParentNode" must have children')

        out = f"<{self.tag}>"
        for node in self.children:
            out += node.to_html()
        out += f"</{self.tag}>"

        return out
