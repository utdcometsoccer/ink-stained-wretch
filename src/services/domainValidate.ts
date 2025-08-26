// Domain validation utility
import { domainRegex } from "./domainRegex";

export function domainValidate(domain: string): boolean {
  return domainRegex.test(domain.trim());
}
