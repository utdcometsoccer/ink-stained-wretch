import type { Author } from "../types/Author";

export interface AuthorListState {
  showForm: boolean;
  newAuthor: Author | null;
  authorWarning?: string;
}

export const initialAuthorListState: AuthorListState = {
  showForm: false,  
  newAuthor: null,
  authorWarning: "",
};

export type AuthorListAction =
  | { type: "SHOW_FORM"; payload: Author }
  | { type: "HIDE_FORM" }  
  | { type: "SET_WARNING"; payload: string }
  | { type: "SET_NEW_AUTHOR_NULL" }

export function authorListReducer(state: AuthorListState, action: AuthorListAction): AuthorListState {
      switch (action.type) {
        case "SET_NEW_AUTHOR_NULL":
          return { ...state, newAuthor: null };
    case "SHOW_FORM": {
      return { ...state, showForm: true, newAuthor: (action as { type: "SHOW_FORM"; payload: Author }).payload };
    }
    case "HIDE_FORM": {
      return { ...state, showForm: false, newAuthor: null };
    }  
   
    case "SET_WARNING": {
      return { ...state, authorWarning: (action as { type: "SET_WARNING"; payload: string }).payload };
    }   
    default:
      return state;
  }
}
