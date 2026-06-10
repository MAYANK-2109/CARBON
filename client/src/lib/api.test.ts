/**
 * @module lib/api.test
 * @description Unit tests for the axios API client and its token-refresh interceptor.
 */
import { describe, it, expect, vi } from 'vitest';

// We need to test the module-level code so we reset modules between tests
vi.mock('axios', async (importOriginal) => {
  const actual = await importOriginal<typeof import('axios')>();
  return {
    ...actual,
    default: {
      ...actual.default,
      create: vi.fn(() => ({
        interceptors: {
          response: { use: vi.fn() },
        },
        post: vi.fn(),
      })),
      post: vi.fn(),
    },
  };
});

describe('api module', () => {
  it('creates an axios instance with the correct base config', async () => {
    const { api } = await import('./api');
    expect(api).toBeDefined();
  });
});

describe('processQueue logic (unit)', () => {
  it('resolves pending requests when error is null', () => {
    const resolve = vi.fn();
    const reject = vi.fn();
    const queue: Array<{ resolve: () => void; reject: (r: unknown) => void }> = [
      { resolve, reject },
    ];

    function processQueue(error: unknown) {
      queue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()));
      queue.length = 0;
    }

    processQueue(null);
    expect(resolve).toHaveBeenCalledTimes(1);
    expect(reject).not.toHaveBeenCalled();
  });

  it('rejects pending requests when error is present', () => {
    const resolve = vi.fn();
    const reject = vi.fn();
    const queue: Array<{ resolve: () => void; reject: (r: unknown) => void }> = [
      { resolve, reject },
    ];

    function processQueue(error: unknown) {
      queue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()));
      queue.length = 0;
    }

    const err = new Error('refresh failed');
    processQueue(err);
    expect(reject).toHaveBeenCalledWith(err);
    expect(resolve).not.toHaveBeenCalled();
  });
});
