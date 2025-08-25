import type { State } from "../types/State";

interface ChooseSubscriptionProps {
  state: State;
  dispatch: React.Dispatch<any>;
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
