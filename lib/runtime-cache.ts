type CacheEntry<T> = {
  expiresAt: number;
  value: T;
};

export class RuntimeCache<T> {
  private store = new Map<string, CacheEntry<T>>();

  constructor(private ttlMs: number) {}

  get(key: string) {
    const entry = this.store.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }

    return entry.value;
  }

  set(key: string, value: T, ttlMs?: number) {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + (ttlMs ?? this.ttlMs)
    });
  }
}
