import type { AuthorResult } from '../../types/PenguinRandomHouse';


export interface PenguinRandomHouseAuthorImportProps {
  query: string;
  onAuthorClick: (author: AuthorResult) => void;
  onImport: (author: AuthorResult) => void;
  onGoBack: () => void;
  importedKeys?: string[];
  authorSearchHook?: (query: string) => {
    penguinAuthors: AuthorResult[] | null;
    error: string | null;
    loading: boolean;
  };
}
