import type { ContactInformation } from "./ContactInformation";
import type { Domain } from "./Domain";

export type DomainRegistration = {
    id?: string;
    authorID?: string;
    domain?: Domain;
    contactInformation?: ContactInformation;
  };
