import type { Author } from "./Author";

export type UseAuthorsByDomainResult = {
  authorInformation: Author[] | null;
  error: string | null;
  loading: boolean;
};
