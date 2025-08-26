export interface WhoisResult {
  domain: string;
  available: string;
  type: string;
  registrar: string;
  statuses: string[];
  created: number;
  updated: number;
  expires: number;
  whois: string;
}
