import type { ContactInformation } from "../ContactInformation";

export interface UpdateDomainContactInfoAction {
  type: 'UPDATE_DOMAIN_CONTACT_INFO';
  payload: ContactInformation;
}
