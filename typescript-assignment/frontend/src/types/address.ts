export interface Country {
  id: string;
  name: string;
  code: string;
}

export interface Region {
  id: string;
  name: string;
  countryId: string;
}

export interface City {
  id: string;
  name: string;
  regionId: string;
}

/* Streets are not implemented
export interface Street {
  id: string;
  name: string;
  cityId: string;
} */

export interface AddressDetails {
  street: string;
  houseNumber: string;
  apartmentNumber?: string;
  postalCode?: string;
}

export interface CompleteAddress {
  country: Country | null;
  region: Region | null;
  city: City | null;
  details: AddressDetails;
}
