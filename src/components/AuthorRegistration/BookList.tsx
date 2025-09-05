
import type { FC } from "react";
import "./BookList.css";

import type { BookListProps } from "./BookListProps";

export const BookList: FC<BookListProps> = ({ books, onEdit, onAdd, onDelete }) => (
  <div>
    <h2 className="book-list-title">Books</h2>
    <ul className="book-list-ul">
      {books.map(book => (
        <li key={book.id} className="book-list-li">
          <span className="book-list-span"><strong>{book.Title}</strong></span>
          <span className="book-list-span">Description: {book.Description}</span>
          <span className="book-list-span">URL: {book.URL}</span>
          <button className="book-list-edit-btn app-btn" onClick={() => onEdit(book.id)}>Edit</button>
          <button className="book-list-delete-btn app-btn cancel" onClick={() => onDelete(book.id)}>Delete</button>
        </li>
      ))}
    </ul>
    <button className="book-list-add-btn app-btn" onClick={onAdd}>Add Book</button>
  </div>
);
