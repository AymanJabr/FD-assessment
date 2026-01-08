// NOT USED SINCE REGIONS ARE FETCHED AT BUILD TIME

import { NextResponse } from 'next/server';
// import { fetchRegions } from '@/src/lib/api-client';

// // ISR with weekly revalidation
// export const revalidate = ONE_WEEK_SECONDS;

// /**
//  * GET /api/regions/[countryId]
//  *
//  * Returns regions for a specific country with ISR caching.
//  * User sees old data immediately (no loading), fresh data is fetched
//  * in the background and served to the next user.
//  */
// export async function GET(
//   request: Request,
//   { params }: { params: Promise<{ countryId: string }> }
// ) {
//   try {
//     const { countryId } = await params;
//     const regions = await fetchRegions(countryId);
//     return NextResponse.json(regions);
//   } catch (error) {
//     console.error('Error fetching regions:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch regions' },
//       { status: 500 }
//     );
//   }
// }

export async function GET() {                                                       
   return NextResponse.json(                                                         
    { error: 'Not Implemented - Regions are fetched at build time' },               
    { status: 501 }                                                                 
  );                                                                                
} 