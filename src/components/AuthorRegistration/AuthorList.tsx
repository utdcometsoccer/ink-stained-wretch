
import type { FC } from "react";
import "./AuthorList.css";
import type { Author } from "../../types/Author";
import type { AuthorListProps } from "./AuthorListProps";

export const AuthorList: FC<AuthorListProps> = ({ state, dispatch, onEdit, onAdd }) => {
  const authors: Author[] = Array.isArray(state.Authors) ? state.Authors : [];
  return (
    <div className="author-list">
      <h2 className="author-list-title">Authors List</h2>
      <ul className="author-list-ul">
        {authors.map(author => (
          <li key={author.id} className="author-list-li">
            <span className="author-list-author">{author.AuthorName}</span>
            <span className="author-list-span">Language: {author.LanguageName}</span>
            <span className="author-list-span">Region: {author.RegionName}</span>
            <button className="author-list-edit-btn" onClick={() => onEdit(author.id)}>Edit</button>
          </li>
        ))}
      </ul>
      <button className="author-list-add-btn" onClick={onAdd}>Add Author</button>
    </div>
  );
}
