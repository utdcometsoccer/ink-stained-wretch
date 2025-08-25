import type { State } from "../types/State";

interface LoginProps {
  state: State;
  dispatch: React.Dispatch<any>;
}

export function Login({ state, dispatch }: LoginProps) {
  return (
    <div>
      <h1>Login</h1>
      <p>Sign in to your account.</p>
      {/* Add login form here */}
    </div>
  );
}
