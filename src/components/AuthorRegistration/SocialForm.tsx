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
      <fieldset className="social-form-fieldset">
        <legend className="social-form-legend">Edit Social Link</legend>
        <input name="id" value={form.id} readOnly hidden />
        <div className="social-form-row">
          <label className="social-form-label">
            Name:
            <input name="Name" value={form.Name} onChange={handleChange} className="social-form-input" />
          </label>
        </div>
        <div className="social-form-row">
          <label className="social-form-label">
            URL:
            <input name="URL" value={form.URL} onChange={handleChange} className="social-form-input" />
          </label>
        </div>
        <div className="social-form-actions">
          <button type="submit" className="social-form-btn app-btn">Save</button>
          <button type="button" className="social-form-btn app-btn cancel" onClick={onCancel}>Cancel</button>
        </div>
      </fieldset>
    </form>
  );
}
