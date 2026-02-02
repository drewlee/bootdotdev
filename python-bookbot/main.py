from stats import get_word_count, get_character_count, sort_character_count
import sys

def get_book_text(filepath):
  with open(filepath) as f:
    file_contents = f.read()
    return file_contents

def main():
  if len(sys.argv) != 2:
    print("Usage: python3 main.py <path_to_book>")
    sys.exit(1)

  book_path = sys.argv[1]
  book_text = get_book_text(book_path)
  num_words = get_word_count(book_text)
  char_count = get_character_count(book_text)
  formatted_char_count = sort_character_count(char_count)

  print(f"Found {num_words} total words")

  for entry in formatted_char_count:
    if entry["char"].isalpha():
      print(f"{entry["char"]}: {entry["num"]}")

main()
