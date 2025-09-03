import type { Author } from "../../types/Author";

import type { Domain } from "../../types/Domain";

export interface AuthorFormProps {
    author: Author;
    token: string;
    domain?: Domain;
    onSave: (author: Author) => void;
    onCancel: () => void;
}
