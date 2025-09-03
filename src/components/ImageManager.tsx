import { useEffect, useState } from "react";
import { listUserImages, deleteImage } from "../services/imageApi";
import { getImageApiErrorMessage } from "../services/imageApiErrors";
import "./ImageManager.css";

interface ImageManagerProps {
  token: string;
  onSelect: (image: { id: string; url: string; name: string; size: number; uploadedAt: string }) => void;
}

export const ImageManager = ({ token, onSelect }: ImageManagerProps) => {
  const [images, setImages] = useState<Array<{ id: string; url: string; name: string; size: number; uploadedAt: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const imgs = await listUserImages(token);
      setImages(imgs);
    } catch (err) {
      setError(getImageApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteImage(id, token);
      setImages(images.filter(img => img.id !== id));
    } catch (err) {
      setError(getImageApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Your Uploaded Images</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="image-manager-error">{error}</div>}
      <ul className="image-manager-list">
        {images.map(img => (
          <li key={img.id} className="image-manager-item">
            <img src={img.url} alt={img.name} className="image-manager-img" />
            <span className="image-manager-name">{img.name} ({(img.size / 1024).toFixed(1)} KB)</span>
            <button className="image-manager-select-btn" onClick={() => onSelect(img)}>Select</button>
            <button className="image-manager-delete-btn" onClick={() => handleDelete(img.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button className="image-manager-refresh-btn" onClick={fetchImages}>Refresh</button>
    </div>
  );
}
