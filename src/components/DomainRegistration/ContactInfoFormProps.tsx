import type React from "react";
import type { State } from "../../types/State";
import type { Dispatch } from "react";
import type { Action } from "../../types/Action";
import type { ContactInfoErrors } from "../../types/DomainRegistrationState";


export interface ContactInfoFormProps {
    cityRef: React.RefObject<HTMLInputElement|null>;
    state: State;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    dispatch?: Dispatch<Action>;
    errors?: ContactInfoErrors;
}
