import { useEffect, useReducer } from "react";
import { useGetLocalizedText } from './useGetLocalizedText';
import { useTrackComponent } from './useTrackComponent';
import { authorListReducer, initialAuthorListState } from "../reducers/authorListReducer";
import type { Author } from "../types/Author";
import type { AuthorRegistrationProps } from "../components/AuthorRegistration/AuthorRegistrationProps";
import type { UseAuthorRegistrationReturn } from "../types/UseAuthorRegistrationReturn";
import { useAuthorsByDomain } from "./useAuthorsByDomain";
import { normalizeArray } from "../services/normalizeArray";

export function useAuthorRegistration({ state, dispatch, culture }: AuthorRegistrationProps): UseAuthorRegistrationReturn {
    const { authToken, Authors, domainRegistration } = state;
    const { domain } = domainRegistration || {};
    const { secondLevelDomain, topLevelDomain } = domain || {};
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
    const { authorInformation, error, loading } = useAuthorsByDomain(authToken ?? "", secondLevelDomain || "", topLevelDomain || "");
    useEffect(() => {
        if (!error && authorInformation && authorInformation.length > 0) {
            authorInformation.forEach(author => {
                dispatch({ type: "SAVE_AUTHOR", payload: author });
            });
        }
    }, [authorInformation, error, loading]);
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
        const localAuthors = normalizeArray(Authors);
        const found = localAuthors.find(a => a.id === id);
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
        const authors = normalizeArray(Authors);
        if (authors.length < 1) {
            dispatchList({ type: "SET_WARNING", payload: "You must add at least one author record before continuing." });
        } else {
            dispatchList({ type: "SET_WARNING", payload: "" });
            dispatch({ type: "SET_UI_STATE", payload: "chooseSubscription" });
        }
    };
    const authorsList = normalizeArray(Authors);
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
        loading
    };
}
