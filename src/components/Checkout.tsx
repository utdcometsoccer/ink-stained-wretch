import type { State } from "../types/State";

interface CheckoutProps {
  state: State;
  dispatch: React.Dispatch<any>;
}

export function Checkout({ state, dispatch }: CheckoutProps) {
  return (
    <div>
      <h1>Checkout</h1>
      <p>Complete your purchase.</p>
      {/* Add checkout form here */}
    </div>
  );
}
