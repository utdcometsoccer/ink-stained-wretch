import type { Dispatch } from "react";
import type { LoginAction } from "../types/LoginAction";
import type { State } from "../types/State";

export interface ErrorPageProps {
  state: State;
  dispatch: Dispatch<LoginAction>;
}
