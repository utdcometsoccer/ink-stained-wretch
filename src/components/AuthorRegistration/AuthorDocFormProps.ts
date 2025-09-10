import type { AuthorDoc } from "../../types/OpenLibrary";

export interface AuthorDocFormProps {
  initialAuthorDoc: AuthorDoc;
  onSave: (doc: AuthorDoc) => void;
  onCancel: () => void;
  culture?: string;
}
