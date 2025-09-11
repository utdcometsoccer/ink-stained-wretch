import type { DomainRegistration } from "./DomainRegistration";

export interface DomainRegistrationsFetcher {
    (accessToken: string): {
        data: DomainRegistration[] | null;
        error: any;
        loading: boolean;
    };
}
