import type { Action } from "../../types/Action";
import type { State } from "../../types/State";

export interface ChooseCultureProps {
  state: State;
  dispatch: React.Dispatch<Action>;
  culture?: string;
}
