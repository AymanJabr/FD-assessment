# TypeScript/React Assignment - FD Address Picker

A delivery address picker component with smart caching mechanism for an international online marketplace.

## How it works

We get all countries at once in server-side with Next, revalidate them every week, there are 200 something countries (unlikely to change, but who knows with what is going on 🤷), so we just refetch them once a week or at build server-side.

We then want to also get the regions server-side, There are around 50 regions in your average big country (5000 total globally), since the backend is slow, it would be wiser to also get them at build time, and send them directly when the user asks for them. 
We revalidate those once a user asks for them, so if the User asks for the regions in the Netherlands, we show them the old data, and do the region fetch call for the netherlands again server-side, so the next person that asks for the Netherlands regions has the new data without seeing any lag.

We then want to start the caching for cities (since apparently there are 40K+ places on earth with more than 100K people), we can't send all this data server-side at build time, but we still want to cache it server-side with Redis for the most-often asked-for regions.
When the first user selects a region, we will show loading on the dropdown for cities, do the call, and save the result cities of that region in a Redis cache, so that if that user (or others) asks again for the cities in that region, we already have the answer. This last caching system in Redis will also be used for more finely grained calls (like street level). This way, the region cities/ or city streets that are most called for are in-memory, and we don't force each and every user to wait for them. Maybe we should also invalidate a Redis cached call after a week, we again show the old data so there is no lag, and the fetch the new data for the next client to come along

<!-- NOTE: we could be using unstable_cache in Next directly: https://nextjs.org/docs/app/api-reference/functions/unstable_cache, but it's still new and it depends on the memory of the Next server. I chose to go with the more robust and scalable solution of using Redis -->

We also want to add a futher layer of improvement for the individual user, that is a Memoization of the result of a specific call, so if a user has already asked for that region cities/ or city streets, we already have the answer client-side.

## Features

- Server-side caching for countries and regions
- Redis caching for cities (and streets)
- Client-side caching for cities (and streets)

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- Next.js 16
- TypeScript
- Tailwind CSS
- React
