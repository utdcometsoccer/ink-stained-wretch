import type { LoginAction } from "../../types/LoginAction";
import type { State } from "../../types/State";

export interface ChooseCultureProps {
  state: State;
  dispatch: React.Dispatch<LoginAction>;
}
