import type { Dispatch } from "react";
import type { State } from "../../types/State";
import type { Action } from "../../reducers/appReducer";

export interface DomainRegistrationProps {
    state: State;
    dispatch: Dispatch<Action>;
}
