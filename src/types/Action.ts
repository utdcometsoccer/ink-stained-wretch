import type { ActionType } from "../reducers/appReducer";

export interface Action {
  type: ActionType;
  payload?: any;
}
