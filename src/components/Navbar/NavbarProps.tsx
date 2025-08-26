import type { Action } from '../../reducers/appReducer';
import type { State } from '../../types/State';
import type { UIStates } from '../../types/UIStates';

export interface NavbarProps {
    currentState: UIStates;
    dispatch: React.Dispatch<Action>;
    state: State;
}
