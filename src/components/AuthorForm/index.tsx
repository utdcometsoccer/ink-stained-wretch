import CircularProgress from "@mui/material/CircularProgress";
import type { FC } from "react";
import { useAuthorFormLogic } from '../../hooks/useAuthorForm';
import { ArticleForm } from "../AuthorRegistration/ArticleForm";
import "./AuthorForm.css";
import type { AuthorFormProps } from "./AuthorFormProps";
import { AuthorMainForm } from "../AuthorMainForm";
import { useTrackComponent } from "../../hooks/useTrackComponent";
import { BookForm } from "../BookForm";
import { SocialForm } from "../SocialForm";
import { OpenLibraryAuthorImport } from "../OpenLibraryAuthorImport";
import { OpenLibraryAuthorForm } from "../OpenLibraryAuthorForm";
import { PenguinRandomHouseAuthorImport } from "../PenguinRandomHouseAuthorImport";


export const AuthorForm: FC<AuthorFormProps> = ({ appState, author, domain, onSave, onCancel }) => {
  useTrackComponent('AuthorForm', { appState, author, domain });
  // Use custom hook for all logic and handlers
  const {
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
    importAuthorFromPenguinRandomHouse,
    handleCancelClick,
    listUserImages,
    deleteImage,
    handleSaveArticle,
    handleSaveBook,
    handleSaveSocial,
    handleCancelChild,
  } = useAuthorFormLogic(appState, author, domain ?? null, onSave, onCancel);
  
  // Main render logic (move to end of function)
  switch (form.authorFormState) {
    case "Loading":
      return <CircularProgress />;
    case "AuthorDocForm":
      return form.selectedAuthorDoc ? (
        <OpenLibraryAuthorForm
          initialAuthorDoc={form.selectedAuthorDoc}
          onSave={() => {
            dispatchForm({ type: "SAVE_SELECTED_AUTHOR_DOC" });
            dispatchForm({ type: "HIDE_AUTHOR_DOC_FORM" });
          }}
          onCancel={() => dispatchForm({ type: "HIDE_AUTHOR_DOC_FORM" })}
        />
      ) : <AuthorMainForm
        form={form}
        dispatchForm={dispatchForm}
        token={token}
        cultureInfo={cultureInfo}
        handleChange={handleChange}
        handleLanguageChange={handleLanguageChange}
        handleCountryChange={handleCountryChange}
        handleSubmit={handleSubmit}
        handleEditArticle={handleEditArticle}
        handleAddArticle={handleAddArticle}
        handleDeleteArticle={handleDeleteArticle}
        handleEditBook={handleEditBook}
        handleAddBook={handleAddBook}
        handleDeleteBook={handleDeleteBook}
        handleEditSocial={handleEditSocial}
        handleAddSocial={handleAddSocial}
        handleDeleteSocial={handleDeleteSocial}
        importBook={importBook}
        importAuthorFromOpenLibrary={importAuthorFromOpenLibrary}
        importAuthorFromPenguinRandomHouse={importAuthorFromPenguinRandomHouse}
        handleCancelClick={handleCancelClick}
        listUserImages={listUserImages}
        deleteImage={deleteImage}
      />;
    case "AuthorDocList":
      return (
        <OpenLibraryAuthorImport
          authors={form.authorDocs}
          importedKeys={form.OpenLibraryAuthorKeys || []}
          onAuthorClick={authorDoc => {
            dispatchForm({ type: "SELECT_AUTHOR_DOC", payload: authorDoc });
            dispatchForm({ type: "SHOW_AUTHOR_DOC_FORM" });
          }}
          onImport={authorDoc => {
            dispatchForm({ type: "IMPORT_AUTHOR_DOC_KEYS", payload: [authorDoc] });
          }}
          onGoBack={() => {
            dispatchForm({ type: "SET_AUTHOR_DOCS", payload: [] });
            dispatchForm({ type: "SET_EDIT_TYPE", payload: null });
            dispatchForm({ type: "SET_EDIT_INDEX", payload: null });
            dispatchForm({ type: "SET_SHOW_IMAGE_MANAGER", payload: false });
            dispatchForm({ type: "HIDE_AUTHOR_DOC_LIST" });
          }}
        />
      );
      case "PenguinAuthorForm":
      return (
        <PenguinRandomHouseAuthorImport
          query={form.AuthorName}
          importedKeys={form.PenguinAuthorID || []}
          culture={cultureInfo?.Culture || 'en-us'}
          onAuthorClick={author => {
            dispatchForm({ type: "SELECT_PENGUIN_AUTHOR", payload: author });
            dispatchForm({ type: "SET_AUTHOR_FORM_STATE", payload: "PenguinAuthorForm" });
          }}
          onImport={author => {
            dispatchForm({ type: "IMPORT_PENGUIN_AUTHOR_ID", payload: [author.key] });
          }}
          onGoBack={() => {
            dispatchForm({ type: "SET_PENGUIN_AUTHORS", payload: [] });
            dispatchForm({ type: "SET_EDIT_TYPE", payload: null });
            dispatchForm({ type: "SET_EDIT_INDEX", payload: null });
            dispatchForm({ type: "SET_SHOW_IMAGE_MANAGER", payload: false });
            dispatchForm({ type: "HIDE_PENGUIN_AUTHOR_LIST" });
          }}
        />
      );
    case "ArticleForm":
      if (form.editIndex !== null) {
        return <ArticleForm article={form.Articles[form.editIndex]} onSave={handleSaveArticle} onCancel={handleCancelChild} />;
      }
      break;
    case "BookForm":
      if (form.editIndex !== null) {
        return <BookForm token={token} book={form.Books[form.editIndex]} onSave={handleSaveBook} onCancel={handleCancelChild} />;
      }
      break;
    case "SocialForm":
      if (form.editIndex !== null) {
        return <SocialForm social={form.Socials[form.editIndex]} onSave={handleSaveSocial} onCancel={handleCancelChild} />;
      }
      break;
    default:
      return (
        <AuthorMainForm
          form={form}
          dispatchForm={dispatchForm}
          token={token}
          cultureInfo={cultureInfo}
          handleChange={handleChange}
          handleLanguageChange={handleLanguageChange}
          handleCountryChange={handleCountryChange}
          handleSubmit={handleSubmit}
          handleEditArticle={handleEditArticle}
          handleAddArticle={handleAddArticle}
          handleDeleteArticle={handleDeleteArticle}
          handleEditBook={handleEditBook}
          handleAddBook={handleAddBook}
          handleDeleteBook={handleDeleteBook}
          handleEditSocial={handleEditSocial}
          handleAddSocial={handleAddSocial}
          handleDeleteSocial={handleDeleteSocial}
          importBook={importBook}
          importAuthorFromOpenLibrary={importAuthorFromOpenLibrary}
          importAuthorFromPenguinRandomHouse={importAuthorFromPenguinRandomHouse}
          handleCancelClick={handleCancelClick}
          listUserImages={listUserImages}
          deleteImage={deleteImage}
        />
      );
  }
};