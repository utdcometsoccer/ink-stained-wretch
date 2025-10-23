import { useCallback } from 'react';
import type { CultureInfo, CountryInformation, GetCountryInformation } from '@idahoedokpayi/react-country-state-selector';
import { fetchCountries } from './fetchCountries';
import { withAuthRetry } from './withAuthRetry';

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
 * Enhanced version that supports authentication tokens
 * Maps our Country type to the library's CountryInformation type
 * @param updateToken Optional callback to update token in application state on 401
 */
export const getCountryInformationWithAuth = async (
  cultureInfo: CultureInfo, 
  accessToken?: string,
  updateToken?: (newToken: string | null) => void
): Promise<CountryInformation[]> => {
  const cacheKey = accessToken ? `${cultureInfo.Culture}-auth` : cultureInfo.Culture;
  
  // Check cache first
  if (countryCache.has(cacheKey)) {
    return countryCache.get(cacheKey)!;
  }

  try {
    // Fetch from our API with culture as route parameter and optional auth token
    // Use withAuthRetry to handle 401 responses
    const response = await withAuthRetry(
      (token) => fetchCountries(cultureInfo.Culture, token),
      accessToken,
      updateToken
    );
    
    // Extract country data from the response
    // Find the data that matches the culture
    const cultureData = response.data.find(data => 
      data.culture === cultureInfo.Culture
    );
    
    // Extract country details or use empty array if none found
    const countryDetails = cultureData?.countries || [];
    
    // Map to the library's CountryInformation type
    const countryInformation: CountryInformation[] = countryDetails.map(country => ({
      code: country.code,
      name: country.name
    }));
    
    // Cache the result
    countryCache.set(cacheKey, countryInformation);
    
    return countryInformation;
  } catch (error) {
    console.error('Failed to fetch country information:', error);
    // Return empty array as fallback
    return [];
  }
};

/**
 * React hook that provides a memoized version of the getCountryInformation function
 * This ensures the function reference stays stable across re-renders
 * @param updateToken Optional callback to update token in application state on 401
 */
export const useGetCountryInformation = (
  accessToken?: string,
  updateToken?: (newToken: string | null) => void
): GetCountryInformation => {
  return useCallback(async (cultureInfo: CultureInfo): Promise<CountryInformation[]> => {
    return getCountryInformationWithAuth(cultureInfo, accessToken, updateToken);
  }, [accessToken, updateToken]);
};

/**
 * Clear the cache - useful for testing or when data needs to be refreshed
 */
export const clearCountryCache = (): void => {
  countryCache.clear();
};
