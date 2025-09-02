import type { State } from "../types/State";
import type { Action } from "../reducers/appReducer";

export interface ThankYouProps {
  state: State;
  dispatch: React.Dispatch<Action>;
}
