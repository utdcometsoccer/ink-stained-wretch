import type { Article } from "../../types/Article";

export interface ArticleListProps {
  articles: Article[];
  onEdit: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  culture?: string;
}
