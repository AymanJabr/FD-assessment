// NOT IMPLEMENTED YET


import { NextResponse } from 'next/server';
// import { getCachedWithTimestamp, setCached } from '@/src/lib/redis';
// import { City } from '@/src/types/address';

// const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';


// /**
//  * GET /api/streets/[cityId]
//  *
//  * Returns streets for a specific city with Redis caching.
//  *
//  * Strategy:
//  * - First request: Cache miss → Show loading, fetch from backend, cache result
//  * - Subsequent requests (for all users requesting the same region's cities): Cache hit → Return immediately
//  * - After 1 week: Return stale data immediately, refresh in background for next user
//  */
// export async function GET(
//   request: Request,
//   { params }: { params: Promise<{ cityId: string }> }
// ) {
//   try {
//     const { cityId } = await params;
//     const cacheKey = `streets:${cityId}`;

//     // Check Redis cache
//     const cached = await getCachedWithTimestamp<City[]>(cacheKey);

//     if (cached) {
//       const age = Date.now() - cached.timestamp;

//       // If data is fresh (< 1 week old), return immediately
//       if (age < ONE_WEEK_MS) {
//         return NextResponse.json(cached.data);
//       }

//       // Data is stale (> 1 week old)
//       // Return stale data immediately, then refresh in background
//       const response = NextResponse.json(cached.data);

//       // Trigger background refresh (don't await)
//       refreshStreetsInBackground(cityId, cacheKey);

//       return response;
//     }

//     // Cache miss - fetch from backend
//     const streets = await fetchStreetsFromBackend(cityId);

//     // Store in Redis
//     await setCached(cacheKey, streets, ONE_WEEK_SECONDS);

//     return NextResponse.json(streets);
//   } catch (error) {
//     console.error('Error fetching streets:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch streets' },
//       { status: 500 }
//     );
//   }
// }

// /**
//  * Fetches streets from the Python backend
//  */
// async function fetchStreetsFromBackend(cityId: string): Promise<City[]> {
//   const url = `${BACKEND_URL}/api/streets/${cityId}`;
//   const response = await fetch(url);

//   if (!response.ok) {
//     throw new Error(`Backend error: ${response.status}`);
//   }

//   return response.json();
// }

// /**
//  * Refreshes streets data in the background (fire and forget)
//  */
// function refreshStreetsInBackground(cityId: string, cacheKey: string): void {
//   fetchStreetsFromBackend(cityId)
//     .then((streets) => setCached(cacheKey, streets, ONE_WEEK_SECONDS))
//     .catch((err) => console.error('Background refresh failed:', err));
// }

export async function GET() {                                                       
   return NextResponse.json(                                                         
    { error: 'Not Implemented' },               
    { status: 501 }                                                                 
  );                                                                                
} 