
import { type DomainRegistration } from "../types/DomainRegistration";
import { UnauthorizedError } from "../types/UnauthorizedError";
export async function fetchDomainRegistrations(accessToken?: string): Promise<DomainRegistration[]> {
  const apiUrl = import.meta.env.VITE_USER_DOMAIN_REGISTRATIONS_API_URL || "";
  if (!apiUrl) throw new Error("API URL is not defined in VITE_USER_DOMAIN_REGISTRATIONS_API_URL environment variable");
  const headers: Record<string, string> = { Accept: "application/json" };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
  const response = await fetch(`${apiUrl}`, {
    headers
  });
  if (response.status === 401) throw new UnauthorizedError();
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return await response.json();
}
