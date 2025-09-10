import type { ChangeEvent, FC, FormEvent } from "react";
import { useState } from "react";
import { useGetLocalizedText } from "../../hooks/useGetLocalizedText";
import { useTrackComponent } from "../../hooks/useTrackComponent";
import type { Article } from "../../types/Article";
import "./ArticleForm.css";
import type { ArticleFormProps } from "./ArticleFormProps";

export const ArticleForm: FC<ArticleFormProps> = ({ article, onSave, onCancel, culture = 'en-us' }) => {
  useTrackComponent('ArticleForm', { article, onSave, onCancel, culture});
  const [form, setForm] = useState<Article>(article);
  const localized = useGetLocalizedText(culture)?.ArticleForm;

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
        <legend className="article-form-legend">{localized?.legend ?? 'Edit Article'}</legend>

        <input name="id" value={form.id} readOnly hidden />
        <div className="article-form-row">
          <label className="article-form-label">
            {localized?.title ?? 'Title:'}
            <input name="Title" value={form.Title} onChange={handleChange} className="article-form-input" />
          </label>
        </div>
        <div className="article-form-row">
          <label className="article-form-label">
            {localized?.date ?? 'Date:'}
            <input name="Date" value={form.Date} onChange={handleChange} className="article-form-input" />
          </label>
        </div>
        <div className="article-form-row">
          <label className="article-form-label">
            {localized?.publication ?? 'Publication:'}
            <input name="Publication" value={form.Publication} onChange={handleChange} className="article-form-input" />
          </label>
        </div>
        <div className="article-form-row">
          <label className="article-form-label">
            {localized?.url ?? 'URL:'}
            <input name="URL" value={form.URL} onChange={handleChange} className="article-form-input" />
          </label>
        </div>
        <div className="article-form-actions">
          <button type="submit" className="article-form-btn app-btn">{localized?.save ?? 'Save'}</button>
          <button type="button" className="article-form-btn app-btn cancel" onClick={onCancel}>{localized?.cancel ?? 'Cancel'}</button>
        </div>
      </fieldset>
    </form>
  );
}
