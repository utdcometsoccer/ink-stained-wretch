import { useReducer } from "react";
import { authorListReducer, initialAuthorListState } from "../../reducers/authorListReducer";
import type { Author } from "../../types/Author";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { AuthorForm } from "./AuthorForm";
import "./AuthorList.css";
import type { AuthorRegistrationProps } from "./AuthorRegistrationProps";


export function AuthorRegistration({ state, dispatch }: AuthorRegistrationProps) {
    const handleDeleteAuthor = (id: string) => {        
        dispatch({ type: "DELETE_AUTHOR", payload: id });
    };    
    const [listState, dispatchList] = useReducer(authorListReducer, {
        ...initialAuthorListState
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
        const authors = Array.isArray(state.Authors) ? state.Authors : [];
        const found = authors.find(a => a.id === id);
        if (found) {
            dispatchList({ type: "SHOW_FORM", payload: found });
        }
    };

    const handleSaveAuthor = (author: Author) => {        
        dispatch({ type: "SAVE_AUTHOR", payload: author });
        dispatchList({ type: "HIDE_FORM" });
    };

    const handleCancelAuthor = () => {
        dispatchList({ type: "HIDE_FORM" });
        dispatchList({ type: "SET_NEW_AUTHOR_NULL" }); // Explicitly set newAuthor to null
        dispatch({ type: "DELETE_AUTHOR", payload: listState.newAuthor?.id || "" });
    };

    const handleValidateAuthors = () => {
        const authors = Array.isArray(state.Authors) ? state.Authors : [];
        if (authors.length < 1) {
            dispatchList({ type: "SET_WARNING", payload: "You must add at least one author record before continuing." });
        } else {
            dispatchList({ type: "SET_WARNING", payload: "" });
            dispatch({ type: "SET_UI_STATE", payload: "chooseSubscription" });
        }
    };

    const authorsList = Array.isArray(state.Authors) ? state.Authors : [];
    return (
        <div className="author-list">
            <h2 className="author-list-title">Author Information</h2>
            <ul className="author-list-ul">
                {authorsList.map(author => (
                    <li key={author.id} className="author-list-li">
                        <img
                            src={author.HeadShotURL || ''}
                            alt={author.AuthorName + ' headshot'}
                            className="author-list-thumb"
                        />
                        <span className="author-list-author">{author.AuthorName}</span>
                        <span className="author-list-span">Language: {author.LanguageName}</span>
                        <span className="author-list-span">Region: {author.RegionName}</span>
                        <span className="author-list-btn-row author-list-inline-btns">
                            <button className="author-list-edit-btn icon-btn" title="Edit" onClick={() => handleEditAuthor(author.id)}>
                                <EditIcon fontSize="small" />
                                <span className="btn-label">Edit</span>
                            </button>
                            <button className="author-list-delete-btn icon-btn cancel" title="Delete" onClick={() => handleDeleteAuthor(author.id)}>
                                <DeleteIcon fontSize="small" />
                                <span className="btn-label">Delete</span>
                            </button>
                        </span>
                    </li>
                ))}
            </ul>
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
            <div className="author-list-btn-row">
                <button className="author-list-add-btn author-list-btn app-btn" title="Add Author" onClick={handleAddAuthor}>
                    <AddIcon fontSize="small" />
                    <span className="btn-label">Add Author</span>
                </button>
                <button className="author-list-validate-btn author-list-btn app-btn" title="Continue" onClick={handleValidateAuthors}>
                    <ArrowForwardIcon fontSize="small" />
                    <span className="btn-label">Continue</span>
                </button>
            </div>
        </div>
    );
}
