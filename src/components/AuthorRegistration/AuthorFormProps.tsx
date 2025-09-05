import type { Language } from "@idahoedokpayi/react-country-state-selector";
import type { Author } from "../../types/Author";
import type { Domain } from "../../types/Domain";
import type { State } from "../../types/State";

export interface AuthorFormProps {
    appState: State;
    author: Author;
    domain?: Domain;
    language: Language;
    onSave: (author: Author) => void;
    onCancel: () => void;
}
