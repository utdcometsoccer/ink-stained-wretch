import type { Author } from "../../types/Author";

export interface AuthorFormProps {
    author: Author;
    token: string;
    onSave: (author: Author) => void;
    onCancel: () => void;
}
