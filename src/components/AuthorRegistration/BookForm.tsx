import { useState } from "react";
import type { FC, ChangeEvent, FormEvent } from "react";

import type { Book } from "../../types/Book";
import type { BookFormProps } from "./BookFormProps";

export const BookForm: FC<BookFormProps> = ({ book, onSave, onCancel }) => {
  const [form, setForm] = useState<Book>(book);

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
        <input name="Cover" value={form.Cover} onChange={handleChange} />
      </label>
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
}
