export type LoginLogicResult = {  
  msalReady: boolean;
  handleSignIn: () => Promise<void>;
  handleSignOut: () => void;
};
