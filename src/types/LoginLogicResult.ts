import type { LoginLocalState } from "./LoginLocalState";

export type LoginLogicResult = {  
  msalReady: boolean;
  handleSignIn: () => Promise<void>;
  handleSignOut: () => void;
  loginState: LoginLocalState;
  loginDispatch: React.Dispatch<any>;
  countdownRef: React.RefObject<HTMLDivElement | null>;
};
