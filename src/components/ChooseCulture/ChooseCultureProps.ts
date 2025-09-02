import type { Action } from "../../reducers/appReducer";
import type { State } from "../../types/State";

export interface ChooseCultureProps {
  state: State;
  dispatch: React.Dispatch<Action>;
}
