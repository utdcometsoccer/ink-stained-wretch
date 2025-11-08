import type { StateProvinceResponse } from "../types/StateProvinceResponse";
import { UnauthorizedError } from "../types/UnauthorizedError";

/**
 * Fetches state and province data from the API
 * @param culture Optional culture string to filter results by locale (passed as route parameter)
 * @param bearerToken Optional bearer token for authentication
 * @returns Promise that resolves to an array of StateProvince objects
 */
export async function fetchStatesProvinces(culture?: string, bearerToken?: string): Promise<StateProvinceResponse> {
  const apiUrl = import.meta.env.VITE_STATES_PROVINCES_API_URL || "";
  
  if (!apiUrl) {
    throw new Error("API URL is not defined in VITE_STATES_PROVINCES_API_URL environment variable");
  }

  // Construct the full URL with culture as route parameter
  const fullUrl = culture ? `${apiUrl}/${culture}` : apiUrl;

  // Setup headers
  const headers: Record<string, string> = { 
    "Accept": "application/json",
    "Content-Type": "application/json"
  };
  
  if (bearerToken) {
    headers["Authorization"] = `Bearer ${bearerToken}`;
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
      throw new Error(`Failed to fetch states/provinces: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new Error(`Error fetching states/provinces: ${error.message}`);
    }
    throw new Error('An unknown error occurred while fetching states/provinces');
  }
}