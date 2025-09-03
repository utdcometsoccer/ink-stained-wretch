
import { AuthorList } from "./AuthorList";
import type { State } from "../../types/State";
import type { Dispatch } from "react";
import type { Action } from "../../reducers/appReducer";

export interface AuthorRegistrationProps {
    state: State;
    dispatch: Dispatch<Action>;
}

export function AuthorRegistration({ state, dispatch }: AuthorRegistrationProps) {
    const handleEdit = (id: string) => {
        // Implement edit logic, e.g., dispatch({ type: "EDIT_AUTHOR", payload: id })
        // For now, just log
        console.log("Edit author", id);
    };

    const handleAdd = () => {
        // Implement add logic, e.g., dispatch({ type: "ADD_AUTHOR" })
        // For now, just log
        console.log("Add author");
    };

    return (
        <div>
            <AuthorList
                state={state}
                dispatch={dispatch}
                onEdit={handleEdit}
                onAdd={handleAdd}
                token={state.authToken ?? ''}
            />
        </div>
    );
}
