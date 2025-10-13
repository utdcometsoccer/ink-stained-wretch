import type { DomainRegistration } from "../types/DomainRegistration";
import { UnauthorizedError } from "../types/UnauthorizedError";

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
    body: JSON.stringify(domainRegistration)
  });

  if (response.status === 401) {
    throw new UnauthorizedError();
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return await response.json();
}
