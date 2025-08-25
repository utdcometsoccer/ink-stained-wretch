import type { State } from "../types/State";

interface CreateAccountProps {
  state: State;
  dispatch: React.Dispatch<any>;
}

export function CreateAccount({ state, dispatch }: CreateAccountProps) {
  return (
    <div>
      <h1>Create Account</h1>
      <p>Create your new account.</p>
      {/* Add account creation form here */}
    </div>
  );
}
