import ImportExportIcon from '@mui/icons-material/ImportExport';
import CircularProgress from '@mui/material/CircularProgress';
import { type FC } from 'react';
import { useLocalizationContext } from '../../hooks/useLocalizationContext';
import { usePenguinRandomHouseAuthorSearch } from '../../hooks/usePenguinRandomHouseAuthorSearch';
import { useTrackComponent } from '../../hooks/useTrackComponent';
import type { AuthorResult } from '../../types/PenguinRandomHouse';
import './PenguinRandomHouseAuthorImport.css';
import type { PenguinRandomHouseAuthorImportProps } from './PenguinRandomHouseAuthorImportProps';

const PenguinRandomHouseAuthorImport: FC<PenguinRandomHouseAuthorImportProps> = ({
  query,
  onAuthorClick,
  onImport,
  onGoBack,
  importedKeys = [],
  accessToken,
  authorSearchHook = usePenguinRandomHouseAuthorSearch
}) => {
  const localization = useLocalizationContext();
  const text = localization.PenguinRandomHouseAuthorList;
  useTrackComponent('PenguinRandomHouseAuthorImport', { query, importedKeys });
  const { penguinAuthors, error, loading } = authorSearchHook(query, accessToken);

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

