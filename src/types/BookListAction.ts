import type { BookListButtonState } from "./BookListButtonState";

export type BookListAction =
  | { type: "SET_DISABLE_GOOGLE_IMPORT"; value: boolean }
  | { type: "SET_OPEN_LIBRARY_AUTHOR_KEYS"; value: string[] }
  | { type: "SET_LOADING"; value: boolean }
  | { type: "BUTTON_CLICK"; value: BookListButtonState }
  | { type: "SET_BOOK_ID"; value: string | undefined };
