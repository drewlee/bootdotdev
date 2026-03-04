class HTMLNode:
    def __init__(self, tag=None, value=None, children=None, props=None):
        self.tag = tag
        self.value = value
        self.children = children
        self.props = props

    def to_html(self):
        raise NotImplementedError('"to_html" method must be implemented by sub-class')

    def props_to_html(self):
        if not self.props:
            return ""

        out = ""
        for key, value in self.props.items():
            out += f' {key}="{value}"'

        return out

    def __repr__(self):
        return f"HTMLNode({self.tag}, {self.value}, {self.children}, {self.props})"
