
import type { FC } from "react";
import "./ArticleList.css";

import type { ArticleListProps } from "./ArticleListProps";

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
          <button className="article-list-edit-btn app-btn" onClick={() => onEdit(article.id)}>Edit</button>
          <button className="article-list-delete-btn app-btn cancel" onClick={() => onDelete(article.id)}>Delete</button>
        </li>
      ))}
    </ul>
    <button className="article-list-add-btn app-btn" onClick={onAdd}>Add Article</button>
  </div>
);
