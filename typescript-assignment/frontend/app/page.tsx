import { fetchCountries, fetchRegions } from '@/src/lib/api-client';
import { AddressPickerWrapper } from '@/src/components/AddressPickerWrapper';
import { Toaster } from 'sonner';
import { Region } from '@/src/types/address';

// Revalidate every week
export const revalidate = 7 * 24 * 60 * 60;

export default async function Home() {
  // Fetch countries at build time
  const countries = await fetchCountries();

  // Fetch ALL regions for ALL countries at build time (5000 total global regions, maybe 200 calls individually)
  const allRegionsPromises = countries.map((country) =>
    fetchRegions(country.id).catch((err) => {
      console.error(`Failed to fetch regions for ${country.name}:`, err);
      return [];
    })
  );

  const allRegionsArrays = await Promise.all(allRegionsPromises);
  const allRegions: Region[] = allRegionsArrays.flat();

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <Toaster position="top-right" richColors />

      <main className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">
            Delivery Address Picker
          </h1>
          <p className="text-gray-600 mb-8">
            Select your delivery address by choosing country, region, city, and entering address details.
          </p>

          <AddressPickerWrapper initialCountries={countries} initialRegions={allRegions} />
        </div>
      </main>
    </div>
  );
}
