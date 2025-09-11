import type { Dispatch } from "react";
import type { State } from "../../types/State";
import type { Action } from "../../types/Action";

export interface DomainRegistrationProps {
    state: State;
    dispatch: Dispatch<Action>;
}
