import type { LoginAction } from "../types/LoginAction";
import type { State } from "../types/State";
import type { Dispatch } from "react";

interface ChooseSubscriptionProps {
  state: State;
  dispatch: Dispatch<LoginAction>;
}

export function ChooseSubscription({ state, dispatch }: ChooseSubscriptionProps) {
  return (
    <div>
      <h1>Choose Subscription</h1>
      <p>Select your subscription plan.</p>
      {/* Add subscription selection UI here */}
    </div>
  );
}
