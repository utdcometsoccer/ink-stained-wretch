import type { Author } from "../types/Author";

export interface AuthorListState {
  showForm: boolean;
  authorList: Author[];
  newAuthor: Author | null;
  authorWarning?: string;
}

export const initialAuthorListState: AuthorListState = {
  showForm: false,
  authorList: [],
  newAuthor: null,
  authorWarning: "",
};

export type AuthorListAction =
  | { type: "SHOW_FORM"; payload: Author }
  | { type: "HIDE_FORM" }
  | { type: "SAVE_AUTHOR"; payload: Author }
  | { type: "INIT_LIST"; payload: Author[] }
  | { type: "SET_WARNING"; payload: string };

export function authorListReducer(state: AuthorListState, action: AuthorListAction): AuthorListState {
  switch (action.type) {
    case "SHOW_FORM": {
      return { ...state, showForm: true, newAuthor: (action as { type: "SHOW_FORM"; payload: Author }).payload };
    }
    case "HIDE_FORM": {
      return { ...state, showForm: false, newAuthor: null };
    }
    case "SAVE_AUTHOR": {
      return {
        ...state,
        authorList: [...state.authorList, (action as { type: "SAVE_AUTHOR"; payload: Author }).payload],
        showForm: false,
        newAuthor: null,
      };
    }
    case "INIT_LIST": {
      return { ...state, authorList: (action as { type: "INIT_LIST"; payload: Author[] }).payload };
    }
    case "SET_WARNING": {
      return { ...state, authorWarning: (action as { type: "SET_WARNING"; payload: string }).payload };
    }
    default:
      return state;
  }
}
