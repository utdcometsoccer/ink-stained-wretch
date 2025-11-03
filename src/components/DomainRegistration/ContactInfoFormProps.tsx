import type React from "react";
import type { State } from "../../types/State";
import type { ContactInfoErrors } from "../../types/DomainRegistrationState";


export interface ContactInfoFormProps {
    cityRef: React.RefObject<HTMLInputElement|null>;
    state: State;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    errors?: ContactInfoErrors;
}
