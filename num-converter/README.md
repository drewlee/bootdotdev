# Number to Word Converter

Python based CLI application to convert a number to its English text equivalent.
Can also run the reverse operation to convert a numeric text representation to a number.
Built as a
[personal project](https://www.boot.dev/lessons/b34b0f83-0af0-4bad-9e8d-65ebcd8d7cbc)
for Boot.dev.

## Usage

Convert number to text:

```sh
$ python3 -m main 87468
# Prints:
# eighty-seven thousand four hundred sixty-eight
```

Convert text to number:

```sh
$ python3 -m main "four hundred thirty one thousand nine"
# Prints:
# 431009
```

Run tests:

```sh
$ python3 -m unittest discover -s ./tests
```
