import type { State } from "../types/State";
import type { Action } from "../reducers/appReducer";
import type { Dispatch } from "react";

export interface ErrorPageProps {
  state: State;
  dispatch: Dispatch<Action>;
  isDevelopment: () => boolean;
  culture?: string;
}
