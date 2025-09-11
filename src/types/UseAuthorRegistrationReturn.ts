import type { Author } from "./Author";
import type { AuthorRegistrationProps } from "../components/AuthorRegistration/AuthorRegistrationProps";

export type UseAuthorRegistrationReturn = {
  text: any;
  authorsList: Author[];
  listState: any;
  dispatchList: React.Dispatch<any>;
  handleAddAuthor: () => void;
  handleEditAuthor: (id: string) => void;
  handleDeleteAuthor: (id: string) => void;
  handleSaveAuthor: (author: Author) => void;
  handleCancelAuthor: () => void;
  handleValidateAuthors: () => void;
  state: AuthorRegistrationProps["state"];
  dispatch: AuthorRegistrationProps["dispatch"];
  loading: boolean;
};
