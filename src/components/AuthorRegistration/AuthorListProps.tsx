import type { Dispatch } from "react";
import type { Action } from "../../reducers/appReducer";
import type { State } from "../../types/State";

export interface AuthorListProps {
    state: State;
    dispatch: Dispatch<Action>;
    onEdit: (id: string) => void;
    onAdd: () => void;
}
