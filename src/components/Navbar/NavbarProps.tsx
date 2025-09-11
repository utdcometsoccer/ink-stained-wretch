import type { Action } from "../../types/Action";
import type { UIStates } from '../../types/UIStates';
import type { Dispatch } from "react";
import type { State } from '../../types/State';

export interface NavbarProps {
    currentState: UIStates;
    dispatch: Dispatch<Action>;
    state: State;
    culture?: string;
}
