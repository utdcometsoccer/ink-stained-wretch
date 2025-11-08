import enUS from '../locales/inkstainedwretch.en-us.json';
import esMX from '../locales/inkstainedwretch.es-mx.json';
import frCA from '../locales/inkstainedwretch.fr-ca.json';
import arEG from '../locales/inkstainedwretch.ar-eg.json';
import zhTW from '../locales/inkstainedwretch.zh-tw.json';
import type { LocalizedText } from '../types/LocalizedText';

// Memoization cache for fetchLocalizedText
const localizationCache = new Map<string, Promise<LocalizedText | null>>();

/**
 * Returns static localized text from local files for the given culture.
 */
export function getStaticLocalizedText(culture: string): LocalizedText | null {
  const normalized = culture.toLowerCase();
  if (normalized === 'en-us') {
    return enUS as LocalizedText;
  }
  if (normalized === 'es-mx') {
    return esMX as LocalizedText;
  }
  if (normalized === 'fr-ca') {
    return frCA as LocalizedText;
  }
  if (normalized === 'ar-eg') {
    return arEG as LocalizedText;
  }
  if (normalized === 'zh-tw') {
    return zhTW as LocalizedText;
  }
  // Add more cultures as needed
  return null;
}

/**
 * Gets localized text, preferring the REST API and falling back to static files.
 */
export async function getLocalizedText(culture: string): Promise<LocalizedText | null> {
  let result: LocalizedText | null = null;
  const [language, region] = culture.split('-');
  try {
    result = await fetchLocalizedText(language, region);
    if (result === null) {
      result = getStaticLocalizedText(culture);
    }
  } catch {
    result = getStaticLocalizedText(culture);
  }
  return result;
}
/**
 * Fetches localized text from the REST API for the given language and region.
 * Uses memoization to cache results and avoid redundant API calls.
 * @param language ISO 639-1 language code (e.g., 'en', 'es', 'fr', 'ar', 'zh')
 * @param region ISO 3166-1 alpha-2 country code (e.g., 'US', 'MX', 'CA', 'EG', 'TW')
 * @returns Promise<LocalizedText | null>
 */
export async function fetchLocalizedText(language: string, region: string): Promise<LocalizedText | null> {
  const cacheKey = `${language}-${region}`;
  
  // Check if we already have a cached promise for this language-region combination
  if (localizationCache.has(cacheKey)) {
    return localizationCache.get(cacheKey)!;
  }
  
  // Create and cache the promise
  const fetchPromise = (async (): Promise<LocalizedText | null> => {
    const baseUrl = import.meta.env.VITE_LOCALIZATION_API_URL || "";
    if (!baseUrl) throw new Error("Localization API URL is not defined in VITE_LOCALIZATION_API_URL environment variable");
    const url = `${baseUrl}${cacheKey}`;
    try {
      const response = await fetch(url);
      if (!response.ok) return null;
      const data = await response.json();
      return data ?? null;
    } catch {
      return null;
    }
  })();
  
  localizationCache.set(cacheKey, fetchPromise);
  return fetchPromise;
}

/**
 * Clears the memoization cache for fetchLocalizedText.
 * Useful for testing or when you want to force fresh API calls.
 * @param cacheKey Optional specific cache key to clear. If not provided, clears entire cache.
 */
export function clearLocalizationCache(cacheKey?: string): void {
  if (cacheKey) {
    localizationCache.delete(cacheKey);
  } else {
    localizationCache.clear();
  }
}
