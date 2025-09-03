

import { useState } from "react";
import type { FC } from "react";
import type { Author } from "../../types/Author";
import type { AuthorListProps } from "./AuthorListProps";
import { AuthorForm } from "./AuthorForm";
import "./AuthorList.css";

export const AuthorList: FC<AuthorListProps & { token: string }> = ({ state, onEdit, token }) => {
  const authors: Author[] = Array.isArray(state.Authors) ? state.Authors : [];
  const [showForm, setShowForm] = useState(false);
  const [authorList, setAuthorList] = useState<Author[]>(authors);
  const [newAuthor, setNewAuthor] = useState<Author | null>(null);

  const handleAddAuthor = () => {
    setNewAuthor({
      id: crypto.randomUUID(),
      AuthorName: "",
      LanguageName: "",
      RegionName: "",
      EmailAddress: "",
      WelcomeText: "",
      AboutText: "",
      HeadShotURL: "",
      CopyrightText: "",
      TopLevelDomain: "",
      SecondLevelDomain: "",
      Articles: [],
      Books: [],
      Socials: []
    });
    setShowForm(true);
  };

  const handleSaveAuthor = (author: Author) => {
    setAuthorList([...authorList, author]);
    setShowForm(false);
    setNewAuthor(null);
  };

  const handleCancelAuthor = () => {
    setShowForm(false);
    setNewAuthor(null);
  };

  return (
    <div className="author-list">
      <h2 className="author-list-title">Authors List</h2>
      <ul className="author-list-ul">
        {authorList.map(author => (
          <li key={author.id} className="author-list-li">
            <span className="author-list-author">{author.AuthorName}</span>
            <span className="author-list-span">Language: {author.LanguageName}</span>
            <span className="author-list-span">Region: {author.RegionName}</span>
            <button className="author-list-edit-btn" onClick={() => onEdit(author.id)}>Edit</button>
          </li>
        ))}
      </ul>
      <button className="author-list-add-btn" onClick={handleAddAuthor}>Add Author</button>
      {showForm && newAuthor && (
        <AuthorForm
          author={newAuthor}
          token={token}
          onSave={handleSaveAuthor}
          onCancel={handleCancelAuthor}
        />
      )}
    </div>
  );
}
