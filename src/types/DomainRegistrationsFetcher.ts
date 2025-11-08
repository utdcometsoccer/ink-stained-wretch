import type { DomainRegistration } from "./DomainRegistration";
import type { Dispatch } from "react";
import type { Action } from "./Action";

export interface DomainRegistrationsFetcher {
    (accessToken: string, dispatch?: Dispatch<Action>): {
        data: DomainRegistration[] | null;
        error: Error | string | null;
        loading: boolean;
    };
}
