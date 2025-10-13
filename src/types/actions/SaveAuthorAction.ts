import type { Author } from "../Author";

export interface SaveAuthorAction {
  type: 'SAVE_AUTHOR';
  payload: Author;
}
