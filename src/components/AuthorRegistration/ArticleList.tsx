
import type { FC } from "react";
import "./ArticleList.css";

import type { ArticleListProps } from "./ArticleListProps";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export const ArticleList: FC<ArticleListProps> = ({ articles, onEdit, onAdd, onDelete }) => (
  <div>
    <h2 className="article-list-title">Articles</h2>
    <ul className="article-list-ul">
      {articles.map(article => (
        <li key={article.id} className="article-list-li">
          <span className="article-list-span"><strong>{article.Title}</strong></span>
          <span className="article-list-span">Date: {article.Date}</span>
          <span className="article-list-span">Publication: {article.Publication}</span>
          <span className="article-list-span">URL: {article.URL}</span>
          <span className="article-list-btn-row">
            <button className="article-list-edit-btn icon-btn" title="Edit" onClick={() => onEdit(article.id)}>
              <EditIcon fontSize="small" />
              <span className="btn-label">Edit</span>
            </button>
            <button className="article-list-delete-btn icon-btn cancel" title="Delete" onClick={() => onDelete(article.id)}>
              <DeleteIcon fontSize="small" />
              <span className="btn-label">Delete</span>
            </button>
          </span>
        </li>
      ))}
    </ul>
    <button className="article-list-add-btn icon-btn" title="Add Article" onClick={onAdd}>
      <AddIcon fontSize="small" />
      <span className="btn-label">Add Article</span>
    </button>
  </div>
);
