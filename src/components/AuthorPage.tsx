import type { State } from "../types/State";

interface AuthorPageProps {
  state: State;
  dispatch: React.Dispatch<any>;
}

export function AuthorPage({ state, dispatch }: AuthorPageProps) {
  return (
    <div>
      <h1>Author Page</h1>
      <p>Manage your author page information.</p>
      {/* Add author page management UI here */}
    </div>
  );
}
