const profaneWords = new Set([
  'kerfuffle',
  'sharbert',
  'fornax',
]);

/**
 * Replaces profane words in the given post.
 *
 * @param post - Post to clean.
 * @returns Cleaned post.
 */
export function cleanWords(post: string): string {
  const words = post.split(' ');

  return words.map((word) => {
    if (profaneWords.has(word.toLowerCase())) {
      return '****';
    }
    return word;
  }).join(' ');
}
