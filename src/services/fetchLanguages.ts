import type { LanguageResponse } from "../types/LanguageResponse";
import { UnauthorizedError } from "../types/UnauthorizedError";
import { getLanguageFromCulture } from "./cultureUtils";

// Default English languages fallback data
const DEFAULT_LANGUAGES: LanguageResponse = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" }
];

/**
 * Fetches language data from the API with fallback to default English data
 * @param culture Optional culture string to filter results by locale (passed as route parameter)
 * @returns Promise that resolves to a LanguageResponse array (returns default English data if remote service fails)
 */
export async function fetchLanguages(culture?: string): Promise<LanguageResponse> {
  const apiUrl = import.meta.env.VITE_LANGUAGES_API_URL || "";
  
  if (!apiUrl) {
    throw new Error("API URL is not defined in VITE_LANGUAGES_API_URL environment variable");
  }

  // Construct the full URL with language from culture as route parameter
  const language = getLanguageFromCulture(culture);
  const fullUrl = language ? `${apiUrl}/${language}` : apiUrl;

  // Setup headers
  const headers: Record<string, string> = { 
    "Accept": "application/json",
    "Content-Type": "application/json"
  };

  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers
    });

    if (response.status === 401) {
      throw new UnauthorizedError();
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch languages: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    
    // Log the error and return fallback data
    console.warn('Failed to fetch languages from remote service, using fallback data:', error);
    return DEFAULT_LANGUAGES;
  }
}
