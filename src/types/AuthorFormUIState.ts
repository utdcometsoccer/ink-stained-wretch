import type { Author } from "./Author";
import type { AuthorFormButtonState } from "./AuthorFormButtonState";
import type { AuthorForms } from "./AuthorForms";
import type { AuthorDoc } from "./OpenLibrary";


export interface AuthorFormUIState extends Author {
  editType: "article" | "book" | "social" | null;
  editIndex: number | null;
  showImageManager: boolean;
  authorDocs: AuthorDoc[];
  selectedAuthorDoc: AuthorDoc | null;
  buttonState?: AuthorFormButtonState;
  authorFormState: AuthorForms;
}
