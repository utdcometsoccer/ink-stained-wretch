import type { Author } from "../types/Author";

export interface AuthorFormUIState {
  editType: "article" | "book" | "social" | null;
  editIndex: number | null;
  showImageManager: boolean;
}

export type AuthorFormState = Author & AuthorFormUIState;

export const initialAuthorFormState: AuthorFormState = {
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
  showImageManager: false
};

import type { Domain } from "../types/Domain";

export type AuthorFormAction =
  | { type: "UPDATE_FIELD"; payload: { name: string; value: any } }
  | { type: "ADD_ARTICLE"; payload: any }
  | { type: "ADD_BOOK"; payload: any }
  | { type: "ADD_SOCIAL"; payload: any }
  | { type: "SET_DOMAIN"; payload: Domain }
  | { type: "SET_EDIT_TYPE"; payload: "article" | "book" | "social" | null }
  | { type: "SET_EDIT_INDEX"; payload: number | null }
  | { type: "SET_SHOW_IMAGE_MANAGER"; payload: boolean };

export function authorFormReducer(state: AuthorFormState, action: AuthorFormAction): AuthorFormState {
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
    default:
      return state;
  }
}
