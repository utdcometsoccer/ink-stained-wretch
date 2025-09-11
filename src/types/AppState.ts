import type { State } from "./State";
import type { UIStates } from "./UIStates";

export interface AppState {
  currentUIState: UIStates;
  state: State;
}
