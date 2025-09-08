import type { AuthorDoc } from '../../types/OpenLibrary';

export interface AuthorDocListProps {
    authors: AuthorDoc[];
    onAuthorClick: (author: AuthorDoc) => void;
    onImport: (author: AuthorDoc) => void;
    onGoBack: () => void;
}
