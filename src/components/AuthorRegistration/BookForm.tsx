import { useState } from "react";
import type { FC, ChangeEvent, FormEvent } from "react";

import type { Book } from "../../types/Book";

import type { BookFormProps } from "./BookFormProps";
import "./BookForm.css";
import { ImageManager } from "../ImageManager";

export const BookForm: FC<BookFormProps & { token: string }> = ({ book, token, onSave, onCancel }) => {
  const [form, setForm] = useState<Book>(book);
  const [showImageManager, setShowImageManager] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="id" value={form.id} readOnly hidden />
      <label>
        Title:
        <input name="Title" value={form.Title} onChange={handleChange} />
      </label>
      <label>
        Description:
        <input name="Description" value={form.Description} onChange={handleChange} />
      </label>
      <label>
        URL:
        <input name="URL" value={form.URL} onChange={handleChange} />
      </label>
      <label>
        Cover:
        <input name="Cover" value={form.Cover} onChange={handleChange} className="book-form-cover" />
        <button type="button" className="book-form-cover-btn" onClick={() => setShowImageManager(true)}>
          Choose Image
        </button>
        {showImageManager && (
          <div className="book-form-image-manager">
            <ImageManager
              token={token}
              onSelect={img => {
                setForm({ ...form, Cover: img.url });
                setShowImageManager(false);
              }}
            />
            <button type="button" className="book-form-image-manager-close" onClick={() => setShowImageManager(false)}>Close</button>
          </div>
        )}
      </label>
      <button type="submit" className="book-form-btn">Save</button>
      <button type="button" className="book-form-btn" onClick={onCancel}>Cancel</button>
    </form>
  );
}
