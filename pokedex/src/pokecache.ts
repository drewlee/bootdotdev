export type CacheEntry<T> = {
  createdAt: number;
  val: T;
};

/**
 * Handles caching for API fetch requests.
 */
export class Cache {
  #cache = new Map<string, CacheEntry<any>>();
  #reapIntervalId: NodeJS.Timeout | undefined = undefined;
  #interval: number;

  constructor(interval: number) {
    this.#interval = interval;
    this.#startReapLoop();
  }

  /**
   * Adds an entry to the cache.
   *
   * @param key - Lookup key.
   * @param val - Value to cache.
   */
  add<T>(key: string, val: T): void {
    this.#cache.set(key, {
      createdAt: Date.now(),
      val,
    });
  }

  /**
   * Retrieves the specified entry from the cache.
   *
   * @param key - Lookup key.
   * @returns Cached value.
   */
  get<T>(key: string): T | undefined {
    return this.#cache.get(key)?.val;
  }

  /**
   * Flushes expired values from the cache.
   */
  #reap(): void {
    for (const [key, value] of this.#cache) {
      if (value.createdAt < Date.now() - this.#interval) {
        this.#cache.delete(key);
      }
    }
  }

  /**
   * Initializes polling to flush expired values from the cache.
   */
  #startReapLoop(): void {
    this.#reapIntervalId = setInterval(() => this.#reap(), this.#interval);
  }

  /**
   * Halts polling to flush expired values from the cache.
   */
  stopReapLoop() {
    clearInterval(this.#reapIntervalId);
    this.#reapIntervalId = undefined;
  }
}
