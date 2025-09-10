import { useImageManager } from '../../hooks/useImageManager';
import type { ManagedImage } from '../../types/ManagedImage';
import './ImageManager.css';
import type { ImageManagerProps } from './ImageManagerProps.tsx';
import { useGetLocalizedText } from '../../hooks/useGetLocalizedText.ts';
import { useTrackComponent } from '../../hooks/useTrackComponent.ts';

export const ImageManager = ({ token, onSelect, listUserImages, deleteImage, culture = 'en-us' }: ImageManagerProps) => {
  useTrackComponent('ImageManager', { token, onSelect, listUserImages, deleteImage, culture });
  const localized = useGetLocalizedText(culture)?.ImageManager;
  const { state, fetchImages, handleDelete } = useImageManager({ token, listUserImages, deleteImage });
  

  return (
    <div>
      <h2>{localized?.title ?? 'Your Uploaded Images'}</h2>
      {state.loading && <div>{localized?.loading ?? 'Loading...'}</div>}
      {state.error && <div className="image-manager-error">{state.error}</div>}
      <ul className="image-manager-list">
        {state.images.map((img: ManagedImage) => (
          <li key={img.id} className="image-manager-item">
            <img src={img.url} alt={img.name} className="image-manager-img" />
            <span className="image-manager-name">{img.name} ({(img.size / 1024).toFixed(1)} KB)</span>
            <button className="image-manager-select-btn" onClick={() => onSelect(img)}>{localized?.select ?? 'Select'}</button>
            <button className="image-manager-delete-btn" onClick={() => handleDelete(img.id)}>{localized?.delete ?? 'Delete'}</button>
          </li>
        ))}
      </ul>
      <button className="image-manager-refresh-btn" onClick={fetchImages}>{localized?.refresh ?? 'Refresh'}</button>
    </div>
  );
}
