import type { Author } from "../../types/Author";
import type { Domain } from "../../types/Domain";
import type { State } from "../../types/State";
import type { Action } from "../../types/Action";
import type { Dispatch } from "react";

export interface AuthorFormProps {
    appState: State;
    author: Author;
    domain?: Domain;
    onSave: (author: Author) => void;
    onCancel: () => void;
    dispatch?: Dispatch<Action>;
}
