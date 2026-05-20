from numerals_ref import word_dict, place_dict


def get_num_for_words(words):
    # nine hundred ninety-nine thousand nine hundred ninety-nine
    # 9    100     99          1000     9    100     99
    # 900 + 99_999
    # 900 should be 900_000
    # 100 * 99_999 = 999_990
    #
    # 9
    # 9 * 100 = 900
    # 900 + 99 = 999
    # 999 * 1000 = 999_000
    # 999_000
    # 9
    # 9 * 100 = 900
    # 999
    # 999_000 + 999 = 999_999
    num = 0
    i = 0

    while i < len(words):
        chunk = 0

        while i < len(words):
            word = words[i]

            if word in word_dict:
                chunk += word_dict[word]
            elif "-" in word:
                tens_word, ones_word = word.split("-")
                tens = word_dict[tens_word]
                ones = word_dict[ones_word]
                chunk += tens + ones
            elif word == "hundred":
                chunk *= 100
            elif word in place_dict:
                chunk *= place_dict[word]
                break

            i += 1

        num += chunk
        i += 1

    return num

    """
    num = 0
    i = 0

    while i < len(words):
        chunk = 0

        while i < len(words):
            word = words[i]

            if word in word_dict:
                chunk += word_dict[word]
            elif "-" in word:
                tens_word, ones_word = word.split("-")
                tens = word_dict[tens_word]
                ones = word_dict[ones_word]
                chunk += tens + ones
            elif word == "hundred":
                chunk *= 100
            elif word in place_dict:
                chunk *= place_dict[word]
                break

            i += 1

        num += chunk
        i += 1

    return num
    """
