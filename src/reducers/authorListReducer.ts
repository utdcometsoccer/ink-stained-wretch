import type { Author } from "../types/Author";

export interface AuthorListState {
  showForm: boolean;
  authorList: Author[];
  newAuthor: Author | null;
}

export const initialAuthorListState: AuthorListState = {
  showForm: false,
  authorList: [],
  newAuthor: null,
};

export type AuthorListAction =
  | { type: "SHOW_FORM"; payload: Author }
  | { type: "HIDE_FORM" }
  | { type: "SAVE_AUTHOR"; payload: Author }
  | { type: "INIT_LIST"; payload: Author[] };

export function authorListReducer(state: AuthorListState, action: AuthorListAction): AuthorListState {
  switch (action.type) {
    case "SHOW_FORM":
      return { ...state, showForm: true, newAuthor: action.payload };
    case "HIDE_FORM":
      return { ...state, showForm: false, newAuthor: null };
    case "SAVE_AUTHOR":
      return {
        ...state,
        authorList: [...state.authorList, action.payload],
        showForm: false,
        newAuthor: null,
      };
    case "INIT_LIST":
      return { ...state, authorList: action.payload };
    default:
      return state;
  }
}
