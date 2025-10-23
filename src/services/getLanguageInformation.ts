import { useCallback } from 'react';
import type { CultureInfo, LanguageInformation } from '@idahoedokpayi/react-country-state-selector';
import { fetchLanguages } from './fetchLanguages';
import { withAuthRetry } from './withAuthRetry';

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
 * Enhanced version that supports authentication tokens
 * Maps our LanguageDetail type to the library's LanguageInformation type
 * @param cultureInfo The culture information to fetch languages for
 * @param accessToken Optional access token for authentication
 * @param updateToken Optional callback to update token in application state on 401
 */
export const getLanguageInformationWithAuth = async (
  cultureInfo: CultureInfo, 
  accessToken?: string,
  updateToken?: (newToken: string | null) => void
): Promise<LanguageInformation[]> => {
  const cacheKey = accessToken ? `${cultureInfo.Culture}-auth` : cultureInfo.Culture;
  
  // Check cache first
  if (languageCache.has(cacheKey)) {
    return languageCache.get(cacheKey)!;
  }

  try {
    // Fetch from our API with culture as route parameter and optional auth token
    // Use withAuthRetry to handle 401 responses
    const response = await withAuthRetry(
      (token) => fetchLanguages(cultureInfo.Culture, token),
      accessToken,
      updateToken
    );
    
    // Extract language data from the response
    const languageDetails = response.data || [];
    
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
 * @param accessToken Optional access token for authentication
 * @param updateToken Optional callback to update token in application state on 401
 */
export const useGetLanguageInformation = (
  accessToken?: string,
  updateToken?: (newToken: string | null) => void
): ((cultureInfo: CultureInfo) => Promise<LanguageInformation[]>) => {
  return useCallback(async (cultureInfo: CultureInfo): Promise<LanguageInformation[]> => {
    return getLanguageInformationWithAuth(cultureInfo, accessToken, updateToken);
  }, [accessToken, updateToken]);
};

/**
 * Clear the cache - useful for testing or when data needs to be refreshed
 */
export const clearLanguageCache = (): void => {
  languageCache.clear();
};
