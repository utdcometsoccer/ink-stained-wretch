import type { AuthorDoc } from "../../types/OpenLibrary";

export interface OpenLibraryAuthorFormProps {
  initialAuthorDoc: AuthorDoc;
  onSave: (doc: AuthorDoc) => void;
  onCancel: () => void;
  culture?: string;
}
