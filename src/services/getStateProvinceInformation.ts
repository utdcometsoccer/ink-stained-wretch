import { useCallback } from 'react';
import type { CultureInfo, StateProvinceInformation, GetStateProvinceInformation } from '@idahoedokpayi/react-country-state-selector';
import { fetchStatesProvinces } from './fetchStatesProvinces';
import { withAuthRetry } from './withAuthRetry';

// Create a cache for memoization
const stateProvinceCache = new Map<string, StateProvinceInformation[]>();

/**
 * Memoized implementation of GetStateProvinceInformation interface
 * Maps our StateProvince type to the library's StateProvinceInformation type
 */
export const getStateProvinceInformation: GetStateProvinceInformation = async (cultureInfo: CultureInfo): Promise<StateProvinceInformation[]> => {
  return getStateProvinceInformationWithAuth(cultureInfo);
};

/**
 * Enhanced version that supports authentication tokens
 * Maps our StateProvince type to the library's StateProvinceInformation type
 * @param updateToken Optional callback to update token in application state on 401
 */
export const getStateProvinceInformationWithAuth = async (
  cultureInfo: CultureInfo, 
  accessToken?: string,
  updateToken?: (newToken: string | null) => void
): Promise<StateProvinceInformation[]> => {
  const cacheKey = accessToken ? `${cultureInfo.Culture}-auth` : cultureInfo.Culture;
  
  // Check cache first
  if (stateProvinceCache.has(cacheKey)) {
    return stateProvinceCache.get(cacheKey)!;
  }

  try {
    // Fetch from our API with culture as route parameter and optional auth token
    // Use withAuthRetry to handle 401 responses
    const response = await withAuthRetry(
      (token) => fetchStatesProvinces(cultureInfo.Culture, token),
      accessToken,
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
    console.error('Failed to fetch state/province information:', error);
    // Return empty array as fallback
    return [];
  }
};

/**
 * React hook that provides a memoized version of the getStateProvinceInformation function
 * This ensures the function reference stays stable across re-renders
 * @param updateToken Optional callback to update token in application state on 401
 */
export const useGetStateProvinceInformation = (
  accessToken?: string,
  updateToken?: (newToken: string | null) => void
): GetStateProvinceInformation => {
  return useCallback(async (cultureInfo: CultureInfo): Promise<StateProvinceInformation[]> => {
    return getStateProvinceInformationWithAuth(cultureInfo, accessToken, updateToken);
  }, [accessToken, updateToken]);
};

/**
 * Clear the cache - useful for testing or when data needs to be refreshed
 */
export const clearStateProvinceCache = (): void => {
  stateProvinceCache.clear();
};