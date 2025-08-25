import type { State } from "../types/State";

interface DomainRegistrationProps {
  state: State;
  dispatch: React.Dispatch<any>;
}

export function DomainRegistration({ state, dispatch }: DomainRegistrationProps) {
  return (
    <div>
      <h1>Domain Registration</h1>
      <p>Register your domain and contact information.</p>
      {/* Add domain registration form here */}
    </div>
  );
}
