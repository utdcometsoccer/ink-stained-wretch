import type { WhoisResult } from "../types/WhoisResult";

// WHOIS API domain existence check
export async function validateDomainWhois(domain: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.whois.vu/?q=${encodeURIComponent(domain)}`);
    const data = await response.json() as WhoisResult;
    // Example: if data.available is "yes", domain is available
    return data.available === 'yes';
  } catch (error) {
    // On error, treat as not existing (or handle as needed)
    return false;
  }
}
