import type { RefObject } from "react";
import type { DomainRegistrationText } from "./LocalizedText";

export interface DomainRegistrationLogicReturn {
  cityRef: RefObject<HTMLInputElement|null>;
  stateRef: RefObject<HTMLInputElement | HTMLSelectElement|null>;
  isValid: boolean;
  handleContactChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleDomainInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  domainRegistrationText: DomainRegistrationText;
  domainInputValue: string;
  domainError: string | null;
  culture?: string;
}
