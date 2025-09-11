import type { Action } from "../../types/Action";
import type { State } from "../../types/State";

export interface LoginProps {
  state: State;
  dispatch: React.Dispatch<Action>;
}
