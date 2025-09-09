import type { ChangeEvent, FC, FormEvent } from "react";
import { useState, useEffect } from "react";
import { trackComponent } from "../../services/trackComponent";
import { deleteImage, listUserImages } from '../../services/imageApi';
import type { Book } from "../../types/Book";
import { ImageManager } from "../ImageManager";
import "./BookForm.css";
import type { BookFormProps } from "./BookFormProps";

export const BookForm: FC<BookFormProps & { token: string }> = ({ book, token, onSave, onCancel }) => {
  useEffect(() => {
    trackComponent('BookForm', { book });
  }, [book]);
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
      <fieldset className="book-form-fieldset">
        <legend className="book-form-legend">Book Details</legend>
        <input name="id" value={form.id} readOnly hidden />
        <div className="book-form-row">
          <label className="book-form-label">
            Title:
            <input name="Title" value={form.Title} onChange={handleChange} className="book-form-input" />
          </label>
        </div>
        <div className="book-form-row">
          <label className="book-form-label">
            Description:
            <textarea
              name="Description"
              value={form.Description}
              onChange={e => setForm({ ...form, Description: e.target.value })}
              className="book-form-textarea"
              rows={5}
            />
          </label>
        </div>
        <div className="book-form-row">
          <label className="book-form-label">
            URL:
            <input name="URL" value={form.URL} onChange={handleChange} className="book-form-input" />
          </label>
        </div>
        <div className="book-form-row">
          <label className="book-form-label">
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
                  listUserImages={listUserImages}
                  deleteImage={deleteImage}
                />
                <button type="button" className="book-form-image-manager-close" onClick={() => setShowImageManager(false)}>Close</button>
              </div>
            )}
          </label>
        </div>
        <div className="book-form-actions">
          <button type="submit" className="book-form-btn app-btn">Save</button>
          <button type="button" className="book-form-btn app-btn cancel" onClick={onCancel}>Cancel</button>
        </div>
      </fieldset>
    </form>
  );
}
