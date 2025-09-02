import type { LoginAction } from "../types/LoginAction";
import type { State } from "../types/State";


export interface CheckoutProps {
  state: State;
  dispatch: React.Dispatch<LoginAction>;
}
