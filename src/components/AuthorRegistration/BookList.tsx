
import type { FC } from "react";
import "./BookList.css";

import type { BookListProps } from "./BookListProps";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export const BookList: FC<BookListProps> = ({ books, onEdit, onAdd, onDelete }) => (
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
  </div>
);
