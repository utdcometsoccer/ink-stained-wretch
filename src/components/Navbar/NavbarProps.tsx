import type { Action } from "../../reducers/appReducer";
import type { UIStates } from '../../types/UIStates';
import type { Dispatch } from "react";
import type { State } from '../../types/State';

export interface NavbarProps {
    currentState: UIStates;
    dispatch: Dispatch<Action>;
    state: State;
}
