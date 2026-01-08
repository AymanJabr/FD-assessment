'use client';

import { useRef, useCallback } from 'react';

/**
 * Generic client-side memoization hook
 *
 * This provides the final caching layer for individual users.
 * When a user requests cities for a region (or streets for a city), we cache it client-side
 * so repeated requests in the same session don't hit the server.
 */
export function useClientCache<T>() {
  const cacheRef = useRef<Map<string, T>>(new Map()); // A map of key-value pairs, This needs to be memoized so the Map doesn't vanish (become empty) on every re-render 

  const get = useCallback((key: string): T | undefined => {
    return cacheRef.current.get(key);
  }, []);

  const set = useCallback((key: string, value: T): void => {
    cacheRef.current.set(key, value);
  }, []);

  return { get, set };
}
