import { useReducer } from "react";
import { useGetLocalizedText } from './useGetLocalizedText';
import { useTrackComponent } from './useTrackComponent';
import { authorListReducer, initialAuthorListState } from "../reducers/authorListReducer";
import type { Author } from "../types/Author";
import type { AuthorRegistrationProps } from "../components/AuthorRegistration/AuthorRegistrationProps";

export function useAuthorRegistration({ state, dispatch, culture }: AuthorRegistrationProps & { culture?: string }) {
    const text = useGetLocalizedText(culture ?? 'en-us')?.AuthorRegistration || {
        authorListTitle: "Author Information",
        languageLabel: "Language: ",
        regionLabel: "Region: ",
        editAuthor: "Edit",
        deleteAuthor: "Delete",
        addAuthor: "Add Author",
        continue: "Continue"
    };
    useTrackComponent('AuthorRegistration', { state, dispatch, culture });
    const handleDeleteAuthor = (id: string) => {
        dispatch({ type: "DELETE_AUTHOR", payload: id });
    };
    const [listState, dispatchList] = useReducer(authorListReducer, {
        ...initialAuthorListState
    });
    const handleAddAuthor = () => {
        dispatchList({
            type: "SHOW_FORM",
            payload: {
                id: crypto.randomUUID(),
                AuthorName: "",
                LanguageName: "",
                RegionName: "",
                EmailAddress: "",
                WelcomeText: "",
                AboutText: "",
                HeadShotURL: "",
                CopyrightText: "",
                TopLevelDomain: "",
                SecondLevelDomain: "",
                Articles: [],
                Books: [],
                Socials: []
            }
        });
    };
    const handleEditAuthor = (id: string) => {
        const authors = Array.isArray(state.Authors) ? state.Authors : [];
        const found = authors.find(a => a.id === id);
        if (found) {
            dispatchList({ type: "SHOW_FORM", payload: found });
        }
    };
    const handleSaveAuthor = (author: Author) => {
        dispatch({ type: "SAVE_AUTHOR", payload: author });
        dispatchList({ type: "HIDE_FORM" });
    };
    const handleCancelAuthor = () => {
        dispatchList({ type: "HIDE_FORM" });
        dispatchList({ type: "SET_NEW_AUTHOR_NULL" });
        dispatch({ type: "DELETE_AUTHOR", payload: listState.newAuthor?.id || "" });
    };
    const handleValidateAuthors = () => {
        const authors = Array.isArray(state.Authors) ? state.Authors : [];
        if (authors.length < 1) {
            dispatchList({ type: "SET_WARNING", payload: "You must add at least one author record before continuing." });
        } else {
            dispatchList({ type: "SET_WARNING", payload: "" });
            dispatch({ type: "SET_UI_STATE", payload: "chooseSubscription" });
        }
    };
    const authorsList = Array.isArray(state.Authors) ? state.Authors : [];
    return {
        text,
        authorsList,
        listState,
        dispatchList,
        handleAddAuthor,
        handleEditAuthor,
        handleDeleteAuthor,
        handleSaveAuthor,
        handleCancelAuthor,
        handleValidateAuthors,
        state,
        dispatch,
    };
}
