import type { RefObject } from "react";

export interface DomainRegistrationLogicReturn {
  cityRef: RefObject<HTMLInputElement|null>;
  stateRef: RefObject<HTMLInputElement | HTMLSelectElement|null>;
  isValid: boolean;
  handleContactChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleDomainInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
