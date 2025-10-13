import type { DomainRegistration } from "../DomainRegistration";

export interface SetDomainRegistrationsAction {
  type: 'SET_DOMAIN_REGISTRATIONS';
  payload: DomainRegistration[];
}
