'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Country, Region, City } from '../types/address';
import { useCities } from '../hooks/useAddressData';
import { Select } from './ui/Select';
import { Input } from './ui/Input';

const addressSchema = z.object({
  countryId: z.string().min(1, 'Please select a country'),
  regionId: z.string().min(1, 'Please select a region'),
  cityId: z.string().min(1, 'Please select a city'),
  street: z
    .string()
    .min(3, 'Street name must be at least 3 characters')
    .max(100, 'Street name must be less than 100 characters')
    .regex(/[a-zA-Z]/, 'Street name must contain at least one letter'),
  houseNumber: z
    .string()
    .min(1, 'House number is required')
    .max(10, 'House number must be less than 10 characters')
    .regex(/^[0-9a-zA-Z\s-]+$/, 'House number must be alphanumeric'),
  apartmentNumber: z
    .string()
    .min(1, 'Apartment number is required')
    .max(20, 'Apartment number must be less than 20 characters')
    .regex(/^[0-9a-zA-Z\s-]+$/, 'Apartment number must be alphanumeric'),
  postalCode: z
    .string()
    .min(3, 'Postal code must be at least 3 characters')
    .max(15, 'Postal code must be less than 15 characters')
    .regex(/^[0-9a-zA-Z\s-]+$/, 'Postal code must be alphanumeric'),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressPickerProps {
  countries: Country[];
  allRegions: Region[];
}

/**
 * Complete address picker component with all selectors and form inputs
 *
 * Handles:
 * - Country selection (pre-fetched at build time, ISR weekly)
 * - Region selection (pre-fetched at build time, ISR weekly, filtered client-side)
 * - City selection (fetched with Redis caching + client-side memoization)
 * - Address details input with validation
 * - Form submission with toast notification
 */
export function AddressPicker({
  countries,
  allRegions,
}: AddressPickerProps) {
  const [selectedCountryId, setSelectedCountryId] = useState('');
  const [selectedRegionId, setSelectedRegionId] = useState('');
  const [selectedCityId, setSelectedCityId] = useState('');
  const [cities, setCities] = useState<City[]>([]);

  const { fetchCities, isLoading: citiesLoading, error: citiesError } = useCities();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  // Filter regions by selected country (client-side)
  const filteredRegions = useMemo(() => {
    if (!selectedCountryId) return [];
    return allRegions.filter((region) => region.countryId === selectedCountryId);
  }, [selectedCountryId, allRegions]);

  // Handle country selection
  const handleCountryChange = (countryId: string) => {
    setSelectedCountryId(countryId);
    setSelectedRegionId('');
    setSelectedCityId('');
    setCities([]);
    setValue('countryId', countryId);
    setValue('regionId', '');
    setValue('cityId', '');
  };

  // Handle region selection
  const handleRegionChange = (regionId: string) => {
    setSelectedRegionId(regionId);
    setSelectedCityId('');
    setCities([]);
    setValue('regionId', regionId);
    setValue('cityId', '');
  };

  // Handle city selection
  const handleCityChange = (cityId: string) => {
    setSelectedCityId(cityId);
    setValue('cityId', cityId);
  };

  // Fetch cities when region changes
  useEffect(() => {
    if (!selectedRegionId) {
      return;
    }

    fetchCities(selectedRegionId)
      .then((data) => setCities(data))
      .catch((err) => console.error('Failed to fetch cities:', err));
  }, [selectedRegionId, fetchCities]);

  // Handle form submission
  const onSubmit = (data: AddressFormData) => {
    const country = countries.find((c) => c.id === data.countryId);
    const region = filteredRegions.find((r) => r.id === data.regionId);
    const city = cities.find((c) => c.id === data.cityId);

    const submittedData = {
      country: country?.name,
      region: region?.name,
      city: city?.name,
      street: data.street,
      houseNumber: data.houseNumber,
      apartmentNumber: data.apartmentNumber,
      postalCode: data.postalCode,
    };

    toast.success('Address submitted successfully!', {
      description: JSON.stringify(submittedData, null, 2),
    });

    console.log('Submitted address:', submittedData);
  };

  const countryOptions = countries.map((country) => ({
    value: country.id,
    label: country.name,
  }));

  const regionOptions = filteredRegions.map((region) => ({
    value: region.id,
    label: region.name,
  }));

  const cityOptions = cities.map((city) => ({
    value: city.id,
    label: city.name,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Country Selector */}
        <Select
          label="Country"
          value={selectedCountryId}
          onChange={handleCountryChange}
          options={countryOptions}
          placeholder="Select a country"
          error={errors.countryId?.message}
        />

        {/* Region Selector */}
        <Select
          label="Region"
          value={selectedRegionId}
          onChange={handleRegionChange}
          options={regionOptions}
          placeholder="Select a region"
          disabled={!selectedCountryId}
          error={errors.regionId?.message}
        />

        {/* City Selector */}
        <Select
          label="City"
          value={selectedCityId}
          onChange={handleCityChange}
          options={cityOptions}
          placeholder="Select a city"
          disabled={!selectedRegionId}
          loading={citiesLoading}
          error={citiesError || errors.cityId?.message}
        />
      </div>

      {/* Address Details */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold text-gray-800">Address Details</h3>

        <Input
          label="Street"
          {...register('street')}
          placeholder="Enter street name"
          error={errors.street?.message}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="House Number"
            {...register('houseNumber')}
            placeholder="e.g., 123"
            error={errors.houseNumber?.message}
          />

          <Input
            label="Apartment Number"
            {...register('apartmentNumber')}
            placeholder="e.g., Apt 4B"
            error={errors.apartmentNumber?.message}
          />
        </div>

        <Input
          label="Postal Code"
          {...register('postalCode')}
          placeholder="e.g., 12345"
          error={errors.postalCode?.message}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Submit Address
      </button>
    </form>
  );
}
