import unittest

from words import get_words_for_num


class TestGetWordsForNum(unittest.TestCase):
    def test_single_digits(self):
        expected = [
            "zero",
            "one",
            "two",
            "three",
            "four",
            "five",
            "six",
            "seven",
            "eight",
            "nine",
        ]

        for i, value in enumerate(expected):
            result = get_words_for_num(i)
            self.assertEqual(result, value)

    def test_teens(self):
        expected = [
            "ten",
            "eleven",
            "twelve",
            "thirteen",
            "fourteen",
            "fifteen",
            "sixteen",
            "seventeen",
            "eighteen",
            "nineteen",
        ]

        for i in range(10, len(expected) + 10):
            result = get_words_for_num(i)
            self.assertEqual(result, expected[i - 10])

    def test_whole_tens(self):
        expected = {
            20: "twenty",
            30: "thirty",
            40: "forty",
            50: "fifty",
            60: "sixty",
            70: "seventy",
            80: "eighty",
            90: "ninety",
        }

        for key, value in expected.items():
            result = get_words_for_num(key)
            self.assertEqual(result, value)

    def test_tens_range(self):
        expected = {
            61: "sixty-one",
            62: "sixty-two",
            63: "sixty-three",
            64: "sixty-four",
            65: "sixty-five",
            66: "sixty-six",
            67: "sixty-seven",
            68: "sixty-eight",
            69: "sixty-nine",
        }

        for key, value in expected.items():
            result = get_words_for_num(key)
            self.assertEqual(result, value)

    def test_whole_hundreds(self):
        expected = [
            "one hundred",
            "two hundred",
            "three hundred",
            "four hundred",
            "five hundred",
            "six hundred",
            "seven hundred",
            "eight hundred",
            "nine hundred",
        ]

        for i, value in enumerate(expected):
            result = get_words_for_num((i + 1) * 100)
            self.assertEqual(result, value)

    def test_whole_thousands_plus(self):
        expected = {
            1_000: "one thousand",
            10_000: "ten thousand",
            100_000: "one hundred thousand",
            1_000_000: "one million",
            10_000_000: "ten million",
            100_000_000: "one hundred million",
            1_000_000_000: "one billion",
            10_000_000_000: "ten billion",
            100_000_000_000: "one hundred billion",
            1_000_000_000_000: "one trillion",
            10_000_000_000_000: "ten trillion",
            100_000_000_000_000: "one hundred trillion",
        }

        for key, value in expected.items():
            result = get_words_for_num(key)
            self.assertEqual(result, value)

    def test_various_values(self):
        expected = {
            1_100: "one thousand one hundred",
            1_234: "one thousand two hundred thirty-four",
            5_000: "five thousand",
            11_011: "eleven thousand eleven",
            25_100: "twenty-five thousand one hundred",
            42_678: "forty-two thousand six hundred seventy-eight",
            99_999: "ninety-nine thousand nine hundred ninety-nine",
            100_500: "one hundred thousand five hundred",
            300_050: "three hundred thousand fifty",
            1_000_001: "one million one",
            2_500_000: "two million five hundred thousand",
            7_654_321: "seven million six hundred fifty-four thousand three hundred twenty-one",
            15_000_000: "fifteen million",
            50_000_100: "fifty million one hundred",
            87_654_321: "eighty-seven million six hundred fifty-four thousand three hundred twenty-one",
            99_000_000: "ninety-nine million",
        }

        for key, value in expected.items():
            result = get_words_for_num(key)
            self.assertEqual(result, value)

    def test_upper_bound(self):
        value = 999_999_999_999_999
        expected = (
            "nine hundred ninety-nine trillion nine hundred ninety-nine billion "
            "nine hundred ninety-nine million nine hundred ninety-nine thousand "
            "nine hundred ninety-nine"
        )
        result = get_words_for_num(value)
        self.assertEqual(result, expected)
