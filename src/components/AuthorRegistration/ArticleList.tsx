import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import type { FC } from "react";
import { useGetLocalizedText } from '../../hooks/useGetLocalizedText';
import { useTrackComponent } from '../../hooks/useTrackComponent';
import "./ArticleList.css";
import type { ArticleListProps } from "./ArticleListProps";

export const ArticleList: FC<ArticleListProps> = ({ articles, onEdit, onAdd, onDelete, culture }) => {
  useTrackComponent('ArticleList', { articles, onEdit, onAdd, onDelete, culture });
  const text = useGetLocalizedText(culture ?? 'en-us')?.ArticleList || {
    title: 'Articles',
    date: 'Date:',
    publication: 'Publication:',
    url: 'URL:',
    edit: 'Edit',
    delete: 'Delete',
    addArticle: 'Add Article'
  };
  return (
    <div>
      <h2 className="article-list-title">{text?.title}</h2>
      <ul className="article-list-ul">
        {articles.map(article => (
          <li key={article.id} className="article-list-li">
            <span className="article-list-span"><strong>{article.Title}</strong></span>
            <span className="article-list-span">{text?.date} {article.Date}</span>
            <span className="article-list-span">{text?.publication} {article.Publication}</span>
            <span className="article-list-span">{text?.url} {article.URL}</span>
            <span className="article-list-btn-row">
              <button className="article-list-edit-btn icon-btn" title={text?.edit} onClick={() => onEdit(article.id)}>
                <EditIcon fontSize="small" />
                <span className="btn-label">{text?.edit}</span>
              </button>
              <button className="article-list-delete-btn icon-btn cancel" title={text?.delete} onClick={() => onDelete(article.id)}>
                <DeleteIcon fontSize="small" />
                <span className="btn-label">{text?.delete}</span>
              </button>
            </span>
          </li>
        ))}
      </ul>
      <button className="article-list-add-btn icon-btn" title={text?.addArticle} onClick={onAdd}>
        <AddIcon fontSize="small" />
        <span className="btn-label">{text?.addArticle}</span>
      </button>
    </div>
  );
}
