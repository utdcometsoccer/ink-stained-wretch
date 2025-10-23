import { useCallback } from 'react';
import type { CultureInfo, LanguageInformation } from '@idahoedokpayi/react-country-state-selector';
import { fetchLanguages } from './fetchLanguages';

// Create a cache for memoization
const languageCache = new Map<string, LanguageInformation[]>();

/**
 * Memoized implementation of the getLanguageInformation function
 * Maps our LanguageDetail type to the library's LanguageInformation type
 */
export const getLanguageInformation = async (cultureInfo: CultureInfo): Promise<LanguageInformation[]> => {
  return getLanguageInformationWithAuth(cultureInfo);
};

/**
 * Enhanced version for getting language information
 * Maps our LanguageDetail type to the library's LanguageInformation type
 * @param cultureInfo The culture information to fetch languages for
 */
export const getLanguageInformationWithAuth = async (
  cultureInfo: CultureInfo
): Promise<LanguageInformation[]> => {
  const cacheKey = cultureInfo.Culture;
  
  // Check cache first
  if (languageCache.has(cacheKey)) {
    return languageCache.get(cacheKey)!;
  }

  try {
    // Fetch from our API with culture as route parameter
    const response = await fetchLanguages(cultureInfo.Culture);
    
    // Extract language data from the response (response is now directly an array)
    const languageDetails = response || [];
    
    // Map to the library's LanguageInformation type
    const languageInformation: LanguageInformation[] = languageDetails.map(lang => ({
      code: lang.code,
      name: lang.name
    }));
    
    // Cache the result
    languageCache.set(cacheKey, languageInformation);
    
    return languageInformation;
  } catch (error) {
    console.error('Failed to fetch language information:', error);
    // Return empty array as fallback
    return [];
  }
};

/**
 * React hook that provides a memoized version of the getLanguageInformation function
 * This ensures the function reference stays stable across re-renders
 */
export const useGetLanguageInformation = (): ((cultureInfo: CultureInfo) => Promise<LanguageInformation[]>) => {
  return useCallback(async (cultureInfo: CultureInfo): Promise<LanguageInformation[]> => {
    return getLanguageInformationWithAuth(cultureInfo);
  }, []);
};

/**
 * Clear the cache - useful for testing or when data needs to be refreshed
 */
export const clearLanguageCache = (): void => {
  languageCache.clear();
};
