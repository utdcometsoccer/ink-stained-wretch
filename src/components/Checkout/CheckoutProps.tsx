import type { Action } from "../../reducers/appReducer";
import type { State } from "../../types/State";


export interface CheckoutProps {
  state: State;
  dispatch: React.Dispatch<Action>;
}
