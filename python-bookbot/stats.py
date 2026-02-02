def get_word_count(book_text):
  word_count = 0
  lines_list = book_text.split("\n")

  for line in lines_list:
    word_list = line.split(" ")

    for word in word_list:
      if word:
        word_count += 1

  return word_count

def get_character_count(book_text):
  char_count = {}
  for char in book_text:
    lc_char = char.lower()

    if lc_char not in char_count:
      char_count[lc_char] = 0

    char_count[lc_char] = char_count[lc_char] + 1

  return char_count

def sort_character_count(char_count_dict):
  char_count_list = []
  for key, value in char_count_dict.items():
    char_count_list.append({ "char": key, "num": value})

  def sort_on(items):
    return items["num"]

  char_count_list.sort(reverse=True, key=sort_on)
  return char_count_list
