import type { AuthorResult } from '../../types/PenguinRandomHouse';


export interface PenguinRandomHouseAuthorDetailProps {
  author: AuthorResult;
  onSave: (author: AuthorResult) => void;
  onCancel: () => void;
}
