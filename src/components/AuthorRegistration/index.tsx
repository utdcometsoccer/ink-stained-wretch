import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { AuthorForm } from "../AuthorForm/index";
import "./AuthorList.css";
import type { AuthorRegistrationProps } from "./AuthorRegistrationProps";
import { useAuthorRegistration } from '../../hooks/useAuthorRegistration';
import type { FC } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

export const AuthorRegistration: FC<AuthorRegistrationProps> = (props: AuthorRegistrationProps) => {
    const {
        text,
        authorsList,
        listState,
        handleAddAuthor,
        handleEditAuthor,
        handleDeleteAuthor,
        handleSaveAuthor,
        handleCancelAuthor,
        handleValidateAuthors,
        state,
        loading
    } = useAuthorRegistration(props);
    return loading ? (
        <CircularProgress />
    ) : (
        <div className="author-list">
            <h2 className="author-list-title">{text?.authorListTitle}</h2>
            <ul className="author-list-ul">
                {authorsList.map(author => (
                    <li key={author.id} className="author-list-li">
                        <img
                            src={author.HeadShotURL || ''}
                            alt={author.AuthorName + ' headshot'}
                            className="author-list-thumb"
                        />
                        <span className="author-list-author">{author.AuthorName}</span>
                        <span className="author-list-span">{text?.languageLabel}{author.LanguageName}</span>
                        <span className="author-list-span">{text?.regionLabel}{author.RegionName}</span>
                        <span className="author-list-btn-row author-list-inline-btns">
                            <button className="author-list-edit-btn icon-btn" title={text?.editAuthor} onClick={() => handleEditAuthor(author.id)}>
                                <EditIcon fontSize="small" />
                                <span className="btn-label">{text?.editAuthor}</span>
                            </button>
                            <button className="author-list-delete-btn icon-btn cancel" title={text?.deleteAuthor} onClick={() => handleDeleteAuthor(author.id)}>
                                <DeleteIcon fontSize="small" />
                                <span className="btn-label">{text?.deleteAuthor}</span>
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
                <button className="author-list-add-btn author-list-btn app-btn" title={text?.addAuthor} onClick={handleAddAuthor}>
                    <AddIcon fontSize="small" />
                    <span className="btn-label">{text?.addAuthor}</span>
                </button>
                <button className="author-list-validate-btn author-list-btn app-btn" title={text?.continue} onClick={handleValidateAuthors}>
                    <ArrowForwardIcon fontSize="small" />
                    <span className="btn-label">{text?.continue}</span>
                </button>
            </div>
        </div>
    );
}
