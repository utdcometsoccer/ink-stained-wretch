import type { Author } from "../types/Author";

export const initialAuthorFormState: Author = {
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
  Socials: []
};

import type { Domain } from "../types/Domain";

export type AuthorFormAction =
  | { type: "UPDATE_FIELD"; payload: { name: string; value: any } }
  | { type: "ADD_ARTICLE"; payload: any }
  | { type: "ADD_BOOK"; payload: any }
  | { type: "ADD_SOCIAL"; payload: any }
  | { type: "SET_DOMAIN"; payload: Domain };

export function authorFormReducer(state: Author, action: AuthorFormAction): Author {
  switch (action.type) {
    case "UPDATE_FIELD":
      // Prevent TopLevelDomain and SecondLevelDomain from being updated via field
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
      // Parse domain if necessary
      return {
        ...state,
        TopLevelDomain: action.payload.topLevelDomain || "",
        SecondLevelDomain: action.payload.secondLevelDomain || ""
      };
    default:
      return state;
  }
}
