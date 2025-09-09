import type { Dispatch } from "react";
import type { Action } from "../../reducers/appReducer";
import type { State } from "../../types/State";

export interface ChooseSubscriptionProps {
  state: State;
  dispatch: Dispatch<Action>;
}
