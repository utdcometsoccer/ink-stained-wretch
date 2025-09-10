
import { type DomainRegistration } from "../types/DomainRegistration";
export async function fetchDomainRegistrations(accessToken: string): Promise<DomainRegistration[]> {
  const apiUrl = import.meta.env.VITE_USER_DOMAIN_REGISTRATIONS_API_URL || "";
  if (!apiUrl) throw new Error("API URL is not defined in VITE_USER_DOMAIN_REGISTRATIONS_API_URL environment variable");
  const response = await fetch(`${apiUrl}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json"
    }
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return await response.json();
}
