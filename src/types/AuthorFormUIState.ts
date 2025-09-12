import type { Author } from "./Author";
import type { AuthorFormButtonState } from "./AuthorFormButtonState";
import type { AuthorForms } from "./AuthorForms";
import type { AuthorDoc } from "./OpenLibrary";
import type { AuthorResult } from "./PenguinRandomHouseSearchResult";


export interface AuthorFormUIState extends Author {
  editType: "article" | "book" | "social" | null;
  editIndex: number | null;
  showImageManager: boolean;
  authorDocs: AuthorDoc[];
  selectedAuthorDoc: AuthorDoc | null;
  selectedPenguinAuthor?: AuthorResult | null;
  buttonState?: AuthorFormButtonState;
  authorFormState: AuthorForms;
  penguinAuthors: AuthorResult[];
}
