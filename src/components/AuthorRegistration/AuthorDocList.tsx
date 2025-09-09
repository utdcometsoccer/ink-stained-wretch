import type { FC } from 'react';
import { useEffect } from "react";
import { trackComponent } from "../../services/trackComponent";
import ImportExportIcon from '@mui/icons-material/ImportExport';
import './AuthorDocList.css';
import type { AuthorDoc } from '../../types/OpenLibrary';

export interface AuthorDocListProps {
    authors: AuthorDoc[];
    onAuthorClick: (author: AuthorDoc) => void;
    onImport: (author: AuthorDoc) => void;
    onGoBack: () => void;
    importedKeys?: string[];
}

const AuthorDocList: FC<AuthorDocListProps> = ({ authors, onAuthorClick, onImport, onGoBack, importedKeys = [] }) => {
    useEffect(() => {
        trackComponent('AuthorDocList', { authors });
    }, [authors]);
    return (
        <div className="author-doc-list-container">
            <ul className="author-doc-list">
                {authors.map((author) => {
                    const isImported = importedKeys.includes(author.key);
                    return (
                        <li key={author.key} className="author-doc-list-item">
                            <a
                                href="#"
                                className={`author-doc-name clickable${isImported ? ' disabled' : ''}`}
                                onClick={isImported ? undefined : () => onAuthorClick(author)}
                                tabIndex={isImported ? -1 : 0}
                            >
                                {author.name}
                            </a>
                            <span className="author-doc-top-work">Top Work: {author.top_work}</span>
                            <span className="author-doc-birth-date">Birth Date: {author.birth_date}</span>
                            <button
                                className="author-doc-import-btn"
                                onClick={isImported ? undefined : () => onImport(author)}
                                disabled={isImported}
                                title="Import AuthorDoc"
                            >
                                <ImportExportIcon className="author-doc-import-icon" />
                                Import
                            </button>
                        </li>
                    );
                })}
            </ul>
            <button className="author-doc-go-back-btn" onClick={onGoBack}>
                Go Back
            </button>
        </div>
    );
};

export default AuthorDocList;
