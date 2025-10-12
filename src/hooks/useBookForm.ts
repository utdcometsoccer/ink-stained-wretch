import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { useTrackComponent } from "../hooks/useTrackComponent";
import { deleteImage, listUserImages, uploadImage } from '../services/imageApi';
import { withAuthRetry } from '../services/withAuthRetry';
import type { Book } from "../types/Book";
import type { Action } from "../types/Action";
import type { Dispatch } from "react";
import { useLocalizationContext } from "./useLocalizationContext";

export interface UseBookFormProps {
  book: Book;
  token: string;
  onSave: (book: Book) => void;
  onCancel: () => void;
  culture?: string;
  dispatch?: Dispatch<Action>;
}

export function useBookForm({ book, token, onSave, onCancel, culture, dispatch }: UseBookFormProps) {
  const localization = useLocalizationContext();
  const text = localization.BookForm;
  useTrackComponent('BookForm', { book, token, onSave, onCancel, culture });
  const [form, setForm] = useState<Book>(book);
  const [showImageManager, setShowImageManager] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(form);
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setForm({ ...form, Description: e.target.value });
  };

  const handleShowImageManager = () => setShowImageManager(true);
  const handleHideImageManager = () => setShowImageManager(false);
  const handleSelectImage = (img: { url: string }) => {
    setForm({ ...form, Cover: img.url });
    setShowImageManager(false);
  };

  // Create wrapped image API functions that handle 401 responses
  const updateToken = (newToken: string | null) => {
    if (dispatch) {
      dispatch({ type: 'UPDATE_STATE', payload: { authToken: newToken } });
    }
  };
  
  const wrappedUploadImage = async (file: File, token?: string) => {
    return withAuthRetry(
      (t) => uploadImage(file, t),
      token,
      updateToken
    );
  };
  
  const wrappedListUserImages = async (token?: string) => {
    return withAuthRetry(
      (t) => listUserImages(t),
      token,
      updateToken
    );
  };
  
  const wrappedDeleteImage = async (id: string, token?: string) => {
    return withAuthRetry(
      (t) => deleteImage(id, t),
      token,
      updateToken
    );
  };

  return {
    text,
    form,
    setForm,
    showImageManager,
    setShowImageManager,
    handleChange,
    handleSubmit,
    handleDescriptionChange,
    handleShowImageManager,
    handleHideImageManager,
    handleSelectImage,
    listUserImages: wrappedListUserImages,
    deleteImage: wrappedDeleteImage,
    uploadImage: wrappedUploadImage,
    token,
    onCancel,
  };
}
