import { useState } from "react";
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import RedditIcon from '@mui/icons-material/Reddit';
import PinterestIcon from '@mui/icons-material/Pinterest';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
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

  const socialNetworks = [
    { name: 'Facebook', Icon: FacebookIcon },
    { name: 'Twitter', Icon: TwitterIcon },
    { name: 'Instagram', Icon: InstagramIcon },
    { name: 'LinkedIn', Icon: LinkedInIcon },
    { name: 'YouTube', Icon: YouTubeIcon },
    { name: 'Reddit', Icon: RedditIcon },
    { name: 'Pinterest', Icon: PinterestIcon },
    { name: 'GitHub', Icon: GitHubIcon },
    { name: 'Google', Icon: GoogleIcon },
  ];

  const handleIconClick = (networkName: string) => {
    setForm((prev) => ({ ...prev, Name: networkName }));
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
