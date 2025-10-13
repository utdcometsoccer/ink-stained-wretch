import type { DomainRegistration } from "../DomainRegistration";

export interface SelectDomainRegistrationAction {
  type: 'SELECT_DOMAIN_REGISTRATION';
  payload: DomainRegistration;
}
