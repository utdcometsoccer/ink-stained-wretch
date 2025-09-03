import { useReducer } from "react";
import type { FC } from "react";
import type { Author } from "../../types/Author";
import type { AuthorListProps } from "./AuthorListProps";
import { AuthorForm } from "./AuthorForm";
import "./AuthorList.css";
import { authorListReducer, initialAuthorListState } from "../../reducers/authorListReducer";

export const AuthorList: FC<AuthorListProps & { token: string }> = ({ state, onEdit, token }) => {
  const authors: Author[] = Array.isArray(state.Authors) ? state.Authors : [];
  const [listState, dispatchList] = useReducer(authorListReducer, { ...initialAuthorListState, authorList: authors });

  const handleAddAuthor = () => {
    dispatchList({
      type: "SHOW_FORM",
      payload: {
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
      }
    });
  };

  const handleSaveAuthor = (author: Author) => {
    dispatchList({ type: "SAVE_AUTHOR", payload: author });
  };

  const handleCancelAuthor = () => {
    dispatchList({ type: "HIDE_FORM" });
  };

  return (
    <div className="author-list">
      <h2 className="author-list-title">Authors List</h2>
      <ul className="author-list-ul">
        {listState.authorList.map(author => (
          <li key={author.id} className="author-list-li">
            <span className="author-list-author">{author.AuthorName}</span>
            <span className="author-list-span">Language: {author.LanguageName}</span>
            <span className="author-list-span">Region: {author.RegionName}</span>
            <button className="author-list-edit-btn" onClick={() => onEdit(author.id)}>Edit</button>
          </li>
        ))}
      </ul>
      <button className="author-list-add-btn" onClick={handleAddAuthor}>Add Author</button>
      {listState.showForm && listState.newAuthor && (
        <AuthorForm
          author={listState.newAuthor}
          token={token}
          onSave={handleSaveAuthor}
          onCancel={handleCancelAuthor}
        />
      )}
    </div>
  );
}
