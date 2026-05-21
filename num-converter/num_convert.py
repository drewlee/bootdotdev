numeral_convert = {
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
    10: "ten",
    11: "eleven",
    12: "twelve",
    13: "thirteen",
    14: "fourteen",
    15: "fifteen",
    16: "sixteen",
    17: "seventeen",
    18: "eighteen",
    19: "nineteen",
    20: "twenty",
    30: "thirty",
    40: "forty",
    50: "fifty",
    60: "sixty",
    70: "seventy",
    80: "eighty",
    90: "ninety",
}

place_convert = {
    0: "hundred",
    1: "thousand",
    2: "million",
    3: "billion",
    4: "trillion",
}


def get_words_for_num(num: int) -> str:
    """
    Converts the given numeric value into its English text equivalent.
    E.g., returns `ninety-nine` when given `99`.

    Args:
        num (int): Numeric value to convert.

    Returns:
        str: English text representation of the given numeric value.
    """
    words = []

    if num == 0:
        return "zero"

    chunks = num
    count = 0

    # Parse number in chunks of 3 digits
    while chunks > 0:
        # Get the first 3 digits from the right
        chunk = chunks % 1000
        # Get the first 2 digits from the right to handle 0 thru 99
        tens = chunk % 100

        # Handle the words thousand, million, billion, etc.
        if count > 0 and chunk > 0:
            words.append(place_convert[count])

        if tens > 0:
            if tens < 20:
                # Handle 1 thru 19
                words.append(numeral_convert[tens])
            else:
                # Handle 20 thru 99
                ones = tens % 10
                if ones > 0:
                    # Ones place is other than 0
                    words.append(
                        f"{numeral_convert[tens - ones]}-{numeral_convert[ones]}"
                    )
                else:
                    # Ones place is 0, e.g., 20, 30, 40, etc.
                    words.append(numeral_convert[tens])

        # Handle 100 thru 900
        hundreds = chunk // 100
        if hundreds > 0:
            words.append(place_convert[0])  # "hundred"
            words.append(numeral_convert[hundreds])

        # Discard the processed chunk of 3 digits
        chunks = chunks // 1000
        count += 1

    words.reverse()
    return " ".join(words)
