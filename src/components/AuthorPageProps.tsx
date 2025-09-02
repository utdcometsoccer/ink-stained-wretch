import type { LoginAction } from "../types/LoginAction";
import type { State } from "../types/State";

export interface AuthorPageProps {
  state: State;
  dispatch: React.Dispatch<LoginAction>;
}
