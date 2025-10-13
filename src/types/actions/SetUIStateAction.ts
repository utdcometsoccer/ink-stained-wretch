import type { UIStates } from "../UIStates";

export interface SetUIStateAction {
  type: 'SET_UI_STATE';
  payload: UIStates | { uiState: UIStates; autoDetect?: boolean };
}
