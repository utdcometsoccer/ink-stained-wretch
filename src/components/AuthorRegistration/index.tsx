
import { useReducer, useState } from "react";
import type { Author } from "../../types/Author";
import { AuthorForm } from "./AuthorForm";
import "./AuthorList.css";
import { authorListReducer, initialAuthorListState } from "../../reducers/authorListReducer";
import type { State } from "../../types/State";
import type { Dispatch } from "react";
import type { Action } from "../../reducers/appReducer";

export interface AuthorRegistrationProps {
    state: State;
    dispatch: Dispatch<Action>;
}

export function AuthorRegistration({ state, dispatch }: AuthorRegistrationProps) {
    const authors: Author[] = Array.isArray(state.Authors) ? state.Authors : [];
    const [listState, dispatchList] = useReducer(authorListReducer, { ...initialAuthorListState, authorList: authors });
    const [editAuthor, setEditAuthor] = useState<Author | null>(null);
    const [authorWarning, setAuthorWarning] = useState<string>("");

    const handleAddAuthor = () => {
        setEditAuthor({
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
    };

    const handleEditAuthor = (id: string) => {
        const found = listState.authorList.find(a => a.id === id);
        if (found) setEditAuthor(found);
    };

    const handleSaveAuthor = (author: Author) => {
        dispatchList({ type: "SAVE_AUTHOR", payload: author });
        setEditAuthor(null);
    };

    const handleCancelAuthor = () => {
        setEditAuthor(null);
    };

    const handleValidateAuthors = () => {
        if (listState.authorList.length < 1) {
            setAuthorWarning("You must add at least one author record before continuing.");
        } else {
            setAuthorWarning("");
            dispatch({ type: "SET_UI_STATE", payload: "chooseSubscription" });
        }
    };

    return (
        <div className="author-list">
            <h2 className="author-list-title">Author Information</h2>
            <ul className="author-list-ul">
                {listState.authorList.map(author => (
                    <li key={author.id} className="author-list-li">
                        <span className="author-list-author">{author.AuthorName}</span>
                        <span className="author-list-span">Language: {author.LanguageName}</span>
                        <span className="author-list-span">Region: {author.RegionName}</span>
                        <button className="author-list-edit-btn" onClick={() => handleEditAuthor(author.id)}>Edit</button>
                    </li>
                ))}
            </ul>
            <button className="author-list-add-btn" onClick={handleAddAuthor}>Add Author</button>
            <button className="author-list-validate-btn" onClick={handleValidateAuthors}>Continue</button>
            {authorWarning && <div className="author-list-warning">{authorWarning}</div>}
            {editAuthor && (
                <AuthorForm
                    appState={state}
                    author={editAuthor}
                    domain={state.domainRegistration?.domain}
                    onSave={handleSaveAuthor}
                    onCancel={handleCancelAuthor}
                />
            )}
        </div>
    );
}
