// NOT USED SINCE COUNTRIES ARE FETCHED AT BUILD TIME

import { NextResponse } from 'next/server';
// import { fetchCountries } from '@/src/lib/api-client';

// ISR with weekly revalidation
// export const revalidate = ONE_WEEK_SECONDS;

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

export async function GET() {                                                       
   return NextResponse.json(                                                         
    { error: 'Not Implemented - Countries are fetched at build time' },               
    { status: 501 }                                                                 
  );                                                                                
} 
