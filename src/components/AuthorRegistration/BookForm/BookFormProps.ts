import type { Book } from "../../../types/Book";

export interface BookFormProps {
  book: Book;
  onSave: (book: Book) => void;
  onCancel: () => void;
  culture?: string;
}
