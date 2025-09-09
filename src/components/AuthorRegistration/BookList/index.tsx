import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import GoogleIcon from '@mui/icons-material/Google';
import CircularProgress from "@mui/material/CircularProgress";
import type { FC } from "react";
import { useBookList } from "../../../hooks/useBookList";
import "./BookList.css";
import type { BookListProps } from "./BookListProps";

export const BookList: FC<BookListProps> = (props) => {
  const { books } = props;
  const {
    state,
    onGoogleImportClick,
    importBooksFromOpenLibrary,
    onEditClick,
    onDeleteClick,
  } = useBookList(props);
  const { disableGoogleImport, loading, openLibraryAuthorKeys} = state;
  const disableImport = openLibraryAuthorKeys.length === 0 || loading;
  return loading ? <CircularProgress /> : (
    <div>
      <h2 className="book-list-title">Books</h2>
      <ul className="book-list-ul">
        {books.map(book => {
          // Defensive sanitization for book properties
          const safeTitle = typeof book.Title === "string" ? book.Title : "";
          const safeDescription = typeof book.Description === "string" ? book.Description : "";
          const safeURL = typeof book.URL === "string" ? book.URL : "";
          const safeCover = typeof book.Cover === "string" ? book.Cover : "";
          return (
            <li key={book.id} className="book-list-li">
              <img
                src={safeCover}
                alt={safeTitle + ' cover'}
                className="book-list-cover"
              />
              <span className="book-list-span"><strong>{safeTitle}</strong></span>
              <span className="book-list-span">Description: {safeDescription}</span>
              <span className="book-list-span">URL: {safeURL}</span>
              <span className="book-list-btn-row">
                <button className="book-list-edit-btn icon-btn" title="Edit" onClick={(event) => onEditClick(event, book)}>
                  <EditIcon fontSize="small" />
                  <span className="btn-label">Edit</span>
                </button>
                <button className="book-list-delete-btn icon-btn cancel" title="Delete" onClick={(event) => onDeleteClick(event, book)}>
                  <DeleteIcon fontSize="small" />
                  <span className="btn-label">Delete</span>
                </button>
              </span>
            </li>
          );
        })}
      </ul>
      <button className="book-list-add-btn icon-btn" title="Add Book" onClick={props.onAdd}>
        <AddIcon fontSize="small" />
        <span className="btn-label">Add Book</span>
      </button>
      <button type="button" className={disableImport ? 'book-list-cancel-btn icon-btn': 'book-list-add-btn icon-btn'} onClick={importBooksFromOpenLibrary} disabled={disableImport}>
        <AccountBalanceIcon fontSize="small" />
        Import Books Open Library
      </button>
      <button disabled={disableGoogleImport} className={disableGoogleImport ? "book-list-cancel-btn icon-btn" : "book-list-add-btn icon-btn"} title="Import Books" onClick={onGoogleImportClick}>
        <GoogleIcon fontSize="small" className="book-list-book-icon" />
        <span className="btn-label">Import Google Books</span>
      </button>
    </div>
  );
};


