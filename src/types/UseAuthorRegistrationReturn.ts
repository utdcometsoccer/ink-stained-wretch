import type { Author } from "./Author";
import type { AuthorRegistrationProps } from "../components/AuthorRegistration/AuthorRegistrationProps";
import type { AuthorListAction, AuthorListState } from "../reducers/authorListReducer";
import type { AuthorRegistrationText } from "./LocalizedText";

export type UseAuthorRegistrationReturn = {
  text: AuthorRegistrationText;
  authorsList: Author[];
  listState: AuthorListState;
  dispatchList: React.Dispatch<AuthorListAction>;
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
