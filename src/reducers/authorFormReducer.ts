import type { Author } from "../types/Author";

export interface AuthorFormUIState extends Author {
  editType: "article" | "book" | "social" | null;
  editIndex: number | null;
  showImageManager: boolean;
  authorDocs: AuthorDoc[];
  showAuthorDocList: boolean;
  showAuthorDocForm: boolean;
  selectedAuthorDoc: AuthorDoc | null;
}



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
  showAuthorDocList: false,
  showAuthorDocForm: false,
  selectedAuthorDoc: null
};

import type { Domain } from "../types/Domain";
import type { AuthorDoc } from "../types/OpenLibrary";

export type AuthorFormAction =
  | { type: "UPDATE_FIELD"; payload: { name: string; value: any } }
  | { type: "ADD_ARTICLE"; payload: any }
  | { type: "ADD_BOOK"; payload: any }
  | { type: "ADD_SOCIAL"; payload: any }
  | { type: "SET_DOMAIN"; payload: Domain }
  | { type: "SET_EDIT_TYPE"; payload: "article" | "book" | "social" | null }
  | { type: "SET_EDIT_INDEX"; payload: number | null }
  | { type: "SET_SHOW_IMAGE_MANAGER"; payload: boolean }
  | { type: "SET_AUTHOR_DOCS"; payload: AuthorDoc[] }
  | { type: "SHOW_AUTHOR_DOC_LIST" }
  | { type: "HIDE_AUTHOR_DOC_LIST" }
  | { type: "SELECT_AUTHOR_DOC"; payload: AuthorDoc }
  | { type: "SHOW_AUTHOR_DOC_FORM" }
  | { type: "HIDE_AUTHOR_DOC_FORM" }
  | { type: "IMPORT_AUTHOR_DOC_KEYS"; payload: AuthorDoc[] }
  | { type: "SAVE_SELECTED_AUTHOR_DOC" };

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
      return { ...state, showAuthorDocList: true, showAuthorDocForm: false };
    case "HIDE_AUTHOR_DOC_LIST":
      return { ...state, authorDocs: [], showAuthorDocList: false };
    case "SELECT_AUTHOR_DOC":
      return { ...state, selectedAuthorDoc: action.payload };
    case "SHOW_AUTHOR_DOC_FORM":
      return { ...state, showAuthorDocForm: true };
    case "HIDE_AUTHOR_DOC_FORM":
      return { ...state, showAuthorDocForm: false };
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
    default:
      return state;
  }
}
