import { NextResponse } from 'next/server';
import { getCachedWithTimestamp, setCached } from '@/src/lib/redis';
import { City } from '@/src/types/address';
import { ONE_WEEK_MS, THREE_WEEKS_MS, THREE_WEEKS_SECONDS } from '@/src/utils';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * GET /api/cities/[regionId]
 *
 * Returns cities for a specific region with Redis caching.
 *
 * Three-tier caching strategy:
 * - Week 0-1 (Fresh): Return immediately, no refresh
 * - Week 1-3 (Stale): Return stale data immediately + background refresh
 * - Week 3+ (Deleted): Cache miss, show loading, fetch from backend
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

      // FRESH: Data is < 1 week old, return immediately
      if (age < ONE_WEEK_MS) {
        return NextResponse.json(cached.data);
      }

      // STALE: Data is 1-3 weeks old
      // Return stale data immediately + trigger background refresh
      if (age < THREE_WEEKS_MS) {
        const response = NextResponse.json(cached.data);

        // Trigger background refresh (don't await - fire and forget)
        refreshCitiesInBackground(regionId, cacheKey);

        return response;
      }

      // If age >= 3 weeks, Redis should have deleted it already
      // This is a safety fallback - treat as cache miss
    }

    // DELETED: Cache miss (first request or Redis deleted after 3 weeks)
    // Show loading, fetch from backend
    const cities = await fetchCitiesFromBackend(regionId);

    // Store in Redis with 3-week TTL
    await setCached(cacheKey, cities, THREE_WEEKS_SECONDS);

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
 * Backend wraps response in {data: [...]} format
 */
async function fetchCitiesFromBackend(regionId: string): Promise<City[]> {
  const url = `${BACKEND_URL}/api/cities/${regionId}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }

  const json = await response.json();
  return json.data; // Unwrap the data field
}

/**
 * Refreshes cities data in the background (fire and forget)
 * Updates Redis cache with fresh data and new timestamp
 */
function refreshCitiesInBackground(regionId: string, cacheKey: string): void {
  fetchCitiesFromBackend(regionId)
    .then((cities) => setCached(cacheKey, cities, THREE_WEEKS_SECONDS))
    .catch((err) => console.error('Background refresh failed:', err));
}
