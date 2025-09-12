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
  PenguinAuthorID: [],
  selectedAuthorDoc: null,
  authorFormState: "Default" as AuthorForms,
  penguinAuthors: []
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
    case "SELECT_PENGUIN_AUTHOR":
      // Set the selected Penguin author for editing or import
      return { ...state, selectedPenguinAuthor: action.payload };
    case "SHOW_PENGUIN_AUTHOR_FORM":
      // Switch UI state to show Penguin author form
      return { ...state, authorFormState: "PenguinAuthorForm" };
    case "IMPORT_PENGUIN_AUTHOR_ID": {
      // Add all Penguin author IDs from payload to PenguinAuthorID, deduplicated
      const newIds = action.payload;
      const existingIds = state.PenguinAuthorID || [];
      const allIds = Array.from(new Set([...existingIds, ...newIds]));
      return { ...state, PenguinAuthorID: allIds };
    }
    case "SET_PENGUIN_AUTHORS": {
      // Set the list of Penguin authors available for import
      return { ...state, penguinAuthors: action.payload };
    }
    case "HIDE_PENGUIN_AUTHOR_LIST":
      // Hide the Penguin author list and clear it
      return { ...state, penguinAuthors: [], authorFormState: "default" };
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
