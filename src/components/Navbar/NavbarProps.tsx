import type { Dispatch } from "react";
import type { LoginAction } from "../../types/LoginAction";
import type { State } from '../../types/State';
import type { UIStates } from '../../types/UIStates';

export interface NavbarProps {
    currentState: UIStates;
    dispatch: Dispatch<LoginAction>;
    state: State;
}
