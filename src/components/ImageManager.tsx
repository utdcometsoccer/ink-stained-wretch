import { useEffect, useReducer } from "react";
import { imageManagerReducer } from '../reducers/imageManagerReducer';
import { getImageApiErrorMessage } from "../services/imageApiErrors";
import type { ManagedImage } from "../types/ManagedImage";
import "./ImageManager.css";
import type { ImageManagerProps } from "./ImageManagerProps";

export const ImageManager = ({ token, onSelect, listUserImages, deleteImage }: ImageManagerProps) => {
  const [state, dispatch] = useReducer(imageManagerReducer, {
    images: [],
    loading: false,
    error: null,
  });

  const fetchImages = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      const imgs = await listUserImages(token);
      dispatch({ type: 'SET_IMAGES', payload: imgs });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: getImageApiErrorMessage(err) });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleDelete = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      await deleteImage(id, token);
      dispatch({ type: 'DELETE_IMAGE', payload: id });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: getImageApiErrorMessage(err) });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <div>
      <h2>Your Uploaded Images</h2>
      {state.loading && <div>Loading...</div>}
      {state.error && <div className="image-manager-error">{state.error}</div>}
      <ul className="image-manager-list">
        {state.images.map((img: ManagedImage) => (
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
