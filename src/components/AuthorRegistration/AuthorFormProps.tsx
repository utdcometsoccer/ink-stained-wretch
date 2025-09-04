import type { Author } from "../../types/Author";
import type { Domain } from "../../types/Domain";
import type { Language } from "../../types/Language";

export interface AuthorFormProps {
    author: Author;
    token: string;
    domain?: Domain;
    language: Language;
    onSave: (author: Author) => void;
    onCancel: () => void;
}
