/** Set of "profane" words. */
const profaneWords = new Set(['kerfuffle', 'sharbert', 'fornax']);

/**
 * Replaces the profane words in the provided post.
 *
 * @param post - Post to scrub of profane words.
 * @returns Scrubbed post.
 */
export function cleanWords(post: string): string {
  const words = post.split(' ');

  return words
    .map((word) => {
      if (profaneWords.has(word.toLowerCase())) {
        return '****';
      }
      return word;
    })
    .join(' ');
}
