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

export type AuthorFormAction =
  | { type: "UPDATE_FIELD"; payload: { name: string; value: any } }
  | { type: "ADD_ARTICLE"; payload: any }
  | { type: "ADD_BOOK"; payload: any }
  | { type: "ADD_SOCIAL"; payload: any };

export function authorFormReducer(state: Author, action: AuthorFormAction): Author {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.payload.name]: action.payload.value };
    case "ADD_ARTICLE":
      return { ...state, Articles: [...state.Articles, action.payload] };
    case "ADD_BOOK":
      return { ...state, Books: [...state.Books, action.payload] };
    case "ADD_SOCIAL":
      return { ...state, Socials: [...state.Socials, action.payload] };
    default:
      return state;
  }
}
