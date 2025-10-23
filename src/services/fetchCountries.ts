import type { CountryResponse } from "../types/CountryResponse";
import { UnauthorizedError } from "../types/UnauthorizedError";
import { getLanguageFromCulture } from "./cultureUtils";

// Default English countries fallback data
const DEFAULT_COUNTRIES: CountryResponse = {
  language: "en",
  count: 5,
  countries: [
    { code: "US", name: "United States" },
    { code: "CA", name: "Canada" },
    { code: "GB", name: "United Kingdom" },
    { code: "AU", name: "Australia" },
    { code: "DE", name: "Germany" }
  ]
};

/**
 * Fetches country data from the API with fallback to default English data
 * @param culture Optional culture string to filter results by locale (passed as route parameter)
 * @returns Promise that resolves to CountryResponse object (returns default English data if remote service fails)
 */
export async function fetchCountries(culture?: string): Promise<CountryResponse> {
  const apiUrl = import.meta.env.VITE_COUNTRIES_API_URL || "";
  
  if (!apiUrl) {
    throw new Error("API URL is not defined in VITE_COUNTRIES_API_URL environment variable");
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
      throw new Error(`Failed to fetch countries: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    
    // Log the error and return fallback data
    console.warn('Failed to fetch countries from remote service, using fallback data:', error);
    return DEFAULT_COUNTRIES;
  }
}
