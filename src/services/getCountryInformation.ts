import { useCallback } from 'react';
import type { CultureInfo, CountryInformation, GetCountryInformation } from '@idahoedokpayi/react-country-state-selector';
import { getCountryInformationByCulture } from '@idahoedokpayi/react-country-state-selector';
import { fetchCountries } from './fetchCountries';

// Create a cache for memoization
const countryCache = new Map<string, CountryInformation[]>();

/**
 * Memoized implementation of GetCountryInformation interface
 * Maps our Country type to the library's CountryInformation type
 */
export const getCountryInformation: GetCountryInformation = async (cultureInfo: CultureInfo): Promise<CountryInformation[]> => {
  return getCountryInformationWithAuth(cultureInfo);
};

/**
 * Enhanced version for getting country information
 * Maps our Country type to the library's CountryInformation type
 */
export const getCountryInformationWithAuth = async (
  cultureInfo: CultureInfo
): Promise<CountryInformation[]> => {
  const cacheKey = cultureInfo.Culture;
  
  // Check cache first
  if (countryCache.has(cacheKey)) {
    return countryCache.get(cacheKey)!;
  }

  try {
    // Fetch from our API with culture as route parameter
    const response = await fetchCountries(cultureInfo.Culture);
    
    // Extract country data from the response
    // The response now contains language, count, and countries directly
    const countryDetails = response.countries || [];
    
    // Map to the library's CountryInformation type
    const countryInformation: CountryInformation[] = countryDetails.map(country => ({
      code: country.code,
      name: country.name
    }));
    
    // Cache the result
    countryCache.set(cacheKey, countryInformation);
    
    return countryInformation;
  } catch (error) {
    console.error('Failed to fetch country information from API, falling back to default:', error);
    // Fall back to the library's default implementation
    try {
      return await getCountryInformationByCulture(cultureInfo);
    } catch (fallbackError) {
      console.error('Fallback to default country information also failed:', fallbackError);
      // Return empty array as final fallback
      return [];
    }
  }
};

/**
 * React hook that provides a memoized version of the getCountryInformation function
 * This ensures the function reference stays stable across re-renders
 */
export const useGetCountryInformation = (): GetCountryInformation => {
  return useCallback(async (cultureInfo: CultureInfo): Promise<CountryInformation[]> => {
    return getCountryInformationWithAuth(cultureInfo);
  }, []);
};

/**
 * Clear the cache - useful for testing or when data needs to be refreshed
 */
export const clearCountryCache = (): void => {
  countryCache.clear();
};
