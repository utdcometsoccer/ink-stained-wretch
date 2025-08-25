import type { State } from "../types/State";

interface ThankYouProps {
  state: State;
  dispatch: React.Dispatch<any>;
}

export function ThankYou({ state, dispatch }: ThankYouProps) {
  return (
    <div>
      <h1>Thank You</h1>
      <p>Thank you for your purchase!</p>
      {/* Add thank you message and next steps here */}
    </div>
  );
}
