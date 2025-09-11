import type { DomainRegistrationsFetcher } from "../../types/DomainRegistrationsFetcher";

export interface DomainRegistrationsListProps {
    accessToken: string;
    state: any;
    dispatch: (action: any) => void;
    culture?: string;
    domainRegistrationsFetcher?: DomainRegistrationsFetcher;
    onError?: (error: Error | string | undefined) => void;
}
