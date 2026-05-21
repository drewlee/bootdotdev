word_convert = {
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "ten": 10,
    "eleven": 11,
    "twelve": 12,
    "thirteen": 13,
    "fourteen": 14,
    "fifteen": 15,
    "sixteen": 16,
    "seventeen": 17,
    "eighteen": 18,
    "nineteen": 19,
    "twenty": 20,
    "thirty": 30,
    "forty": 40,
    "fifty": 50,
    "sixty": 60,
    "seventy": 70,
    "eighty": 80,
    "ninety": 90,
}

place_convert = {
    "thousand": 1_000,
    "million": 1_000_000,
    "billion": 1_000_000_000,
    "trillion": 1_000_000_000_000,
}


def get_num_for_words(words_input):
    """
    Converts the number given in English words to a numeric value.
    E.g., returns `99` when given `ninety-nine`.

    Args:
        words (str): Word equivalent of a number to convert.

    Returns:
        int: Numeric value for the given word equivalent of a number.
    """
    words = words_input.split(" ")
    num = 0
    chunk = 0

    for word in words:
        # Values are calculated in chunks
        if word in word_convert:
            # Handle 1 thru 19 and whole tens, e.g., 20, 30, etc.
            chunk += word_convert[word]
        elif "-" in word:
            # Handle hyphenated tens, e.g., 21, 34, 59, etc.
            tens_word, ones_word = word.split("-")
            tens = word_convert[tens_word]
            ones = word_convert[ones_word]
            chunk += tens + ones
        elif word == "hundred":
            # Handle 100
            chunk *= 100
        elif word in place_convert:
            # Handle thousand, million, billion, etc.
            # Represents the termination of a chunk
            chunk *= place_convert[word]
            num += chunk
            chunk = 0

    num += chunk
    return num
