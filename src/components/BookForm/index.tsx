import { type FC } from "react";
import { useBookForm } from '../../hooks/useBookForm';
import { ImageManager } from "../ImageManager/index";
import "./BookForm.css";
import type { BookFormProps } from "./BookFormProps";

export const BookForm: FC<BookFormProps & { token: string }> = (props) => {
  const {
    text,
    form,
    showImageManager,
    handleChange,
    handleSubmit,
    handleDescriptionChange,
    handleShowImageManager,
    handleHideImageManager,
    handleSelectImage,
    listUserImages,
    deleteImage,
    token: hookToken,
    onCancel: hookOnCancel,
  } = useBookForm(props);

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="book-form-fieldset">
        <legend className="book-form-legend">{text.legend}</legend>
        <input name="id" value={form.id} readOnly hidden />
        <div className="book-form-row">
          <label className="book-form-label">
            {text.title}
            <input name="Title" value={form.Title} onChange={handleChange} className="book-form-input" />
          </label>
        </div>
        <div className="book-form-row">
          <label className="book-form-label">
            {text.description}
            <textarea
              name="Description"
              value={form.Description}
              onChange={handleDescriptionChange}
              className="book-form-textarea"
              rows={5}
            />
          </label>
        </div>
        <div className="book-form-row">
          <label className="book-form-label">
            {text.url}
            <input name="URL" value={form.URL} onChange={handleChange} className="book-form-input" />
          </label>
        </div>
        <div className="book-form-row">
          <label className="book-form-label">
            {text.cover}
            <input name="Cover" value={form.Cover} onChange={handleChange} className="book-form-cover" />
            <button type="button" className="book-form-cover-btn" onClick={handleShowImageManager}>
              {text.chooseImage}
            </button>
            {showImageManager && (
              <div className="book-form-image-manager">
                <ImageManager
                  token={hookToken}
                  onSelect={handleSelectImage}
                  listUserImages={listUserImages}
                  deleteImage={deleteImage}
                />
                <button type="button" className="book-form-image-manager-close" onClick={handleHideImageManager}>{text.close}</button>
              </div>
            )}
          </label>
        </div>
        <div className="book-form-actions">
          <button type="submit" className="book-form-btn app-btn">{text.save}</button>
          <button type="button" className="book-form-btn app-btn cancel" onClick={hookOnCancel}>{text.cancel}</button>
        </div>
      </fieldset>
    </form>
  );
};
