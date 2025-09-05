
import type { FC } from "react";
import "./SocialList.css";

import type { SocialListProps } from "./SocialListProps";

export const SocialList: FC<SocialListProps> = ({ socials, onEdit, onAdd, onDelete }) => (
  <div>
    <h2 className="social-list-title">Social Links</h2>
    <ul className="social-list-ul">
      {socials.map(social => (
        <li key={social.id} className="social-list-li">
          <span className="social-list-span"><strong>{social.Name}</strong></span>
          <span className="social-list-span">URL: {social.URL}</span>
          <button className="social-list-edit-btn app-btn" onClick={() => onEdit(social.id)}>Edit</button>
          <button className="social-list-delete-btn app-btn cancel" onClick={() => onDelete(social.id)}>Delete</button>
        </li>
      ))}
    </ul>
    <button className="social-list-add-btn app-btn" onClick={onAdd}>Add Social Link</button>
  </div>
);
