import type { BookListButtonState } from "./BookListButtonState";

export type BookListState = {
  disableGoogleImport: boolean;
  openLibraryAuthorKeys: string[];
  loading: boolean;
  buttonState: BookListButtonState;
  bookId?: string;
};
