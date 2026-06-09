/**
 * @module config/cache
 * @description In-memory cache using node-cache.
 * Provides a simple TTL-based cache for API calculation results.
 * Can be swapped for Redis in production.
 */

import NodeCache from 'node-cache';

/** Cache instance with 5-minute default TTL and 60-second check period */
export const cache = new NodeCache({
  stdTTL: 300,
  checkperiod: 60,
  useClones: false,
  maxKeys: 1000,
});

/**
 * Generate a deterministic cache key from calculation inputs.
 * @param prefix - Cache key prefix (e.g., 'calc:travel')
 * @param data - Input object to hash
 * @returns Cache key string
 */
export function getCacheKey(prefix: string, data: Record<string, unknown>): string {
  const sorted = JSON.stringify(data, Object.keys(data).sort());
  return `${prefix}:${Buffer.from(sorted).toString('base64').slice(0, 64)}`;
}
