import type { CacheEntry, CacheConfig, RequestConfig } from '../types/core';

export interface CacheStore {
  get<T>(key: string): T | null;
  set<T>(key: string, data: T, ttl?: number): void;
  delete(key: string): boolean;
  clear(): void;
  has(key: string): boolean;
  size(): number;
}

const DEFAULT_CONFIG: CacheConfig = {
  enabled: true,
  ttl: 5 * 60 * 1000,
  maxSize: 100,
};

export function createCacheStore(config?: Partial<CacheConfig>): CacheStore {
  const cache = new Map<string, CacheEntry>();
  const ttl = config?.ttl ?? DEFAULT_CONFIG.ttl;
  const maxSize = config?.maxSize ?? DEFAULT_CONFIG.maxSize;

  const cleanup = (): void => {
    const now = Date.now();
    for (const [key, entry] of cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        cache.delete(key);
      }
    }
  };

  const evictIfNeeded = (): void => {
    if (cache.size >= maxSize) {
      const oldestKey = cache.keys().next().value;
      if (oldestKey) {
        cache.delete(oldestKey);
      }
    }
  };

  return {
    get<T>(key: string): T | null {
      cleanup();
      const entry = cache.get(key);
      if (!entry) return null;
      
      if (Date.now() - entry.timestamp > entry.ttl) {
        cache.delete(key);
        return null;
      }
      
      return entry.data as T;
    },

    set<T>(key: string, data: T, customTtl?: number): void {
      evictIfNeeded();
      cache.set(key, {
        data,
        timestamp: Date.now(),
        ttl: customTtl ?? ttl,
        key,
      });
    },

    delete(key: string): boolean {
      return cache.delete(key);
    },

    clear(): void {
      cache.clear();
    },

    has(key: string): boolean {
      const entry = cache.get(key);
      if (!entry) return false;
      
      if (Date.now() - entry.timestamp > entry.ttl) {
        cache.delete(key);
        return false;
      }
      
      return true;
    },

    size(): number {
      cleanup();
      return cache.size;
    },
  };
}

export function generateCacheKey(config: RequestConfig): string {
  const url = config.url;
  const method = config.method;
  const params = config.params ? JSON.stringify(config.params) : '';
  const body = config.body ? JSON.stringify(config.body) : '';
  
  return `${method}:${url}:${params}:${body}`;
}
