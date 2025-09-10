import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import GoogleIcon from '@mui/icons-material/Google';
import CircularProgress from "@mui/material/CircularProgress";
import type { FC } from "react";
import { useBookList } from "../../hooks/useBookList";
import { useGetLocalizedText } from '../../hooks/useGetLocalizedText';
import { useTrackComponent } from '../../hooks/useTrackComponent';
import "./BookList.css";
import type { BookListProps } from "./BookListProps";

export const BookList: FC<BookListProps> = (props) => {
  useTrackComponent('BookList', props);
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
  const culture = props.culture || 'en-us';
  const localized = useGetLocalizedText(culture)?.BookList || {
    title: 'Books',
    description: 'Description:',
    url: 'URL:',
    edit: 'Edit',
    delete: 'Delete',
    addBook: 'Add Book',
    importOpenLibrary: 'Import Books Open Library',
    importGoogleBooks: 'Import Google Books'
  };
  return loading ? <CircularProgress /> : (
    <div>
      <h2 className="book-list-title">{localized?.title}</h2>
      <ul className="book-list-ul">
        {books.map(book => {
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
              <span className="book-list-span">{localized?.description} {safeDescription}</span>
              <span className="book-list-span">{localized?.url} {safeURL}</span>
              <span className="book-list-btn-row">
                <button className="book-list-edit-btn icon-btn" title={localized?.edit} onClick={(event) => onEditClick(event, book)}>
                  <EditIcon fontSize="small" />
                  <span className="btn-label">{localized?.edit}</span>
                </button>
                <button className="book-list-delete-btn icon-btn cancel" title={localized?.delete} onClick={(event) => onDeleteClick(event, book)}>
                  <DeleteIcon fontSize="small" />
                  <span className="btn-label">{localized?.delete ?? 'Delete'}</span>
                </button>
              </span>
            </li>
          );
        })}
      </ul>
      <button className="book-list-add-btn icon-btn" title={localized?.addBook} onClick={props.onAdd}>
        <AddIcon fontSize="small" />
        <span className="btn-label">{localized?.addBook}</span>
      </button>
      <button type="button" className={disableImport ? 'book-list-cancel-btn icon-btn': 'book-list-add-btn icon-btn'} onClick={importBooksFromOpenLibrary} disabled={disableImport}>
        <AccountBalanceIcon fontSize="small" />
        {localized?.importOpenLibrary}
      </button>
      <button disabled={disableGoogleImport} className={disableGoogleImport ? "book-list-cancel-btn icon-btn" : "book-list-add-btn icon-btn"} title={localized?.importGoogleBooks} onClick={onGoogleImportClick}>
        <GoogleIcon fontSize="small" className="book-list-book-icon" />
        <span className="btn-label">{localized?.importGoogleBooks}</span>
      </button>
    </div>
  );
};


