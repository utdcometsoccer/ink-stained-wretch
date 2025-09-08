import { type FC, useState } from "react";
import "./AuthorDocForm.css";
import type { AuthorDoc } from "../../types/OpenLibrary";
import type { AuthorDocFormProps } from "./AuthorDocFormProps";

export const AuthorDocForm: FC<AuthorDocFormProps> = ({ initialAuthorDoc, onSave, onCancel }) => {
  const [form, setForm] = useState<AuthorDoc>(initialAuthorDoc);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }}>
      <fieldset className="author-doc-form-fieldset">
        <legend className="author-doc-form-legend">Edit AuthorDoc</legend>
  <label className="author-doc-form-label">
          Key:
          <input className="author-doc-form-input" name="key" value={form.key} onChange={handleChange} />
        </label>
  <label className="author-doc-form-label">
          Text:
          <textarea className="author-doc-form-textarea" name="text" value={form.text? form.text.join("\n"): form.text} onChange={e => setForm(prev => ({ ...prev, text: e.target.value.split("\n") }))} />
        </label>
  <label className="author-doc-form-label">
          Type:
          <input className="author-doc-form-input" name="type" value={form.type} onChange={handleChange} />
        </label>
  <label className="author-doc-form-label">
          Name:
          <input className="author-doc-form-input" name="name" value={form.name} onChange={handleChange} />
        </label>
  <label className="author-doc-form-label">
          Alternate Names:
          <textarea className="author-doc-form-textarea" name="alternate_names" value={form.alternate_names ? form.alternate_names.join("\n"): form.alternate_names} onChange={e => setForm(prev => ({ ...prev, alternate_names: e.target.value.split("\n") }))} />
        </label>
  <label className="author-doc-form-label">
          Birth Date:
          <input className="author-doc-form-input" name="birth_date" value={form.birth_date} onChange={handleChange} />
        </label>
  <label className="author-doc-form-label">
          Top Work:
          <input className="author-doc-form-input" name="top_work" value={form.top_work} onChange={handleChange} />
        </label>
  <label className="author-doc-form-label">
          Work Count:
          <input className="author-doc-form-input" name="work_count" type="number" value={form.work_count} onChange={e => setForm(prev => ({ ...prev, work_count: Number(e.target.value) }))} />
        </label>
  <label className="author-doc-form-label">
          Top Subjects:
          <textarea className="author-doc-form-textarea" name="top_subjects" value={form.top_subjects ? form.top_subjects.join("\n") : form.top_subjects} onChange={e => setForm(prev => ({ ...prev, top_subjects: e.target.value.split("\n") }))} />
        </label>
  <label className="author-doc-form-label">
          Version:
          <input className="author-doc-form-input" name="_version_" type="number" value={form._version_} onChange={e => setForm(prev => ({ ...prev, _version_: Number(e.target.value) }))} />
        </label>
        <div className="author-doc-form-actions">
          <button className="author-doc-form-save-btn" type="submit">Save</button>
          <button className="author-doc-form-cancel-btn" type="button" onClick={onCancel}>Cancel</button>
        </div>
      </fieldset>
    </form>
  );
};
