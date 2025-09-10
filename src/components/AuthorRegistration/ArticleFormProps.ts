import type { Article } from "../../types/Article";

export interface ArticleFormProps {
  article: Article;
  onSave: (article: Article) => void;
  onCancel: () => void;
  culture?: string;
}
