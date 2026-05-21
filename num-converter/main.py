import sys
from num_convert import get_words_for_num
from word_convert import get_num_for_words
from utils import get_clean_input, get_int, is_numeric, is_valid_word_input


def main():
    """
    Application entry point.
    """
    # Handle missing arg
    if len(sys.argv) < 2:
        msg = (
            "Usage: python3 -m main <numeric_value>\n"
            "- Supported values include positive whole numbers under one quadrillion"
        )
        print(msg)
        sys.exit(1)

    input_str = sys.argv[1]
    clean_input = get_clean_input(input_str)

    # Determine whether the input is numeric
    if is_numeric(clean_input):
        # Exit on decimal values
        if "." in input_str:
            print("Error: Input must be a whole number")
            sys.exit(1)

        num_int = get_int(clean_input)

        # Exit on invalid int
        if num_int is None:
            print(f"Error: Input '{input_str}' is not a valid integer")
            sys.exit(1)

        # Exit on negative numbers
        if num_int < 0:
            print(f"Error: Input '{input_str}' can not be a negative value")
            sys.exit(1)

        output = get_words_for_num(num_int)
        print(output)
    else:
        invalid_str = is_valid_word_input(clean_input)

        # Exit on non-numeric token
        if invalid_str is not None:
            print(f"Error: Input '{invalid_str}' is not a valid numeric value")
            sys.exit(1)

        output = get_num_for_words(clean_input)
        print(output)


if __name__ == "__main__":
    main()
