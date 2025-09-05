import type { Book } from "../../types/Book";

export interface BookListProps {
  books: Book[];
  onEdit: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}
