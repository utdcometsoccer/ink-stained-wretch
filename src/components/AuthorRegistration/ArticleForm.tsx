import { useState } from "react";
import type { FC, ChangeEvent, FormEvent } from "react";

import type { Article } from "../../types/Article";
import type { ArticleFormProps } from "./ArticleFormProps";
import "./ArticleForm.css";

export const ArticleForm: FC<ArticleFormProps> = ({ article, onSave, onCancel }) => {
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
      <h2>Edit Article</h2>
      <input name="id" value={form.id} readOnly hidden />
      <label>
        Title:
        <input name="Title" value={form.Title} onChange={handleChange} />
      </label>
      <label>
        Date:
        <input name="Date" value={form.Date} onChange={handleChange} />
      </label>
      <label>
        Publication:
        <input name="Publication" value={form.Publication} onChange={handleChange} />
      </label>
      <label>
        URL:
        <input name="URL" value={form.URL} onChange={handleChange} />
      </label>
  <button type="submit" className="article-form-btn">Save</button>
  <button type="button" className="article-form-btn" onClick={onCancel}>Cancel</button>
    </form>
  );
}
