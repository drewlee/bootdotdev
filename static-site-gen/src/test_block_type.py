import unittest
from block_type import BlockType, block_to_block_type


class TestBlockToBlockType(unittest.TestCase):
    def test_heading(self):
        block = "# Heading 1"
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.HEADING, "Heading level 1")

        block = "## Heading 2"
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.HEADING, "Heading level 2")

        block = "### Heading 3"
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.HEADING, "Heading level 3")

        block = "#### Heading 4"
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.HEADING, "Heading level 4")

        block = "##### Heading 5"
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.HEADING, "Heading level 5")

        block = "###### Heading 6"
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.HEADING, "Heading level 6")

    def test_heading_invalid(self):
        block = "#"
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "No text following hash")

        block = "#Some text"
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "No space following hash")

        block = "####### Some text"
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "Exceeding number of hashes")

        block = "#  Some text"
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "Too much space after hash")

    def test_code(self):
        block = """```
console.log('Hello, world!');
```"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.CODE, "Single line")

        block = """```
function foo() {
    console.log("Hello, world!");
}
```"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.CODE, "Multiline")

        block = """```
    function foo() {
        console.log("Hello, world!");
    }
```"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.CODE, "Indented")

        block = """```
// Code comment...
```"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.CODE, "Code comment")

        block = """```

function foo() {
    console.log("Hello, world!");
}

```"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.CODE, "Embedded line breaks")

    def test_code_invalid(self):
        block = "```console.log('Hello, world!');```"
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "Single line")

        block = """```
```"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "Empty closed block")

        block = """```

```"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "Empty open block")

        block = """``
console.log('Hello, world!');
```"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "Missing tick in opening tag")

        block = """```
console.log('Hello, world!');
``"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "Missing tick in closing tag")

        block = """
console.log('Hello, world!');
```"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "Missing opening tag")

        block = """```
console.log('Hello, world!');
"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "Missing closing tag")

        block = """````
console.log('Hello, world!');
```"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "Too many ticks in opening")

        block = """```
console.log('Hello, world!');
````"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "Too many ticks in closing")

    def test_quote(self):
        block = ">This quote text is a classic"
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.QUOTE, "No space following symbol")

        block = "> This quote text is a classic"
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.QUOTE, "One space following symbol")

        block = """> This quote text
> is from many classic
> literature sources."""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.QUOTE, "Multiline")

    def test_block_to_block_type_quote_invalid(self):
        block = ">"
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "No text")

        block = "> "
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "No text after space")

        block = ">  This is quote text"
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "Too much space")

        block = """> This quote text
is from many classic
literature sources."""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "Invalid multiline")

    def test_block_to_block_type_unordered_list(self):
        block = """- First item
- Second item
- Third item"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.UNORDERED_LIST, "Valid unordered list")

        block = "- Only one item"
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.UNORDERED_LIST, "Single item list")

        block = """- A
- B
- C"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.UNORDERED_LIST, "At least one character")

    def test_block_to_block_type_unordered_list_invalid(self):
        block = """- First item
-  Second item
- Third item"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "Too many spaces after dash")

        block = """- First item
 - Second item
- Third item"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "Space before dash")

        block = """- First item
Second item
- Third item"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "No dash")

        block = """- First item
-Second item
- Third item"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "No space after dash")

        block = """- First item
- Second item

- Third item"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "Empty line")

        block = """- First item
-
- Third item"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "No content after dash")

        block = """- First item
- 
- Third item"""  # noqa: W291
        block_type = block_to_block_type(block)
        self.assertEqual(
            block_type, BlockType.PARAGRAPH, "Space and no content after dash"
        )

    def test_block_to_block_type_ordered_list(self):
        block = """1. First item
2. Second item
3. Third item"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.ORDERED_LIST, "Valid ordered list")

        block = "1. Only one item"
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.ORDERED_LIST, "Single item list")

        block = """1. A
2. B
3. C"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.ORDERED_LIST, "At least one character")

    def test_block_to_block_type_ordered_list_invalid(self):
        block = """1. First item
2.  Second item
3. Third item"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "Too many spaces after digit")

        block = """1. First item
 2. Second item
3. Third item"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "Space before digit")

        block = """1. First item
. Second item
3. Third item"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "No digit")

        block = """1. First item
2.Second item
3. Third item"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "No space after digit")

        block = """1. First item
2. Second item

3. Third item"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "Empty line")

        block = """1. First item
2.
3. Third item"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "No content after digit")

        block = """1. First item
2. 
3. Third item"""  # noqa: W291
        block_type = block_to_block_type(block)
        self.assertEqual(
            block_type, BlockType.PARAGRAPH, "Space and no content after digit"
        )

        block = """1. First item
2. 
3. Third item"""  # noqa: W291
        block_type = block_to_block_type(block)
        self.assertEqual(
            block_type, BlockType.PARAGRAPH, "Space and no content after digit"
        )

        block = """1. First item
3. Second item
2. Third item"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "Digits out of sequence")

        block = """1. First item
2 Second item
3. Third item"""
        block_type = block_to_block_type(block)
        self.assertEqual(block_type, BlockType.PARAGRAPH, "No period after digit")


if __name__ == "__main__":
    unittest.main()
