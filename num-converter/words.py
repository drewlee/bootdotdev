from numerals_ref import numeral_dict, chunk_dict


def get_words_for_num(num):
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
            words.append(chunk_dict[count])

        if tens > 0:
            if tens < 20:
                # Handle 1 thru 19
                words.append(numeral_dict[tens])
            else:
                # Handle 20 thru 99
                ones = tens % 10
                if ones > 0:
                    # Ones place is other than 0
                    words.append(f"{numeral_dict[tens - ones]}-{numeral_dict[ones]}")
                else:
                    # Ones place is 0, e.g., 20, 30, 40, etc.
                    words.append(numeral_dict[tens])

        # Handle 100 thru 900
        hundreds = chunk // 100
        if hundreds > 0:
            words.append(chunk_dict[0])  # "hundred"
            words.append(numeral_dict[hundreds])

        # Discard the processed chunk of 3 digits
        chunks = chunks // 1000
        count += 1

    words.reverse()
    return " ".join(words)
