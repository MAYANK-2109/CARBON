/**
 * @module lib/useApi
 * @description Generic hook for data fetching with automatic AbortController cleanup.
 * Cancels in-flight requests when the component unmounts, preventing state updates
 * on unmounted components and memory leaks.
 *
 * @example
 * const { data, loading, error } = useApi(() => api.get('/tips'));
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import type { AxiosResponse } from 'axios';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

type ApiCall<T> = (signal: AbortSignal) => Promise<AxiosResponse<T>>;

export function useApi<T>(apiCall: ApiCall<T>, deps: unknown[] = []) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  // Stable ref to apiCall to avoid re-renders from inline arrow functions
  const apiCallRef = useRef(apiCall);
  // eslint-disable-next-line react-hooks/refs
  apiCallRef.current = apiCall;

  const execute = useCallback(() => {
    const controller = new AbortController();

    setState((prev) => ({ ...prev, loading: true, error: null }));

    apiCallRef.current(controller.signal)
      .then((res) => {
        if (!controller.signal.aborted) {
          setState({ data: res.data, loading: false, error: null });
        }
      })
      .catch((err: { message?: string }) => {
        if (!controller.signal.aborted) {
          setState({ data: null, loading: false, error: err?.message ?? 'Request failed' });
        }
      });

    return controller;
  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/use-memo
  }, deps);

  useEffect(() => {
    const controller = execute();
    return () => controller.abort();
  }, [execute]);

  return state;
}
