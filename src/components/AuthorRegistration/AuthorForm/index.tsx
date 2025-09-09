import type { FC } from "react";
import { useAuthorFormLogic } from '../../../hooks/useAuthorForm';
import { ArticleForm } from "../ArticleForm";
import { AuthorDocForm } from "../AuthorDocForm";
import AuthorDocList from "../AuthorDocList";
import { BookForm } from "../BookForm";
import { SocialForm } from "../SocialForm";
import { AuthorMainForm } from "./AuthorMainForm";
import "./AuthorForm.css";
import type { AuthorFormProps } from "./AuthorFormProps";
import CircularProgress from "@mui/material/CircularProgress";


export const AuthorForm: FC<AuthorFormProps> = ({ appState, author, domain, onSave, onCancel }) => {
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
        <AuthorDocForm
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
        handleCancelClick={handleCancelClick}
        listUserImages={listUserImages}
        deleteImage={deleteImage}
      />;
    case "AuthorDocList":
      return (
        <AuthorDocList
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
          handleCancelClick={handleCancelClick}
          listUserImages={listUserImages}
          deleteImage={deleteImage}
        />
      );
  }
};