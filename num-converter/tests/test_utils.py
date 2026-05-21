import unittest
from utils import get_clean_input, get_int, is_numeric, is_valid_word_input


class TestUtils(unittest.TestCase):
    def test_is_numeric(self):
        values = [
            ("1,235,934", True, "Number with commas"),
            ("4786.88", True, "Number with period"),
            ("0", True, "Zero"),
            ("4857984", True, "Number"),
            ("$1234.00", False, "Invalid number as currency"),
            ("2398 43478 8937", False, "Separated numbers"),
            ("one hundred twenty-five", False, "Number written in words"),
            ("lorem ipsum", False, "String value"),
        ]

        for value, expected, msg in values:
            result = is_numeric(value)
            self.assertEqual(result, expected, msg)

    def test_get_int(self):
        values = [
            ("42", 42, "Positive integer string"),
            ("0", 0, "Zero"),
            ("-7", -7, "Negative integer string"),
            ("3.14", None, "Float string"),
            ("abc", None, "Non-numeric string"),
            ("", None, "Empty string"),
            ("1,000", None, "Number with commas"),
        ]

        for value, expected, msg in values:
            result = get_int(value)
            self.assertEqual(result, expected, msg)

    def test_get_clean_input(self):
        values = [
            (
                "  hello world!   ",
                "hello world!",
                "Strips whitespace",
            ),
            ("Hello World!", "hello world!", "Converts to lower case"),
            ("hello, world!", "hello world!", "Strips commas"),
            ("hello. world.", "hello world", "Strips periods"),
            ("a  b   c d      e", "a b c d e", "Normalizes word spaces"),
            ("one and two and three", "one two three", "Removes ands"),
        ]

        for value, expected, msg in values:
            result = get_clean_input(value)
            self.assertEqual(result, expected, msg)

    def test_is_valid_word_input(self):
        values = [
            ("178936", "178936", "Number input"),
            ("178936.26", "178936.26", "Float input"),
            ("", "", "Empty string"),
            ("foo bar baz", "foo", "Invalid words"),
            ("one", None, "One numeric word"),
            ("twenty-one", None, "Hyphenated word"),
            ("twenty-tweets", "twenty-tweets", "Invalid hyphenated word"),
            ("five hundred thirty-nine", None, "Multiple numeric words"),
        ]

        for value, expected, msg in values:
            result = is_valid_word_input(value)
            self.assertEqual(result, expected, msg)
