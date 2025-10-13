import type { State } from "../State";

export interface UpdateStateAction {
  type: 'UPDATE_STATE';
  payload: Partial<State>;
}
