'use client';

import { Country, Region } from '../types/address';
import { AddressPicker } from './AddressPicker';

interface AddressPickerWrapperProps {
  initialCountries: Country[];
  initialRegions: Region[];
}

/**
 * Client wrapper for AddressPicker
 * Both countries and regions are pre-fetched at build time with ISR (weekly revalidation)
 */
export function AddressPickerWrapper({ initialCountries, initialRegions }: AddressPickerWrapperProps) {
  return (
    <AddressPicker
      countries={initialCountries}
      allRegions={initialRegions}
    />
  );
}
