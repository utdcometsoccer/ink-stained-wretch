export type LoginLogicResult = {
  COUNTDOWN_SECONDS: number;
  msalReady: boolean;
  updateCountdownWidth: () => void;
  handleSignIn: () => Promise<void>;
  handleSignOut: () => void;
};
