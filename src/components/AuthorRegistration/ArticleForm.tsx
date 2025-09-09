import { useState, useEffect } from "react";
import { trackComponent } from "../../services/trackComponent";
import type { FC, ChangeEvent, FormEvent } from "react";
import type { Article } from "../../types/Article";
import type { ArticleFormProps } from "./ArticleFormProps";
import "./ArticleForm.css";

export const ArticleForm: FC<ArticleFormProps> = ({ article, onSave, onCancel }) => {
  useEffect(() => {
    trackComponent('ArticleForm', { article });
  }, [article]);
  const [form, setForm] = useState<Article>(article);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="article-form-fieldset">
        <legend className="article-form-legend">Edit Article</legend>

        <input name="id" value={form.id} readOnly hidden />
        <div className="article-form-row">
          <label className="article-form-label">
            Title:
            <input name="Title" value={form.Title} onChange={handleChange} className="article-form-input" />
          </label>
        </div>
        <div className="article-form-row">
          <label className="article-form-label">
            Date:
            <input name="Date" value={form.Date} onChange={handleChange} className="article-form-input" />
          </label>
        </div>
        <div className="article-form-row">
          <label className="article-form-label">
            Publication:
            <input name="Publication" value={form.Publication} onChange={handleChange} className="article-form-input" />
          </label>
        </div>
        <div className="article-form-row">
          <label className="article-form-label">
            URL:
            <input name="URL" value={form.URL} onChange={handleChange} className="article-form-input" />
          </label>
        </div>
        <div className="article-form-actions">          
          <button type="submit" className="article-form-btn app-btn">Save</button>
          <button type="button" className="article-form-btn app-btn cancel" onClick={onCancel}>Cancel</button>
        </div>
      </fieldset>
    </form>
  );
}
