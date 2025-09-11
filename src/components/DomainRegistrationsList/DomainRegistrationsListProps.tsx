import type { DomainRegistration } from "../../types/DomainRegistration";
import type { DomainRegistrationsListText } from "../../types/LocalizedText";

export interface DomainRegistrationsListProps {
    domainRegistrationData: DomainRegistration[];
    localizedText: DomainRegistrationsListText;
    onClickSelect: (domain: DomainRegistration) => void;
}
