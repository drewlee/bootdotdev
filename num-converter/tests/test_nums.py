import unittest
from nums import get_num_for_words


class TestGetNumsForWords(unittest.TestCase):
    def test_single_digits(self):
        values = [
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

        for i, value in enumerate(values):
            result = get_num_for_words([value])
            self.assertEqual(result, i)

    def test_teens(self):
        values = [
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

        for i in range(10, len(values) + 10):
            result = get_num_for_words([values[i - 10]])
            self.assertEqual(result, i)

    def test_whole_tens(self):
        values = {
            "twenty": 20,
            "thirty": 30,
            "forty": 40,
            "fifty": 50,
            "sixty": 60,
            "seventy": 70,
            "eighty": 80,
            "ninety": 90,
        }

        for key, value in values.items():
            result = get_num_for_words([key])
            self.assertEqual(result, value)

    def test_tens_range(self):
        values = {
            "sixty-one": 61,
            "sixty-two": 62,
            "sixty-three": 63,
            "sixty-four": 64,
            "sixty-five": 65,
            "sixty-six": 66,
            "sixty-seven": 67,
            "sixty-eight": 68,
            "sixty-nine": 69,
        }

        for key, value in values.items():
            result = get_num_for_words([key])
            self.assertEqual(result, value)

    def test_whole_hundreds(self):
        values = [
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

        for i, value in enumerate(values):
            result = get_num_for_words(value.split(" "))
            self.assertEqual(result, (i + 1) * 100)

    def test_whole_thousands_plus(self):
        values = {
            "one thousand": 1_000,
            "ten thousand": 10_000,
            "one hundred thousand": 100_000,
            "one million": 1_000_000,
            "ten million": 10_000_000,
            "one hundred million": 100_000_000,
            "one billion": 1_000_000_000,
            "ten billion": 10_000_000_000,
            "one hundred billion": 100_000_000_000,
            "one trillion": 1_000_000_000_000,
            "ten trillion": 10_000_000_000_000,
            "one hundred trillion": 100_000_000_000_000,
        }

        for key, value in values.items():
            result = get_num_for_words(key.split(" "))
            self.assertEqual(result, value)

    def test_various_values(self):
        values = {
            "one thousand one hundred": 1_100,
            "one thousand two hundred thirty-four": 1_234,
            "five thousand": 5_000,
            "eleven thousand eleven": 11_011,
            "twenty-five thousand one hundred": 25_100,
            "forty-two thousand six hundred seventy-eight": 42_678,
            "ninety-nine thousand nine hundred ninety-nine": 99_999,
            "one hundred thousand five hundred": 100_500,
            "three hundred thousand fifty": 300_050,
            "one million one": 1_000_001,
            "two million five hundred thousand": 2_500_000,
            "seven million six hundred fifty-four thousand three hundred\
                twenty-one": 7_654_321,
            "fifteen million": 15_000_000,
            "fifty million one hundred": 50_000_100,
            "eighty-seven million six hundred fifty-four thousand three hundred\
                twenty-one": 87_654_321,
            "ninety-nine million": 99_000_000,
        }

        for key, value in values.items():
            result = get_num_for_words(key.split(" "))
            self.assertEqual(result, value)

    def test_upper_bounds(self):
        values = {
            "nine hundred ninety-nine": 999,
            "nine thousand nine hundred ninety-nine": 9_999,
            "ninety-nine thousand nine hundred ninety-nine": 99_999,
            "nine hundred ninety-nine thousand nine hundred ninety-nine": 999_999,
            "nine million nine hundred ninety-nine thousand nine hundred ninety-nine": (
                9_999_999
            ),
            "ninety-nine million nine hundred ninety-nine thousand nine hundred\
                ninety-nine": 99_999_999,
            "nine hundred ninety-nine million nine hundred ninety-nine thousand nine\
                hundred ninety-nine": 999_999_999,
            "nine billion nine hundred ninety-nine million nine hundred ninety-nine\
                thousand nine hundred ninety-nine": 9_999_999_999,
            "ninety-nine billion nine hundred ninety-nine million nine hundred\
                ninety-nine thousand nine hundred ninety-nine": 99_999_999_999,
            "nine hundred ninety-nine billion nine hundred ninety-nine million nine\
                hundred ninety-nine thousand nine hundred ninety-nine": 999_999_999_999,
            "nine trillion nine hundred ninety-nine billion nine hundred ninety-nine\
                million nine hundred ninety-nine thousand nine hundred ninety-nine": (
                9_999_999_999_999
            ),
            "ninety-nine trillion nine hundred ninety-nine billion nine hundred\
                ninety-nine million nine hundred ninety-nine thousand nine hundred\
                    ninety-nine": (99_999_999_999_999),
            "nine hundred ninety-nine trillion nine hundred ninety-nine billion nine\
                hundred ninety-nine million nine hundred ninety-nine thousand nine\
                    hundred ninety-nine": (999_999_999_999_999),
        }

        for key, value in values.items():
            result = get_num_for_words(key.split(" "))
            self.assertEqual(result, value)
