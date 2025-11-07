import type { DomainRegistration } from "../types/DomainRegistration";
import { UnauthorizedError } from "../types/UnauthorizedError";
import { getBrowserCultureWithFallback } from "./getBrowserCultureWithFallback";

/**
 * Submit a domain registration to the API
 * @param domainRegistration - The domain registration data to submit
 * @param accessToken - The access token for authentication
 * @returns The created domain registration with id
 */
export async function submitDomainRegistration(
  domainRegistration: DomainRegistration,
  accessToken?: string
): Promise<DomainRegistration> {
  // Create a copy of the domain registration to avoid mutating the original
  const registrationData = { ...domainRegistration };
  
  // Check if contactInformation exists and if country is undefined (not null), set it from browser culture
  if (registrationData.contactInformation && registrationData.contactInformation.country === undefined) {
    const browserCulture = getBrowserCultureWithFallback();
    registrationData.contactInformation = {
      ...registrationData.contactInformation,
      country: browserCulture.Country
    };
  }
  
  const apiUrl = import.meta.env.VITE_DOMAIN_REGISTRATION_SUBMIT_API_URL || "";
  if (!apiUrl) {
    throw new Error("API URL is not defined in VITE_DOMAIN_REGISTRATION_SUBMIT_API_URL environment variable");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json"
  };
  
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${apiUrl}`, {
    method: "POST",
    headers,
    body: JSON.stringify(registrationData)
  });

  if (response.status === 401) {
    throw new UnauthorizedError();
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return await response.json();
}
