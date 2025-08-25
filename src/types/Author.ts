import type { Language } from "./Language";
import type { Region } from "./Region";

export type Author = {
  id: string;
  topLevelDomain: string;
  secondLevelDomain: string;
  languageName: Language;
  regionName: Region;
  authorName: string;
  welcomeText: string;
  aboutText: string;
  headshotURL: string;
  copyrightText: string;
  emailAddress?: string;
};
