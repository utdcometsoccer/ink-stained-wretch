import type { WhoisResult } from "../types/WhoisResult";

// WHOIS API domain existence check
export async function validateDomainWhois(domain: string): Promise<boolean> {
  const baseUrl = import.meta.env.VITE_WHOIS_API_URL || "";
  if (!baseUrl) throw new Error("WHOIS API URL is not defined in VITE_WHOIS_API_URL environment variable");
  try {
    const response = await fetch(`${baseUrl}?q=${encodeURIComponent(domain)}`);
    const data = await response.json() as WhoisResult;
    // Example: if data.available is "yes", domain is available
    return data.available === 'yes';
  } catch (error) {
    // On error, treat as not existing (or handle as needed)
    return false;
  }
}
