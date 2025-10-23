import type { CountryResponse } from "../types/CountryResponse";
import { UnauthorizedError } from "../types/UnauthorizedError";

/**
 * Fetches country data from the API
 * @param culture Optional culture string to filter results by locale (passed as route parameter)
 * @param accessToken Optional bearer token for authentication
 * @returns Promise that resolves to CountryResponse object
 */
export async function fetchCountries(culture?: string, accessToken?: string): Promise<CountryResponse> {
  const apiUrl = import.meta.env.VITE_COUNTRIES_API_URL || "";
  
  if (!apiUrl) {
    throw new Error("API URL is not defined in VITE_COUNTRIES_API_URL environment variable");
  }

  // Construct the full URL with culture as route parameter
  const fullUrl = culture ? `${apiUrl}/${culture}` : apiUrl;

  // Setup headers
  const headers: Record<string, string> = { 
    "Accept": "application/json",
    "Content-Type": "application/json"
  };
  
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

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
    if (error instanceof Error) {
      throw new Error(`Error fetching countries: ${error.message}`);
    }
    throw new Error('An unknown error occurred while fetching countries');
  }
}
