import type { FC } from "react";
import type { SocialFormProps } from "./SocialFormProps";
import "./SocialForm.css";
import { useSocialForm } from '../../hooks/useSocialForm';

export const SocialForm: FC<SocialFormProps> = (props) => {
  const {
    text,
    form,
    handleChange,
    handleSubmit,
    socialNetworks,
    handleIconClick,
    onCancel,
  } = useSocialForm(props);

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="social-form-fieldset">
        <legend className="social-form-legend">{text.legend}</legend>
        <input name="id" value={form.id} readOnly hidden />
        <div className="social-form-row">
          <label className="social-form-label">
            {text.name}
            <input name="Name" value={form.Name} onChange={handleChange} className="social-form-input" />
          </label>
          <div className="social-icons-row">
            {socialNetworks.map(({ name, Icon }) => (
              <button
                type="button"
                key={name}
                className="social-icon-btn"
                title={name}
                onClick={() => handleIconClick(name)}
              >
                <Icon fontSize="medium" />
              </button>
            ))}
          </div>
        </div>
        <div className="social-form-row">
          <label className="social-form-label">
            {text.url}
            <input name="URL" value={form.URL} onChange={handleChange} className="social-form-input" />
          </label>
        </div>
        <div className="social-form-actions">
          <button type="submit" className="social-form-btn app-btn">{text.save}</button>
          <button type="button" className="social-form-btn app-btn cancel" onClick={onCancel}>{text.cancel}</button>
        </div>
      </fieldset>
    </form>
  );
};
