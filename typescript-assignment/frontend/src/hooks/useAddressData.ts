'use client';

import { useState } from 'react';
import { City } from '../types/address';
import { useClientCache } from './useClientCache';


// We only need the useCities (useCities, useStreets)


/**
 * Hook for fetching countries
 * Countries are fetched server-side with ISR (weekly revalidation), NOT WITH THESE HOOKS
 */
// export function useCountries() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchCountries = async (): Promise<Country[]> => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await fetch('/api/countries');
//       if (!response.ok) throw new Error('Failed to fetch countries');
//       const data: Country[] = await response.json();
//       return data;
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to fetch countries');
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return { fetchCountries, isLoading, error };
// }

/**
 * Hook for fetching regions
 * Regions are fetched server-side with ISR (on-demand revalidation), NOT WITH THESE HOOKS
 */
// export function useRegions() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchRegions = async (countryId: string): Promise<Region[]> => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(`/api/regions/${countryId}`);
//       if (!response.ok) throw new Error('Failed to fetch regions');
//       const data: Region[] = await response.json();
//       return data;
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to fetch regions');
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return { fetchRegions, isLoading, error };
// }

/**
 * Hook for fetching cities with client-side memoization
 * First user sees loading, result cached server-side with Redis
 * Client-side memoization prevents duplicate calls per user
 */
export function useCities() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cache = useClientCache<City[]>();

  const fetchCities = async (regionId: string): Promise<City[]> => {
    const cached = cache.get(regionId);
    if (cached) return cached;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/cities/${regionId}`);
      if (!response.ok) throw new Error('Failed to fetch cities');
      const data: City[] = await response.json();
      cache.set(regionId, data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cities');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchCities, isLoading, error };
}

/**
 * Hook for fetching streets with client-side memoization
 * 
 * 
 * NOT IMPLEMENTED YET
 */
// export function useStreets() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const cache = useClientCache<Street[]>();

//   const fetchStreets = async (cityId: string): Promise<Street[]> => {
//     const cached = cache.get(cityId);
//     if (cached) return cached;

//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(`/api/streets/${cityId}`);
//       if (!response.ok) throw new Error('Failed to fetch streets');
//       const data: Street[] = await response.json();
//       cache.set(cityId, data);
//       return data;
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to fetch streets');
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return { fetchStreets, isLoading, error };
// }

