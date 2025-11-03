import type { RefObject } from "react";
import type { DomainRegistrationsListText, DomainRegistrationText } from "./LocalizedText";
import type { ContactInfoErrors } from "./DomainRegistrationState";

export interface DomainRegistrationLogicReturn {
  cityRef: RefObject<HTMLInputElement|null>;
  isValid: boolean;
  handleContactChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleDomainInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  domainRegistrationText: DomainRegistrationText;
  domainInputValue: string;
  domainError: string | null;
  culture?: string;
  domainRegistrationsListText: DomainRegistrationsListText;
  loading: boolean;
  APICallFailed: boolean;
  contactInfoErrors: ContactInfoErrors;
}
