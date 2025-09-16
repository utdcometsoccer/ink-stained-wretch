import { useEffect, useReducer } from "react";
import { imageManagerReducer } from '../reducers/imageManagerReducer';
import { getImageApiErrorMessage } from "../services/imageApiErrors";
import type { UseImageManagerProps } from "../types/UseImageManagerProps";

export function useImageManager({ token, listUserImages, deleteImage }: UseImageManagerProps) {
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

  return {
    state,
    fetchImages,
    handleDelete,
    dispatch,
  };
}
