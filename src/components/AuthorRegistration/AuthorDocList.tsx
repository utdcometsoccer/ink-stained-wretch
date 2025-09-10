import type { FC } from 'react';
import { useEffect } from "react";
import { trackComponent } from "../../services/trackComponent";
import ImportExportIcon from '@mui/icons-material/ImportExport';
import type { AuthorDocListText } from "../../types/AuthorDocListText";
import './AuthorDocList.css';
import type { AuthorDoc } from '../../types/OpenLibrary';
import { useGetLocalizedText } from '../../hooks/useGetLocalizedText';
import { useTrackComponent } from '../../hooks/useTrackComponent';

export interface AuthorDocListProps {
    authors: AuthorDoc[];
    onAuthorClick: (author: AuthorDoc) => void;
    onImport: (author: AuthorDoc) => void;
    onGoBack: () => void;
    importedKeys?: string[];
    culture?: string;
}

const AuthorDocList: FC<AuthorDocListProps> = ({ authors, onAuthorClick, onImport, onGoBack, importedKeys = [], culture }) => {
    const text = useGetLocalizedText(culture ?? 'en-us')?.AuthorDocList || {
        title: 'Authors',
        topWork: 'Top Work:',
        birthDate: 'Birth Date:',
        import: 'Import',
        importTitle: 'Import AuthorDoc',
        goBack: 'Go Back'
    };
    useTrackComponent('AuthorDocList', { authors, onAuthorClick, onImport, onGoBack, importedKeys, culture });
    return (
        <div className="author-doc-list-container">
            <h2 className="author-doc-list-title">{text.title}</h2>
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
                            <span className="author-doc-top-work">{text.topWork} {author.top_work}</span>
                            <span className="author-doc-birth-date">{text.birthDate} {author.birth_date}</span>
                            <button
                                className="author-doc-import-btn"
                                onClick={isImported ? undefined : () => onImport(author)}
                                disabled={isImported}
                                title={text.importTitle}
                            >
                                <ImportExportIcon className="author-doc-import-icon" />
                                {text.import}
                            </button>
                        </li>
                    );
                })}
            </ul>
            <button className="author-doc-go-back-btn" onClick={onGoBack}>
                {text.goBack}
            </button>
        </div>
    );
};

export default AuthorDocList;
