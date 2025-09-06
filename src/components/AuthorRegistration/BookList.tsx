
import type { FC } from "react";
import "./BookList.css";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import type { GoogleBookVolume } from "../../types/GoogleBooksApi";
import type { BookListProps } from "./BookListProps";
import { googleBooksvolumesAPI } from "../../services/googleBooksvolumesAPI";


export const BookList: FC<BookListProps> = ({ authorName, books, importBook, onEdit, onAdd, onDelete }) => {
  async function handleAmazonImport(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    event.preventDefault();
    if (!authorName || !importBook) return;
    try {     
      const bookVolumes = await googleBooksvolumesAPI(authorName);
      bookVolumes.forEach((item: GoogleBookVolume) => {
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
  }
  const disableImport = !authorName || !importBook;
  return (
    <div>
      <h2 className="book-list-title">Books</h2>
      <ul className="book-list-ul">
        {books.map(book => (
          <li key={book.id} className="book-list-li">
            <img
              src={book.Cover || ''}
              alt={book.Title + ' cover'}
              className="book-list-cover"
            />
            <span className="book-list-span"><strong>{book.Title}</strong></span>
            <span className="book-list-span">Description: {book.Description}</span>
            <span className="book-list-span">URL: {book.URL}</span>
            <span className="book-list-btn-row">
              <button className="book-list-edit-btn icon-btn" title="Edit" onClick={() => onEdit(book.id)}>
                <EditIcon fontSize="small" />
                <span className="btn-label">Edit</span>
              </button>
              <button className="book-list-delete-btn icon-btn cancel" title="Delete" onClick={() => onDelete(book.id)}>
                <DeleteIcon fontSize="small" />
                <span className="btn-label">Delete</span>
              </button>
            </span>
          </li>
        ))}
      </ul>
      <button className="book-list-add-btn icon-btn" title="Add Book" onClick={onAdd}>
        <AddIcon fontSize="small" />
        <span className="btn-label">Add Book</span>
      </button>
      <button disabled={disableImport} className="book-list-add-btn icon-btn" title="Import Books" onClick={handleAmazonImport}>
        <LibraryBooksIcon fontSize="small" className="book-list-book-icon" />
        <span className="btn-label">Import Google Books</span>
      </button>
    </div>);
};


