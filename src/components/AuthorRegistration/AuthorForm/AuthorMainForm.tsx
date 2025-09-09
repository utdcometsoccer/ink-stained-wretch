import {type FC, useEffect } from "react";
import { trackComponent } from "../../../services/trackComponent";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { CountryDropdown, LanguageDropdown, type Language } from "@idahoedokpayi/react-country-state-selector";
import { ImageManager } from "../../ImageManager";
import { ArticleList } from "../ArticleList";
import { BookList } from "../BookList";
import { SocialList } from "../SocialList";
import type { AuthorMainFormProps } from "./AuthorMainFormProps";

export const AuthorMainForm: FC<AuthorMainFormProps> = ({
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
}) => {
  useEffect(() => {
    trackComponent('AuthorMainForm', {});
  }, []);
  return (
  <form onSubmit={handleSubmit}>
    <fieldset className="author-form-fieldset">
      <legend>Author Information</legend>
      <input name="id" value={form.id} readOnly hidden />
      <label>
        Author Name:
        <input name="AuthorName" value={form.AuthorName} onChange={handleChange} />
      </label>
      <LanguageDropdown
        culture={cultureInfo}
        classNameSelect="input-fullwidth"
        Label="Language: "
        selectedLanguage={form.LanguageName as Language}
        onLanguageChange={handleLanguageChange}
      />
      <CountryDropdown
        culture={cultureInfo}
        classNameSelect="input-fullwidth"
        selectedCountry={form.RegionName}
        Label="Country: "
        onCountryChange={handleCountryChange}
      />
      <label>
        Email:
        <input name="EmailAddress" value={form.EmailAddress} onChange={handleChange} />
      </label>
      <label>
        Welcome Text:
        <textarea name="WelcomeText" value={form.WelcomeText} onChange={handleChange} />
      </label>
      <label>
        About Text:
        <textarea name="AboutText" value={form.AboutText} onChange={handleChange} />
      </label>
      <label>
        Headshot URL:
        <div className="author-form-headshot-row">
          <input name="HeadShotURL" value={form.HeadShotURL} onChange={handleChange} className="input-two-thirds-width" />
          <button type="button" className="author-form-headshot-btn" onClick={() => dispatchForm({ type: "SET_SHOW_IMAGE_MANAGER", payload: true })}>
            Choose Image
          </button>
          {form.HeadShotURL && (
            <span className="author-form-headshot-thumb-wrapper">
              <img
                src={form.HeadShotURL}
                alt="Headshot thumbnail"
                className="author-form-headshot-thumb"
              />
              <span className="author-form-headshot-preview">
                <img
                  src={form.HeadShotURL}
                  alt="Headshot preview"
                  className="author-form-headshot-large"
                />
              </span>
            </span>
          )}
        </div>
        {form.showImageManager && (
          <div className="author-form-image-manager">
            <ImageManager
              token={token}
              onSelect={img => {
                dispatchForm({ type: "UPDATE_FIELD", payload: { name: "HeadShotURL", value: img.url } });
                dispatchForm({ type: "SET_SHOW_IMAGE_MANAGER", payload: false });
              }}
              listUserImages={listUserImages}
              deleteImage={deleteImage}
            />
            <button type="button" className="author-form-image-manager-close" onClick={() => dispatchForm({ type: "SET_SHOW_IMAGE_MANAGER", payload: false })}>Close</button>
          </div>
        )}
      </label>
      <label>
        Copyright Text:
        <input name="CopyrightText" value={form.CopyrightText} onChange={handleChange} />
      </label>
      <label>
        Top Level Domain:
        <input name="TopLevelDomain" value={form.TopLevelDomain} readOnly />
      </label>
      <label>
        Second Level Domain:
        <input name="SecondLevelDomain" value={form.SecondLevelDomain} readOnly />
      </label>
      <h3>Articles</h3>
      <ArticleList articles={form.Articles} onEdit={handleEditArticle} onAdd={handleAddArticle} onDelete={handleDeleteArticle} />
      <h3>Books</h3>
      <BookList
        books={form.Books}
        onEdit={handleEditBook}
        onAdd={handleAddBook}
        onDelete={handleDeleteBook}
        authorName={form.AuthorName}
        importBook={importBook}
        openLibraryAuthorKeys={form.OpenLibraryAuthorKeys}
      />
      <h3>Social Links</h3>
      <SocialList socials={form.Socials} onEdit={handleEditSocial} onAdd={handleAddSocial} onDelete={handleDeleteSocial} />
      <div className="author-form-btn-row">
        <button type="button" className={`article-form-btn app-btn`} onClick={importAuthorFromOpenLibrary}>
          <AccountBalanceIcon fontSize="large" />
          Import Author From Open Library
        </button>
        <button type="submit" className="app-btn">Save Author</button>
        <button type="button" className="app-btn cancel" onClick={handleCancelClick}>Cancel</button>
      </div>
    </fieldset>
  </form>
  );
}
