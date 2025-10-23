import type { Country } from '@idahoedokpayi/react-country-state-selector';

export interface CountryDetail {
    code: Country;
    name: string;
}

export interface CountryResponse {
    language: string;
    count: number;
    countries: CountryDetail[];
}
