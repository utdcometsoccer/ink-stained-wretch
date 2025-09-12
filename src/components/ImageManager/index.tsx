import { useImageManager } from '../../hooks/useImageManager';
import { useLocalizationContext } from '../../hooks/useLocalizationContext.ts';
import { useTrackComponent } from '../../hooks/useTrackComponent.ts';
import type { ManagedImage } from '../../types/ManagedImage';
import './ImageManager.css';
import type { ImageManagerProps } from './ImageManagerProps.tsx';

export const ImageManager = ({ token, onSelect, listUserImages, deleteImage, culture = 'en-us' }: ImageManagerProps) => {
  useTrackComponent('ImageManager', { token, onSelect, listUserImages, deleteImage, culture });
  const localized = useLocalizationContext().ImageManager;
  const { state, fetchImages, handleDelete } = useImageManager({ token, listUserImages, deleteImage });
  
  return (
    <div>
      <h2>{localized?.title}</h2>
      {state.loading && <div>{localized.loading}</div>}
      {state.error && <div className="image-manager-error">{state.error}</div>}
      <ul className="image-manager-list">
        {state.images.map((img: ManagedImage) => (
          <li key={img.id} className="image-manager-item">
            <img src={img.url} alt={img.name} className="image-manager-img" />
            <span className="image-manager-name">{img.name} ({(img.size / 1024).toFixed(1)} KB)</span>
            <button className="image-manager-select-btn" onClick={() => onSelect(img)}>{localized.select}</button>
            <button className="image-manager-delete-btn" onClick={() => handleDelete(img.id)}>{localized.delete}</button>
          </li>
        ))}
      </ul>
      <button className="image-manager-refresh-btn" onClick={fetchImages}>{localized.refresh}</button>
    </div>
  );
}
