// NOT USED SINCE COUNTRIES ARE FETCHED AT BUILD TIME

// import { NextResponse } from 'next/server';
// import { fetchCountries } from '@/src/lib/api-client';

// ISR with weekly revalidation
// export const revalidate = 7 * 24 * 60 * 60; // 1 week in seconds

// /**
//  * GET /api/countries
//  *
//  * Returns all countries with ISR caching.
//  * Data is statically generated at build time and revalidated weekly.
//  */
// export async function GET() {
//   try {
//     const countries = await fetchCountries();
//     return NextResponse.json(countries);
//   } catch (error) {
//     console.error('Error fetching countries:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch countries' },
//       { status: 500 }
//     );
//   }
// }
