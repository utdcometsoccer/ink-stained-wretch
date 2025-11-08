import { useCallback } from 'react';
import type { CultureInfo, StateProvinceInformation, GetStateProvinceInformation } from '@idahoedokpayi/react-country-state-selector';
import { getStateProvinceInformationByCulture } from '@idahoedokpayi/react-country-state-selector';
import { fetchStatesProvinces } from './fetchStatesProvinces';
import { withAuthRetry } from './withAuthRetry';

// Create a cache for memoization
const stateProvinceCache = new Map<string, StateProvinceInformation[]>();

/**
 * Memoized implementation of GetStateProvinceInformation interface
 * Maps our StateProvince type to the library's StateProvinceInformation type
 */
export const getStateProvinceInformation: GetStateProvinceInformation = async (cultureInfo: CultureInfo): Promise<StateProvinceInformation[]> => {
  return getStateProvinceInformationWithAuth(cultureInfo, undefined, undefined);
};

/**
 * Enhanced version of the state/province information function
 * Maps our StateProvince type to the library's StateProvinceInformation type
 */
export const getStateProvinceInformationWithAuth = async (
  cultureInfo: CultureInfo,
  authToken?: string | null,
  updateToken?: (newToken: string | null) => void
): Promise<StateProvinceInformation[]> => {
  const cacheKey = cultureInfo.Culture;
  
  // Check cache first
  if (stateProvinceCache.has(cacheKey)) {
    return stateProvinceCache.get(cacheKey)!;
  }

  try {
    // Fetch from our API with culture as route parameter using auth retry pattern
    const response = await withAuthRetry(
      (token) => fetchStatesProvinces(cultureInfo.Culture, token),
      authToken ?? undefined,
      updateToken
    );
    
    // Extract state/province data from the response
    // Find the country data that matches the culture's country
    const countryData = response.data.find(country => 
      country.country === cultureInfo.Country && country.culture === cultureInfo.Culture
    );
    
    // If no matching country data found, try to find by country only
    const fallbackCountryData = countryData || response.data.find(country => 
      country.country === cultureInfo.Country
    );
    
    // Extract state/province details or use empty array if none found
    const stateProvinceDetails = fallbackCountryData?.stateProvinces || [];
    
    // Map to the library's StateProvinceInformation type
    const stateProvinceInformation: StateProvinceInformation[] = stateProvinceDetails.map(sp => ({
      code: sp.code,
      name: sp.name
    }));
    
    // Cache the result
    stateProvinceCache.set(cacheKey, stateProvinceInformation);
    
    return stateProvinceInformation;
  } catch (error) {
    console.error('Failed to fetch state/province information from API, falling back to default:', error);
    // Fall back to the library's default implementation
    try {
      return await getStateProvinceInformationByCulture(cultureInfo);
    } catch (fallbackError) {
      console.error('Fallback to default state/province information also failed:', fallbackError);
      // Return empty array as final fallback
      return [];
    }
  }
};

/**
 * React hook that provides a memoized version of the getStateProvinceInformation function
 * This ensures the function reference stays stable across re-renders
 */
export const useGetStateProvinceInformation = (): GetStateProvinceInformation => {
  return useCallback(async (cultureInfo: CultureInfo): Promise<StateProvinceInformation[]> => {
    return getStateProvinceInformationWithAuth(cultureInfo, undefined, undefined);
  }, []);
};

/**
 * Clear the cache - useful for testing or when data needs to be refreshed
 */
export const clearStateProvinceCache = (): void => {
  stateProvinceCache.clear();
};