import type { LoginLocalState } from "./LoginLocalState";
import type { LoginAction } from "./LoginAction";

export type LoginLogicResult = {  
  msalReady: boolean;
  handleSignIn: () => Promise<void>;
  handleSignOut: () => void;
  loginState: LoginLocalState;
  loginDispatch: React.Dispatch<LoginAction>;
  countdownRef: React.RefObject<HTMLDivElement | null>;
};
