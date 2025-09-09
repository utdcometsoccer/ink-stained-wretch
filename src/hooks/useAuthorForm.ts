import { useReducer, useEffect } from "react";
import { authorFormReducer, initialAuthorFormState } from "../reducers/authorFormReducer";
import { cultureFromBrowser, type Language } from "@idahoedokpayi/react-country-state-selector";
import { deleteImage, listUserImages } from '../services/imageApi';
import { fetchOpenLibraryAuthors } from "../services/openLibraryApi";
import type { Article } from "../types/Article";
import type { Book } from "../types/Book";
import type { Social } from "../types/Social";
import { type AuthorFormButtonState } from "../types/AuthorFormButtonState";
import type { AuthorForms } from "../types/AuthorForms";
import type { State } from "../types/State";
import type { Author } from "../types/Author";
import type { Domain } from "../types/Domain";

export function useAuthorFormLogic(
  appState: State,
  author: Author | null,
  domain: Domain | null,
  onSave: (form: any) => void,
  onCancel: () => void
) {
  const defaultAuthorName = `${appState.domainRegistration?.contactInformation?.firstName} ${appState.domainRegistration?.contactInformation?.lastName}`.trim() || '';
  const defaultCopyrightText = appState.domainRegistration?.contactInformation?.firstName ? `© ${new Date().getFullYear()} ${appState.domainRegistration.contactInformation.firstName} ${appState.domainRegistration.contactInformation.lastName}. All rights reserved.` : '';
  const { authToken, cultureInfo, domainRegistration } = appState;
  const token = authToken ?? '';
  const browserCulture = cultureFromBrowser();
  const language = cultureInfo?.Language || browserCulture.Language || "en";
  const country = cultureInfo?.Country || browserCulture.Country || "US";
  const emailAddress = domainRegistration?.contactInformation?.emailAddress || appState.userProfile?.emailAddress || '';
  const initialState = {
    ...(author ?? initialAuthorFormState),
    TopLevelDomain: domain?.topLevelDomain || (author?.TopLevelDomain ?? ""),
    SecondLevelDomain: domain?.secondLevelDomain || (author?.SecondLevelDomain ?? ""),
    editType: null,
    editIndex: null,
    showImageManager: false,
    AuthorName: author?.AuthorName || defaultAuthorName || appState.userProfile?.displayName || '',
    CopyrightText: author?.CopyrightText || defaultCopyrightText || '',
    LanguageName: language,
    RegionName: country,
    EmailAddress: emailAddress,
    authorDocs: [],
    showAuthorDocList: false,
    showAuthorDocForm: false,
    selectedAuthorDoc: null,
    buttonState: "Default" as AuthorFormButtonState,
    authorFormState: "Default" as AuthorForms
  };

  const [form, dispatchForm] = useReducer(authorFormReducer, initialState);
  const buttonState = form.buttonState;

  // Delete handlers
  const handleDeleteArticle = (id: string) => {
    const updated = form.Articles.filter((a: Article) => a.id !== id);
    dispatchForm({ type: "UPDATE_FIELD", payload: { name: "Articles", value: updated } });
  };
  const handleDeleteBook = (id: string) => {
    const updated = form.Books.filter((b: Book) => b.id !== id);
    dispatchForm({ type: "UPDATE_FIELD", payload: { name: "Books", value: updated } });
  };
  const handleDeleteSocial = (id: string) => {
    const updated = form.Socials.filter((s: Social) => s.id !== id);
    dispatchForm({ type: "UPDATE_FIELD", payload: { name: "Socials", value: updated } });
  };

  // Cancel logic
  const cancelArticle = () => {
    if (
      typeof form.editIndex === 'number' &&
      form.editIndex === form.Articles.length - 1 &&
      form.Articles[form.editIndex].Title === "" &&
      form.Articles[form.editIndex].Date === "" &&
      form.Articles[form.editIndex].Publication === "" &&
      form.Articles[form.editIndex].URL === ""
    ) {
      const updated = form.Articles.slice(0, -1);
      dispatchForm({ type: "UPDATE_FIELD", payload: { name: "Articles", value: updated } });
    }
  };
  const cancelBook = () => {
    if (
      typeof form.editIndex === 'number' &&
      form.editIndex === form.Books.length - 1 &&
      form.Books[form.editIndex].Title === "" &&
      form.Books[form.editIndex].Description === "" &&
      form.Books[form.editIndex].URL === "" &&
      form.Books[form.editIndex].Cover === ""
    ) {
      const updated = form.Books.slice(0, -1);
      dispatchForm({ type: "UPDATE_FIELD", payload: { name: "Books", value: updated } });
    }
  };
  const cancelSocial = () => {
    if (
      typeof form.editIndex === 'number' &&
      form.editIndex === form.Socials.length - 1 &&
      form.Socials[form.editIndex].Name === "" &&
      form.Socials[form.editIndex].URL === ""
    ) {
      const updated = form.Socials.slice(0, -1);
      dispatchForm({ type: "UPDATE_FIELD", payload: { name: "Socials", value: updated } });
    }
  };

  // Edit handlers
  const handleEditArticle = (id: string) => {
    const idx = form.Articles.findIndex((a: Article) => a.id === id);
    if (idx !== -1) {
      dispatchForm({ type: "SET_EDIT_TYPE", payload: "article" });
      dispatchForm({ type: "SET_EDIT_INDEX", payload: idx });
    }
    dispatchForm({ type: "SET_AUTHOR_FORM_STATE", payload: "default" });
  };
  const handleEditBook = (id: string) => {
    const idx = form.Books.findIndex((b: Book) => b.id === id);
    if (idx !== -1) {
      dispatchForm({ type: "SET_EDIT_TYPE", payload: "book" });
      dispatchForm({ type: "SET_EDIT_INDEX", payload: idx });
    }
    dispatchForm({ type: "SET_AUTHOR_FORM_STATE", payload: "default" });
  };
  const handleEditSocial = (id: string) => {
    const idx = form.Socials.findIndex((s: Social) => s.id === id);
    if (idx !== -1) {
      dispatchForm({ type: "SET_EDIT_TYPE", payload: "social" });
      dispatchForm({ type: "SET_EDIT_INDEX", payload: idx });      
    }
    dispatchForm({ type: "SET_AUTHOR_FORM_STATE", payload: "default" });
  };

  // Save handlers
  const handleSaveArticle = (article: Article) => {
    if (typeof form.editIndex === 'number') {
      const updated = form.Articles.map((a: Article, i: number) => i === form.editIndex ? article : a);
      dispatchForm({ type: "UPDATE_FIELD", payload: { name: "Articles", value: updated } });
    }
    dispatchForm({ type: "SET_EDIT_TYPE", payload: null });
    dispatchForm({ type: "SET_EDIT_INDEX", payload: null });
    dispatchForm({ type: "SET_AUTHOR_FORM_STATE", payload: "default" });
  };
  const handleSaveBook = (book: Book) => {
    if (typeof form.editIndex === 'number') {
      const updated = form.Books.map((b: Book, i: number) => i === form.editIndex ? book : b);
      dispatchForm({ type: "UPDATE_FIELD", payload: { name: "Books", value: updated } });
    }
    dispatchForm({ type: "SET_EDIT_TYPE", payload: null });
    dispatchForm({ type: "SET_EDIT_INDEX", payload: null });
    dispatchForm({ type: "SET_AUTHOR_FORM_STATE", payload: "default" });
  };
  const handleSaveSocial = (social: Social) => {
    if (typeof form.editIndex === 'number') {
      const updated = form.Socials.map((s: Social, i: number) => i === form.editIndex ? social : s);
      dispatchForm({ type: "UPDATE_FIELD", payload: { name: "Socials", value: updated } });
    }
    dispatchForm({ type: "SET_EDIT_TYPE", payload: null });
    dispatchForm({ type: "SET_EDIT_INDEX", payload: null });
    dispatchForm({ type: "SET_AUTHOR_FORM_STATE", payload: "default" });
  };

  // Add handlers
  const handleAddArticle = () => {
    const newArticle: Article = { id: crypto.randomUUID(), Title: "", Date: "", Publication: "", URL: "" };
    dispatchForm({ type: "UPDATE_FIELD", payload: { name: "Articles", value: [...form.Articles, newArticle] } });
    dispatchForm({ type: "SET_AUTHOR_FORM_STATE", payload: "ArticleForm" });
    dispatchForm({ type: "SET_EDIT_INDEX", payload: form.Articles.length });
  };
  const handleAddBook = () => {
    const newBook: Book = { id: crypto.randomUUID(), Title: "", Description: "", URL: "", Cover: "" };
    dispatchForm({ type: "UPDATE_FIELD", payload: { name: "Books", value: [...form.Books, newBook] } });
    dispatchForm({ type: "SET_AUTHOR_FORM_STATE", payload: "BookForm" });
    dispatchForm({ type: "SET_EDIT_INDEX", payload: form.Books.length });
  };
  const handleAddSocial = () => {
    const newSocial: Social = { id: crypto.randomUUID(), Name: "", URL: "" };
    dispatchForm({ type: "UPDATE_FIELD", payload: { name: "Socials", value: [...form.Socials, newSocial] } });
    dispatchForm({ type: "SET_AUTHOR_FORM_STATE", payload: "SocialForm" });
    dispatchForm({ type: "SET_EDIT_INDEX", payload: form.Socials.length });
  };
  const importBook = (newBook: Book) => {
    dispatchForm({ type: "ADD_BOOK", payload: newBook });
  };

  // Cancel child edit
  const handleCancelChild = () => {
    if (form.editType === "article" && form.editIndex !== null) {
      cancelArticle();
    }
    if (form.editType === "book" && form.editIndex !== null) {
      cancelBook();
    }
    if (form.editType === "social" && form.editIndex !== null) {
      cancelSocial();
    }
    dispatchForm({ type: "SET_EDIT_TYPE", payload: null });
    dispatchForm({ type: "SET_EDIT_INDEX", payload: null });
  };

  // Main form change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatchForm({ type: "UPDATE_FIELD", payload: { name: e.target.name, value: e.target.value } });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatchForm({ type: 'SET_BUTTON_STATE', payload: "Save" });
  };
  const handleCancelClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatchForm({ type: 'SET_BUTTON_STATE', payload: "Cancel" });
  };

  const handleLanguageChange = (val: Language) => dispatchForm({ type: "UPDATE_FIELD", payload: { name: "LanguageName", value: val } });
  const handleCountryChange = (val: string) => dispatchForm({ type: "UPDATE_FIELD", payload: { name: "RegionName", value: val } });

  const importAuthorFromOpenLibrary = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatchForm({ type: 'SET_BUTTON_STATE', payload: "ImportAuthor" });
    dispatchForm({ type: "SET_AUTHOR_FORM_STATE", payload: "Loading" });
  };

  useEffect(() => {
    const openLibraryFetchAuthorInformation = async () => {
      try {
        const searchResult = await fetchOpenLibraryAuthors(form.AuthorName);
        dispatchForm({ type: 'SET_AUTHOR_DOCS', payload: searchResult.docs });
      } catch (error) {
        console.error('Failed to fetch OpenLibrary authors:', error);
      } finally {
        dispatchForm({ type: 'SHOW_AUTHOR_DOC_LIST' });
      }
    };
    switch (buttonState) {
      case "Save":
        onSave(form);
        break;
      case "Cancel":
        handleCancelChild();
        onCancel();
        break;
      case "ImportAuthor":
        openLibraryFetchAuthorInformation();
        dispatchForm({ type: "SET_AUTHOR_FORM_STATE", payload: "default" });
        break;
      default:
        break;
    }
  }, [buttonState]);

  return {
    form,
    dispatchForm,
    token,
    cultureInfo,
    handleChange,
    handleLanguageChange,
    handleCountryChange,
    handleSubmit,
    handleEditArticle,
    handleAddArticle,
    handleDeleteArticle,
    handleEditBook,
    handleAddBook,
    handleDeleteBook,
    handleEditSocial,
    handleAddSocial,
    handleDeleteSocial,
    importBook,
    importAuthorFromOpenLibrary,
    handleCancelClick,
    listUserImages,
    deleteImage,
    handleSaveArticle,
    handleSaveBook,
    handleSaveSocial,
    handleCancelChild,
  };
}
