import unittest
from md_to_html import markdown_to_html_node


class TestMarkdownToHTMLNode(unittest.TestCase):
    def test_paragraphs(self):
        md = """
This is **bolded** paragraph
text in a p
tag here

This is another paragraph with _italic_ text and `code` here

"""
        node = markdown_to_html_node(md)
        html = node.to_html()

        self.assertEqual(
            html,
            (
                "<div><p>This is <b>bolded</b> paragraph text in a p tag here</p>"
                "<p>This is another paragraph with <i>italic</i> text and "
                "<code>code</code> here</p></div>"
            ),
        )

    def test_headings(self):
        md = """
# This is a level 1 heading

## This is a level 2 heading

### This is a level 3 heading

#### This is a level 4 heading

##### This is a level 5 heading

###### This is a level 6 heading
"""
        node = markdown_to_html_node(md)
        html = node.to_html()

        self.assertEqual(
            html,
            (
                "<div>"
                "<h1>This is a level 1 heading</h1>"
                "<h2>This is a level 2 heading</h2>"
                "<h3>This is a level 3 heading</h3>"
                "<h4>This is a level 4 heading</h4>"
                "<h5>This is a level 5 heading</h5>"
                "<h6>This is a level 6 heading</h6>"
                "</div>"
            ),
        )

    def test_codeblock(self):
        md = """
```
This is text that _should_ remain
the **same** even with inline stuff
```
"""

        node = markdown_to_html_node(md)
        html = node.to_html()

        self.assertEqual(
            html,
            (
                "<div><pre><code>"
                "This is text that _should_ remain\n"
                "the **same** even with inline stuff\n"
                "</code></pre></div>"
            ),
        )

    def test_blockquote(self):
        md = """
> To be, or not to be, that is the question,
> to be, or not to be, that is the question,
> to be, or not to be, that is the question.
"""
        node = markdown_to_html_node(md)
        html = node.to_html()

        self.assertEqual(
            html,
            (
                "<div>"
                "<blockquote>"
                "To be, or not to be, that is the question,\n"
                "to be, or not to be, that is the question,\n"
                "to be, or not to be, that is the question."
                "</blockquote>"
                "</div>"
            ),
        )

    def test_unordered_list(self):
        md = """
- Item one
- Item two
- Item three
- Item four
- Item five
"""
        node = markdown_to_html_node(md)
        html = node.to_html()

        self.assertEqual(
            html,
            (
                "<div>"
                "<ul>"
                "<li>Item one</li>"
                "<li>Item two</li>"
                "<li>Item three</li>"
                "<li>Item four</li>"
                "<li>Item five</li>"
                "</ul>"
                "</div>"
            ),
        )

    def test_ordered_list(self):
        md = """
1. Item one
2. Item two
3. Item three
4. Item four
5. Item five
"""
        node = markdown_to_html_node(md)
        html = node.to_html()

        self.assertEqual(
            html,
            (
                "<div>"
                "<ol>"
                "<li>Item one</li>"
                "<li>Item two</li>"
                "<li>Item three</li>"
                "<li>Item four</li>"
                "<li>Item five</li>"
                "</ol>"
                "</div>"
            ),
        )

    def test_mixed_content(self):
        md = """
# Star Wars Fan Club

![George Lucas sitting](/images/lucas.png)

## Blog posts

- [Post one](/blog/one)
- [Post two](/blog/two)
- [Post three](/blog/three)
"""
        node = markdown_to_html_node(md)
        html = node.to_html()

        self.assertEqual(
            html,
            (
                "<div>"
                "<h1>Star Wars Fan Club</h1>"
                '<p><img src="/images/lucas.png" alt="George Lucas sitting" /></p>'
                "<h2>Blog posts</h2>"
                "<ul>"
                '<li><a href="/blog/one">Post one</a></li>'
                '<li><a href="/blog/two">Post two</a></li>'
                '<li><a href="/blog/three">Post three</a></li>'
                "</ul>"
                "</div>"
            ),
        )
