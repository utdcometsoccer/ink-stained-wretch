
import type { Dispatch } from "react";
import { useReducer } from "react";
import type { Action } from "../../reducers/appReducer";
import { authorListReducer, initialAuthorListState } from "../../reducers/authorListReducer";
import type { Author } from "../../types/Author";
import type { State } from "../../types/State";
import { AuthorForm } from "./AuthorForm";
import "./AuthorList.css";

export interface AuthorRegistrationProps {
    state: State;
    dispatch: Dispatch<Action>;
}

export function AuthorRegistration({ state, dispatch }: AuthorRegistrationProps) {
    const authors: Author[] = Array.isArray(state.Authors) ? state.Authors : [];
    const [listState, dispatchList] = useReducer(authorListReducer, {
        ...initialAuthorListState,
        authorList: authors
    });

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

    const handleEditAuthor = (id: string) => {
        const found = listState.authorList.find(a => a.id === id);
        if (found) {
            dispatchList({ type: "SHOW_FORM", payload: found });
        }
    };

    const handleSaveAuthor = (author: Author) => {
        dispatchList({ type: "SAVE_AUTHOR", payload: author });
    };

    const handleCancelAuthor = () => {
        dispatchList({ type: "HIDE_FORM" });
        dispatchList({ type: "SET_NEW_AUTHOR_NULL" }); // Explicitly set newAuthor to null
    };

    const handleValidateAuthors = () => {
        if (listState.authorList.length < 1) {
            dispatchList({ type: "SET_WARNING", payload: "You must add at least one author record before continuing." });
        } else {
            dispatchList({ type: "SET_WARNING", payload: "" });
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
            <button className="author-list-add-btn app-btn" onClick={handleAddAuthor}>Add Author</button>
            <button className="author-list-validate-btn app-btn" onClick={handleValidateAuthors}>Continue</button>
            {listState.authorWarning && <div className="author-list-warning">{listState.authorWarning}</div>}
            {listState.showForm && listState.newAuthor && (
                <AuthorForm
                    appState={state}
                    author={listState.newAuthor}
                    domain={state.domainRegistration?.domain}
                    onSave={handleSaveAuthor}
                    onCancel={handleCancelAuthor}
                />
            )}
        </div>
    );
}
