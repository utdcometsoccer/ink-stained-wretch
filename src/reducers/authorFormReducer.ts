import type { AuthorForms } from "../types/AuthorForms";
import type { AuthorFormUIState } from "../types/AuthorFormUIState";
import type { AuthorFormAction } from "../types/AuthorFormAction";

export const initialAuthorFormState: AuthorFormUIState = {
  id: "",
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
  Socials: [],
  editType: null,
  editIndex: null,
  showImageManager: false,
  authorDocs: [],  
  selectedAuthorDoc: null,
  authorFormState: "Default" as AuthorForms
};

export function authorFormReducer(state: AuthorFormUIState, action: AuthorFormAction): AuthorFormUIState {
  switch (action.type) {
    case "UPDATE_FIELD":
      if (action.payload.name === "TopLevelDomain" || action.payload.name === "SecondLevelDomain") {
        return state;
      }
      return { ...state, [action.payload.name]: action.payload.value };
    case "ADD_ARTICLE":
      return { ...state, Articles: [...state.Articles, action.payload] };
    case "ADD_BOOK":
      return { ...state, Books: [...state.Books, action.payload] };
    case "ADD_SOCIAL":
      return { ...state, Socials: [...state.Socials, action.payload] };
    case "SET_DOMAIN":
      return {
        ...state,
        TopLevelDomain: action.payload.topLevelDomain || "",
        SecondLevelDomain: action.payload.secondLevelDomain || ""
      };
    case "SET_EDIT_TYPE":
      return { ...state, editType: action.payload };
    case "SET_EDIT_INDEX":
      return { ...state, editIndex: action.payload };
    case "SET_SHOW_IMAGE_MANAGER":
      return { ...state, showImageManager: action.payload };
    case "SET_AUTHOR_DOCS": {
      const docs = action.payload;
      return {
        ...state,
        authorDocs: docs
      };
    }
    case "SHOW_AUTHOR_DOC_LIST":
      return { ...state, authorFormState: "AuthorDocList" };
    case "HIDE_AUTHOR_DOC_LIST":
      return { ...state, authorDocs: [], authorFormState: "default" };
    case "SELECT_AUTHOR_DOC":
      return { ...state, selectedAuthorDoc: action.payload };
    case "SHOW_AUTHOR_DOC_FORM":
      return { ...state, authorFormState: "AuthorDocForm" };
    case "HIDE_AUTHOR_DOC_FORM":
      return { ...state, authorFormState: "default" };
    case "IMPORT_AUTHOR_DOC_KEYS": {
      // Add all keys from payload AuthorDoc[] to OpenLibraryAuthorKeys, deduplicated
      const newKeys = action.payload.map(doc => doc.key);
      const existingKeys = state.OpenLibraryAuthorKeys || [];
      const allKeys = Array.from(new Set([...existingKeys, ...newKeys]));
      return { ...state, OpenLibraryAuthorKeys: allKeys };
    }
    case "SAVE_SELECTED_AUTHOR_DOC": {
      // Add selectedAuthorDoc.key to OpenLibraryAuthorKeys, deduplicated
      if (!state.selectedAuthorDoc) return state;
      const key = state.selectedAuthorDoc.key;
      const existingKeys = state.OpenLibraryAuthorKeys || [];
      const allKeys = existingKeys.includes(key) ? existingKeys : [...existingKeys, key];
      return { ...state, OpenLibraryAuthorKeys: allKeys };
    }
    case "SET_BUTTON_STATE":
      return { ...state, buttonState: action.payload };
    case "RESET_FORM":
      return initialAuthorFormState;
    case "SET_AUTHOR_FORM_STATE":
      return {
        ...state,
        authorFormState: action.payload
      };
    default:
      return state;
  }
}
