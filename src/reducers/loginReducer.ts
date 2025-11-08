import type { LoginAction } from "../types/LoginAction";
import type { LoginLocalState } from "../types/LoginLocalState";

export function loginReducer(state: LoginLocalState, action: LoginAction): LoginLocalState {
  switch (action.type) {
    case "START_REDIRECT":
      return { ...state, showRedirect: true, countdown: action.countdown };
    case "STOP_REDIRECT":
      return { ...state, showRedirect: false, countdown: null };
    case "TICK":
      return { ...state, countdown: (state.countdown ?? 1) - 1 };
    default:
      return state;
  }
}
