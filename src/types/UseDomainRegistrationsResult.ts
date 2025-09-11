import type { DomainRegistration } from "./DomainRegistration";


export interface UseDomainRegistrationsResult {
  data: DomainRegistration[] | null;
  error: string | null;
  loading: boolean;
}
