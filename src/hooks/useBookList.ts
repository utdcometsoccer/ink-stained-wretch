import type { BookListButtonState } from "../types/BookListButtonState";
import { bookListReducer } from "../reducers/bookListReducer";
import { useEffect, useReducer } from "react";
import { googleBooksvolumesAPI } from "../services/googleBooksvolumesAPI";
import { fetchOpenLibraryWorksByAuthorKey } from "../services/openLibraryApi";
import type { Book } from "../types/Book";
import type { BookListProps } from "../components/AuthorRegistration/BookList/BookListProps";
import type { OpenLibraryTypeValue } from "../types/OpenLibrary";

export function useBookList({ authorName, importBook, onEdit, onDelete, openLibraryAuthorKeys }: BookListProps) {
  const initialState = {
    disableGoogleImport: !authorName || !importBook,
    openLibraryAuthorKeys: openLibraryAuthorKeys || [],
    loading: false,
    buttonState: "default" as BookListButtonState,
    bookId: undefined,
  };

  const [state, dispatch] = useReducer(bookListReducer, initialState);
  const { disableGoogleImport, buttonState, bookId } = state;
  const resetState = () => {
    dispatch({ type: "SET_LOADING", value: false });
    dispatch({ type: "BUTTON_CLICK", value: "default" });
    dispatch({ type: "SET_BOOK_ID", value: undefined });
  };
  useEffect(() => {
    const googleImport = async () => {
      try {
        if (disableGoogleImport || !authorName || !importBook) {
          return;
        }
        const bookVolumes = await googleBooksvolumesAPI(authorName);
        bookVolumes.forEach((item) => {
          const volume = item.volumeInfo;
          importBook({
            id: crypto.randomUUID(),
            Title: volume.title || "",
            Description: volume.description || "",
            URL: volume.infoLink || "",
            Cover: volume.imageLinks?.thumbnail || volume.imageLinks?.smallThumbnail || ""
          });
        });
      }
      catch (err) {
        console.error("Failed to import books", err);
      }
      finally {
        resetState();
      }
    }
    const openLibraryImport = async () => {
      try {
        if (state.openLibraryAuthorKeys.length === 0) {
          return;
        }
        for (const authorKey of state.openLibraryAuthorKeys) {
          let continueFetching = true;
          const limit = 100;
          let offset = 0;
          do {
            const works = await fetchOpenLibraryWorksByAuthorKey(authorKey, limit, offset > 0 ? offset : undefined);
            continueFetching = works.links?.next ? true : false;
            offset += limit;
            works.entries.forEach(openLibraryBook => {
              const coverID = openLibraryBook.covers && openLibraryBook.covers.length > 0 ? openLibraryBook.covers[0] : null;
              const bookKey = openLibraryBook.key;
              const description = openLibraryBook.description;
              const descriptionIsString = typeof description === 'string';
              const descriptionTypeValue: OpenLibraryTypeValue | null = !descriptionIsString ? (description as OpenLibraryTypeValue) : {type: '', value: ''};
              if (typeof description !== 'string' && description !== null && typeof description === 'object') {
                Object.entries(description ?? {}).forEach(([key, value]) => {
                  if (typeof value !== 'function') {
                    console.log(`description.${key}:`, value);
                  }
                });
              }
              importBook && importBook({
                id: crypto.randomUUID(),
                Title: openLibraryBook.title || "",
                Description: (descriptionIsString ? openLibraryBook.description?.toString() : descriptionTypeValue?.value || "") || "",
                URL: bookKey ? `https://openlibrary.org${bookKey}` : "",
                Cover: coverID ? `https://covers.openlibrary.org/b/id/${coverID}-M.jpg` : ""
              });
            });
          } while (continueFetching);
        }
      }
      catch (err) {
        console.error("Failed to import books from OpenLibrary", err);
      }
      finally {
        resetState();
      }
    }
    switch (buttonState) {
      case "OpenLibraryImporting":
        openLibraryImport();
        break;
      case "GoogleImporting":
        googleImport();
        break;
      case "Editing":
        if (bookId) {
          onEdit(bookId);
          resetState();
        }
        break;
      case "Deleting":
        if (bookId) {
          onDelete(bookId);
          resetState();
        }
        break;
      case "default":
        break;
    }
  }, [buttonState]);

  function onGoogleImportClick(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    dispatch({ type: "SET_LOADING", value: true });
    dispatch({ type: "BUTTON_CLICK", value: "GoogleImporting" });
  }

  function importBooksFromOpenLibrary(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    if (!authorName || !importBook) return;
    dispatch({ type: "SET_LOADING", value: true });
    dispatch({ type: "BUTTON_CLICK", value: "OpenLibraryImporting" });
  }

  function onEditClick(event: React.MouseEvent<HTMLButtonElement>, book: Book): void {
    event.preventDefault();
    dispatch({ type: "SET_BOOK_ID", value: book.id });
    dispatch({ type: "SET_LOADING", value: true });
    dispatch({ type: "BUTTON_CLICK", value: "Editing" });
  }

  function onDeleteClick(event: React.MouseEvent<HTMLButtonElement>, book: Book): void {
    event.preventDefault();
    dispatch({ type: "SET_BOOK_ID", value: book.id });
    dispatch({ type: "SET_LOADING", value: true });
    dispatch({ type: "BUTTON_CLICK", value: "Deleting" });
  }

  return {
    state,
    dispatch,
    onGoogleImportClick,
    importBooksFromOpenLibrary,
    onEditClick,
    onDeleteClick,
    resetState,
  };
}
