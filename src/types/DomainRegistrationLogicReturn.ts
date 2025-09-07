import type { RefObject } from "react";
import type { ContactInformation } from "./ContactInformation";

export interface DomainRegistrationLogicReturn {
  cityRef: RefObject<HTMLInputElement|null>;
  stateRef: RefObject<HTMLInputElement | HTMLSelectElement|null>;
  contactInfo: ContactInformation;
  domainInputValue: string;
  domainError: string | null;
  isValid: boolean;
  handleContactChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}
