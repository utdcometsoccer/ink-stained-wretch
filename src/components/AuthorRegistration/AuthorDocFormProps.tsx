import type { AuthorDoc } from "../../types/OpenLibrary";


export interface AuthorDocFormProps {
    initialAuthorDoc: AuthorDoc;
    onSave: (authorDoc: AuthorDoc) => void;
    onCancel: () => void;
}
