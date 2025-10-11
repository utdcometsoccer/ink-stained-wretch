import type { Book } from "../../types/Book";
import type { Action } from "../../types/Action";
import type { Dispatch } from "react";

export interface BookFormProps {
  book: Book;
  onSave: (book: Book) => void;
  onCancel: () => void;
  culture?: string;
  dispatch?: Dispatch<Action>;
}
