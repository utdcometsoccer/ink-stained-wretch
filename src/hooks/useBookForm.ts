import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { useTrackComponent } from "../hooks/useTrackComponent";
import { deleteImage, listUserImages, uploadImage } from '../services/imageApi';
import type { Book } from "../types/Book";
import { useLocalizationContext } from "./useLocalizationContext";

export interface UseBookFormProps {
  book: Book;
  token: string;
  onSave: (book: Book) => void;
  onCancel: () => void;
  culture?: string;
}

export function useBookForm({ book, token, onSave, onCancel, culture }: UseBookFormProps) {
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
    listUserImages,
    deleteImage,
    uploadImage,
    token,
    onCancel,
  };
}
