
import type { FC } from "react";
import "./SocialList.css";

import type { SocialListProps } from "./SocialListProps";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export const SocialList: FC<SocialListProps> = ({ socials, onEdit, onAdd, onDelete }) => (
  <div>
    <h2 className="social-list-title">Social Links</h2>
    <ul className="social-list-ul">
      {socials.map(social => (
        <li key={social.id} className="social-list-li">
          <span className="social-list-span"><strong>{social.Name}</strong></span>
          <span className="social-list-span">URL: {social.URL}</span>
          <span className="social-list-btn-row">
            <button className="social-list-edit-btn icon-btn" title="Edit" onClick={() => onEdit(social.id)}>
              <EditIcon fontSize="small" />
              <span className="btn-label">Edit</span>
            </button>
            <button className="social-list-delete-btn icon-btn cancel" title="Delete" onClick={() => onDelete(social.id)}>
              <DeleteIcon fontSize="small" />
              <span className="btn-label">Delete</span>
            </button>
          </span>
        </li>
      ))}
    </ul>
    <button className="social-list-add-btn icon-btn" title="Add Social Link" onClick={onAdd}>
      <AddIcon fontSize="small" />
      <span className="btn-label">Add Social Link</span>
    </button>
  </div>
);
