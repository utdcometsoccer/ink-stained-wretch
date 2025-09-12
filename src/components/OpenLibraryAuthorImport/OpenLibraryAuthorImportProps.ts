import type { AuthorDoc } from '../../types/OpenLibrary';

export interface OpenLibraryAuthorImportProps {
    authors: AuthorDoc[];
    onAuthorClick: (author: AuthorDoc) => void;
    onImport: (author: AuthorDoc) => void;
    onGoBack: () => void;
    importedKeys?: string[];
    culture?: string;
}
