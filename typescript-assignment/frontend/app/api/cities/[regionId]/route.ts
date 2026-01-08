import { NextResponse } from 'next/server';
import { getCachedWithTimestamp, setCached } from '@/src/lib/redis';
import { City } from '@/src/types/address';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const ONE_WEEK_SECONDS = 7 * 24 * 60 * 60;

/**
 * GET /api/cities/[regionId]
 *
 * Returns cities for a specific region with Redis caching.
 *
 * Strategy:
 * - First request: Cache miss → Show loading, fetch from backend, cache result
 * - Subsequent requests (for all users requesting the same region's cities): Cache hit → Return immediately
 * - After 1 week: Return stale data immediately, refresh in background for next user
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ regionId: string }> }
) {
  try {
    const { regionId } = await params;
    const cacheKey = `cities:${regionId}`;

    // Check Redis cache
    const cached = await getCachedWithTimestamp<City[]>(cacheKey);

    if (cached) {
      const age = Date.now() - cached.timestamp;

      // If data is fresh (< 1 week old), return immediately
      if (age < ONE_WEEK_MS) {
        return NextResponse.json(cached.data);
      }

      // Data is stale (> 1 week old)
      // Return stale data immediately, then refresh in background
      const response = NextResponse.json(cached.data);

      // Trigger background refresh (don't await)
      refreshCitiesInBackground(regionId, cacheKey);

      return response;
    }

    // Cache miss - fetch from backend
    const cities = await fetchCitiesFromBackend(regionId);

    // Store in Redis
    await setCached(cacheKey, cities, ONE_WEEK_SECONDS);

    return NextResponse.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500 }
    );
  }
}

/**
 * Fetches cities from the Python backend
 */
async function fetchCitiesFromBackend(regionId: string): Promise<City[]> {
  const url = `${BACKEND_URL}/regions/${regionId}/cities`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }

  return response.json();
}

/**
 * Refreshes cities data in the background (fire and forget)
 */
function refreshCitiesInBackground(regionId: string, cacheKey: string): void {
  fetchCitiesFromBackend(regionId)
    .then((cities) => setCached(cacheKey, cities, ONE_WEEK_SECONDS))
    .catch((err) => console.error('Background refresh failed:', err));
}
