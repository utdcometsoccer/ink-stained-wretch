import ImportExportIcon from '@mui/icons-material/ImportExport';
import type { FC } from 'react';
import { useGetLocalizedText } from '../../hooks/useGetLocalizedText';
import { useTrackComponent } from '../../hooks/useTrackComponent';
import { usePenguinRandomHouseAuthorSearch } from '../../hooks/usePenguinRandomHouseAuthorSearch';
import type { AuthorResult } from '../../types/PenguinRandomHouseSearchResult';
import './PenguinRandomHouseAuthorImport.css';
import CircularProgress from '@mui/material/CircularProgress';

export interface PenguinRandomHouseAuthorImportProps {
  query: string;
  onAuthorClick: (author: AuthorResult) => void;
  onImport: (author: AuthorResult) => void;
  onGoBack: () => void;
  importedKeys?: string[];
  culture?: string;
  authorSearchHook?: (query: string) => {
    penguinAuthors: AuthorResult[] | null;
    error: string | null;
    loading: boolean;
  };
}

const PenguinRandomHouseAuthorImport: FC<PenguinRandomHouseAuthorImportProps> = ({
  query,
  onAuthorClick,
  onImport,
  onGoBack,
  importedKeys = [],
  culture,
  authorSearchHook = usePenguinRandomHouseAuthorSearch
}) => {
  const text = useGetLocalizedText(culture ?? 'en-us')?.PenguinRandomHouseAuthorList || {
    title: 'Penguin Random House Authors',
    import: 'Import',
    importTitle: 'Import Author',
    goBack: 'Go Back',
    noResults: 'No authors found.',
  };
  useTrackComponent('PenguinRandomHouseAuthorImport', { query, importedKeys, culture });
  const { penguinAuthors, error, loading } = authorSearchHook(query);

  return (
    <div className="prh-author-list-container">
      <h2 className="prh-author-list-title">{text.title}</h2>
      {loading && <CircularProgress />}
      {error && <div className="prh-author-list-error">{error}</div>}
      <ul className="prh-author-list">
        {penguinAuthors && penguinAuthors.length > 0 ? penguinAuthors.map((author: AuthorResult) => {
          const isImported = importedKeys.includes(author.key);
          return (
            <li key={author.key} className={`prh-author-list-item${isImported ? ' imported' : ''}`}> 
              <a
                href="#"
                className={`prh-author-name clickable${isImported ? ' disabled' : ''}`}
                onClick={isImported ? undefined : () => onAuthorClick(author)}
                tabIndex={isImported ? -1 : 0}
              >
                {author.name}
              </a>
              <button
                className="prh-author-import-btn"
                onClick={isImported ? undefined : () => onImport(author)}
                disabled={isImported}
                title={text.importTitle}
              >
                <ImportExportIcon className="prh-author-import-icon" />
                {text.import}
              </button>
            </li>
          );
        }) : (
          <li className="prh-author-list-no-results">{text.noResults}</li>
        )}
      </ul>
      <button className="prh-author-go-back-btn" onClick={onGoBack}>
        {text.goBack}
      </button>
    </div>
  );
};

export { PenguinRandomHouseAuthorImport };
