import type { BookListState } from "../types/BookListState";
import type { BookListAction } from "../types/BookListAction";

export function bookListReducer(state: BookListState, action: BookListAction): BookListState {
  switch (action.type) {
    case "SET_DISABLE_GOOGLE_IMPORT":
      return { ...state, disableGoogleImport: action.value };
    case "SET_OPEN_LIBRARY_AUTHOR_KEYS":
      return { ...state, openLibraryAuthorKeys: action.value };
    case "SET_LOADING":
      return { ...state, loading: action.value };
    case "BUTTON_CLICK":
      return { ...state, buttonState: action.value };
    case "SET_BOOK_ID":
      return { ...state, bookId: action.value };
    default:
      return state;
  }
}
