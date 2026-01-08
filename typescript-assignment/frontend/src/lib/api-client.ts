import { Country, Region } from '../types/address';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * Generic fetch wrapper with error handling, This is used for asynchronous calls that we will do server-side
 * Backend wraps responses in {data: [...]} format
 */
async function fetchFromBackend<T>(endpoint: string): Promise<T> {
  const url = `${BACKEND_URL}${endpoint}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    return json.data; // Unwrap the data field
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Fetches all countries from the backend
 */
export async function fetchCountries(): Promise<Country[]> {
  return fetchFromBackend<Country[]>('/api/countries');
}

/**
 * Fetches regions for a specific country
 */
export async function fetchRegions(countryId: string): Promise<Region[]> {
  return fetchFromBackend<Region[]>(`/api/regions/${countryId}`);
}

/**
 * 
 * Fetches cities for a specific region, This is implemented with hooks, NOT WITH THIS FUNCTION
 
export async function fetchCities(regionId: string): Promise<City[]> {
  return fetchFromBackend<City[]>(`/regions/${regionId}/cities`);
} */


/**
 * 
 * NOT IMPLEMENTED YET
 * 
 * Fetches streets for a specific city, This is implemented with hooks, NOT WITH THIS FUNCTION
 
export async function fetchStreets(cityId: string): Promise<Street[]> {
  return fetchFromBackend<Street[]>(`/cities/${cityId}/streets`);
} */

