import type { Country } from '@idahoedokpayi/react-country-state-selector';

export interface CountryDetail {
    code: Country;
    name: string;
    culture: string;
}

export interface CountryData {
    culture: string;
    countries: CountryDetail[];
}

export interface CountryResponse {
    data: CountryData[];
}
