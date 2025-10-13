

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import type { FC } from "react";
import { useLocalizationContext } from '../../hooks/useLocalizationContext';
import { useTrackComponent } from "../../hooks/useTrackComponent";
import { getBrowserCultureWithFallback } from '../../services/getBrowserCultureWithFallback';
import "./SocialList.css";
import type { SocialListProps } from "./SocialListProps";

export const SocialList: FC<SocialListProps> = ({ socials, onEdit, onAdd, onDelete, culture = getBrowserCultureWithFallback().Culture }) => {
  useTrackComponent('SocialList', { socials, onEdit, onAdd, onDelete, culture });
  const localized = useLocalizationContext().SocialList;
  return (
    <div>
      <h2 className="social-list-title">{localized.title}</h2>
      <ul className="social-list-ul">
        {socials.map(social => (
          <li key={social.id} className="social-list-li">
            <span className="social-list-span"><strong>{social.Name}</strong></span>
            <span className="social-list-span">{localized.url} {social.URL}</span>
            <span className="social-list-btn-row">
              <button className="social-list-edit-btn icon-btn" title={localized.edit} onClick={() => onEdit(social.id)}>
                <EditIcon fontSize="small" />
                <span className="btn-label">{localized.edit}</span>
              </button>
              <button className="social-list-delete-btn icon-btn cancel" title={localized.delete} onClick={() => onDelete(social.id)}>
                <DeleteIcon fontSize="small" />
                <span className="btn-label">{localized.delete}</span>
              </button>
            </span>
          </li>
        ))}
      </ul>
      <button className="social-list-add-btn icon-btn" title={localized.addSocial} onClick={onAdd}>
        <AddIcon fontSize="small" />
        <span className="btn-label">{localized.addSocial}</span>
      </button>
    </div>
  );
}
