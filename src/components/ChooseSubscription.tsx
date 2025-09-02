import type { Action } from "../reducers/appReducer";
import type { State } from "../types/State";
import type { Dispatch } from "react";

interface ChooseSubscriptionProps {
  state: State;
  dispatch: Dispatch<Action>;
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
