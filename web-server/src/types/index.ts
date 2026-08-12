export const SORT_OPTIONS = ['asc', 'desc'] as const;

export type SortOption = typeof SORT_OPTIONS[number];
