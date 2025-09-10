import type { Book } from "../../../types/Book";

export interface BookListProps {
  authorName?: string;
  importBook?: (book: Book) => void;
  books: Book[];
  onEdit: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  openLibraryAuthorKeys?: string[];
  culture?: string;
}
