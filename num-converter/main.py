import sys
from words import get_words_for_num


def format_num_str(num_str):
    return num_str.replace(",", "")


def get_int(num_str):
    try:
        num_int = int(num_str)
        return num_int
    except ValueError:
        return None


def main():
    if len(sys.argv) < 2:
        print("Usage: python main.py <number>")
        sys.exit(1)

    input_num_str = sys.argv[1]
    num_str = format_num_str(input_num_str)
    num_int = get_int(num_str)

    if num_int is None:
        print(f"Error: Input '{input_num_str}' is not a valid integer")
        sys.exit(1)

    if num_int < 0:
        print(f"Error: Input '{input_num_str}' can not be a negative value")
        sys.exit(1)

    output = get_words_for_num(num_int)
    print(output)


if __name__ == "__main__":
    main()
