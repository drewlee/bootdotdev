import re
from word_convert import word_convert, place_convert


def get_int(num_str: str) -> int | None:
    """
    Converts the given numeric str to int.

    Args:
        num_str (str): Value to convert.

    Returns:
        (int | None): Value as int. None if the given value is not a number.
    """
    try:
        return int(num_str)
    except ValueError:
        return None


def is_numeric(input_arg: str) -> bool:
    """
    Determines whether the provided input is numeric.

    Args:
        input_arg (str): Input value to test.

    Returns:
        bool: Whether the input is numeric.
    """
    if len(input_arg.split(" ")) > 1:
        return False

    input_arg = re.sub(r",|\.", "", input_arg)
    is_match = re.fullmatch(r"^\d+$", input_arg)

    return is_match is not None


def get_clean_input(input_arg: str) -> str:
    """
    Formats and normalizes the provided user input.

    Args:
        input_arg (str): User input.

    Returns:
        str: Formatted user input.
    """
    clean = re.sub(r",|\.", "", input_arg.strip().lower())
    clean_list = filter(lambda x: x not in ("", "and"), clean.split(" "))
    output = " ".join(list(clean_list))

    return output


def is_valid_word_input(input_arg: str) -> str | None:
    """
    Determines whether the provided number written in text is valid.

    Args:
        input_arg (str): Input value to test.

    Returns:
        str | None: First encountered invalid string. None if input is valid.
    """
    words = input_arg.split(" ")

    for word in words:
        if "-" in word:
            word_a, word_b = word.split("-")
            if word_a not in word_convert or word_b not in word_convert:
                return word
        elif (
            word not in word_convert and word not in place_convert and word != "hundred"
        ):
            return word

    return None
