import { useState } from "react";
import type { FC, ChangeEvent, FormEvent } from "react";

import type { Social } from "../../types/Social";
import type { SocialFormProps } from "./SocialFormProps";
import "./SocialForm.css";

export const SocialForm: FC<SocialFormProps> = ({ social, onSave, onCancel }) => {
  const [form, setForm] = useState<Social>(social);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Social Link</h2>
      <input name="id" value={form.id} readOnly hidden />
      <label>
        Name:
        <input name="Name" value={form.Name} onChange={handleChange} />
      </label>
      <label>
        URL:
        <input name="URL" value={form.URL} onChange={handleChange} />
      </label>
  <button type="submit" className="social-form-btn app-btn">Save</button>
  <button type="button" className="social-form-btn app-btn cancel" onClick={onCancel}>Cancel</button>
    </form>
  );
}
