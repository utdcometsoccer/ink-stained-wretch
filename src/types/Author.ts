import type { Article } from "./Article";
import type { Book } from "./Book";
import type { Social } from "./Social";

export interface Author {
  id: string;
  TopLevelDomain: string;
  SecondLevelDomain: string;
  LanguageName: string;
  RegionName: string;
  AuthorName: string;
  WelcomeText: string;
  AboutText: string;
  HeadShotURL: string;
  CopyrightText: string;
  EmailAddress: string;
  Articles: Article[];
  Books: Book[];
  Socials: Social[];
  OpenLibraryAuthorKeys?: string[];
  PenguinAuthorID?: string[];
}
