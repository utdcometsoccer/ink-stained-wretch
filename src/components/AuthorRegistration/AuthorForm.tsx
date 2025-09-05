import { CountryDropdown, cultureFromBrowser, LanguageDropdown, type Language } from "@idahoedokpayi/react-country-state-selector";
import type { FC } from "react";
import { useReducer } from "react";
import { authorFormReducer, initialAuthorFormState } from "../../reducers/authorFormReducer";
import type { Article } from "../../types/Article";
import type { Book } from "../../types/Book";
import type { Social } from "../../types/Social";
import { ImageManager } from "../ImageManager";

import { ArticleForm } from "./ArticleForm";
import { ArticleList } from "./ArticleList";
import "./AuthorForm.css";
import type { AuthorFormProps } from "./AuthorFormProps";
import { BookForm } from "./BookForm";
import { BookList } from "./BookList";
import { SocialForm } from "./SocialForm";
import { SocialList } from "./SocialList";


export const AuthorForm: FC<AuthorFormProps> = ({ appState, author, domain, onSave, onCancel }) => {
  const defaultAuthorName = `${appState.domainRegistration?.contactInformation?.firstName} ${appState.domainRegistration?.contactInformation?.lastName}`.trim() || '';
  const defaultCopyrightText = appState.domainRegistration?.contactInformation?.firstName ? `© ${new Date().getFullYear()} ${appState.domainRegistration.contactInformation.firstName} ${appState.domainRegistration.contactInformation.lastName}. All rights reserved.` : '';
  // If domain is provided, update TopLevelDomain and SecondLevelDomain in initial state
  const initialState = {
    ...(author ?? initialAuthorFormState),
    TopLevelDomain: domain?.topLevelDomain || (author?.TopLevelDomain ?? ""),
    SecondLevelDomain: domain?.secondLevelDomain || (author?.SecondLevelDomain ?? ""),
    editType: null,
    editIndex: null,
    showImageManager: false,
    AuthorName: author?.AuthorName || defaultAuthorName || appState.userProfile?.displayName || '',
    CopyrightText: author?.CopyrightText || defaultCopyrightText || '',
  };
  const [form, dispatchForm] = useReducer(authorFormReducer, initialState);
  const { authToken, cultureInfo, domainRegistration } = appState;
  const token = authToken ?? '';
  const browserCulture = cultureFromBrowser()
  const language = form.LanguageName || cultureInfo?.Language || browserCulture.Language || "en";
  const country = form.RegionName || cultureInfo?.Country || browserCulture.Country || "US";
  const emailAddress = form.EmailAddress || domainRegistration?.contactInformation?.emailAddress || appState.userProfile?.emailAddress || '';

  // Handlers for editing child objects
  const handleEditArticle = (id: string) => {
    const idx = form.Articles.findIndex(a => a.id === id);
    if (idx !== -1) {
      dispatchForm({ type: "SET_EDIT_TYPE", payload: "article" });
      dispatchForm({ type: "SET_EDIT_INDEX", payload: idx });
    }
  };
  const handleEditBook = (id: string) => {
    const idx = form.Books.findIndex(b => b.id === id);
    if (idx !== -1) {
      dispatchForm({ type: "SET_EDIT_TYPE", payload: "book" });
      dispatchForm({ type: "SET_EDIT_INDEX", payload: idx });
    }
  };
  const handleEditSocial = (id: string) => {
    const idx = form.Socials.findIndex(s => s.id === id);
    if (idx !== -1) {
      dispatchForm({ type: "SET_EDIT_TYPE", payload: "social" });
      dispatchForm({ type: "SET_EDIT_INDEX", payload: idx });
    }
  };

  // Handlers for saving child objects
  const handleSaveArticle = (article: Article) => {
    if (form.editIndex !== null) {
      const updated = form.Articles.map((a, i) => i === form.editIndex ? article : a);
      dispatchForm({ type: "UPDATE_FIELD", payload: { name: "Articles", value: updated } });
    }
    dispatchForm({ type: "SET_EDIT_TYPE", payload: null });
    dispatchForm({ type: "SET_EDIT_INDEX", payload: null });
  };
  const handleSaveBook = (book: Book) => {
    if (form.editIndex !== null) {
      const updated = form.Books.map((b, i) => i === form.editIndex ? book : b);
      dispatchForm({ type: "UPDATE_FIELD", payload: { name: "Books", value: updated } });
    }
    dispatchForm({ type: "SET_EDIT_TYPE", payload: null });
    dispatchForm({ type: "SET_EDIT_INDEX", payload: null });
  };
  const handleSaveSocial = (social: Social) => {
    if (form.editIndex !== null) {
      const updated = form.Socials.map((s, i) => i === form.editIndex ? social : s);
      dispatchForm({ type: "UPDATE_FIELD", payload: { name: "Socials", value: updated } });
    }
    dispatchForm({ type: "SET_EDIT_TYPE", payload: null });
    dispatchForm({ type: "SET_EDIT_INDEX", payload: null });
  };

  // Add handlers
  const handleAddArticle = () => {
    const newArticle: Article = { id: crypto.randomUUID(), Title: "", Date: "", Publication: "", URL: "" };
    dispatchForm({ type: "UPDATE_FIELD", payload: { name: "Articles", value: [...form.Articles, newArticle] } });
    dispatchForm({ type: "SET_EDIT_TYPE", payload: "article" });
    dispatchForm({ type: "SET_EDIT_INDEX", payload: form.Articles.length });
  };
  const handleAddBook = () => {
    const newBook: Book = { id: crypto.randomUUID(), Title: "", Description: "", URL: "", Cover: "" };
    dispatchForm({ type: "UPDATE_FIELD", payload: { name: "Books", value: [...form.Books, newBook] } });
    dispatchForm({ type: "SET_EDIT_TYPE", payload: "book" });
    dispatchForm({ type: "SET_EDIT_INDEX", payload: form.Books.length });
  };
  const handleAddSocial = () => {
    const newSocial: Social = { id: crypto.randomUUID(), Name: "", URL: "" };
    dispatchForm({ type: "UPDATE_FIELD", payload: { name: "Socials", value: [...form.Socials, newSocial] } });
    dispatchForm({ type: "SET_EDIT_TYPE", payload: "social" });
    dispatchForm({ type: "SET_EDIT_INDEX", payload: form.Socials.length });
  };

  // Cancel child edit
  const handleCancelChild = () => {
    if (form.editType === "article" && form.editIndex !== null) {
      // If canceling a newly added article (last index), remove it
      if (form.editIndex === form.Articles.length - 1 && form.Articles[form.editIndex].Title === "" && form.Articles[form.editIndex].Date === "" && form.Articles[form.editIndex].Publication === "" && form.Articles[form.editIndex].URL === "") {
        const updated = form.Articles.slice(0, -1);
        dispatchForm({ type: "UPDATE_FIELD", payload: { name: "Articles", value: updated } });
      }
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
    onSave(form);
  };

  // Render only child form if editing
  if (form.editType === "article" && form.editIndex !== null) {
    return <ArticleForm article={form.Articles[form.editIndex]} onSave={handleSaveArticle} onCancel={handleCancelChild} />;
  }
  if (form.editType === "book" && form.editIndex !== null) {
    return <BookForm token={token} book={form.Books[form.editIndex]} onSave={handleSaveBook} onCancel={handleCancelChild} />;
  }
  if (form.editType === "social" && form.editIndex !== null) {
    return <SocialForm social={form.Socials[form.editIndex]} onSave={handleSaveSocial} onCancel={handleCancelChild} />;
  }

  // Main Author form
  return (
    <form onSubmit={handleSubmit}>
      <input name="id" value={form.id} readOnly hidden />
      <label>
        Author Name:
        <input name="AuthorName" value={form.AuthorName} onChange={handleChange} />
      </label>

      <LanguageDropdown
        Label="Language: "
        selectedLanguage={language as Language}
        onLanguageChange={(val: Language) => dispatchForm({ type: "UPDATE_FIELD", payload: { name: "LanguageName", value: val } })}
      />

      <CountryDropdown
        culture={cultureInfo}
        selectedCountry={country}
        Label="Country: "
        onCountryChange={(val: string) => dispatchForm({ type: "UPDATE_FIELD", payload: { name: "RegionName", value: val } })}
      />
      <label>
        Email:
        <input name="EmailAddress" value={emailAddress} onChange={handleChange} />
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
        <input name="HeadShotURL" value={form.HeadShotURL} onChange={handleChange} />
        <button type="button" className="author-form-headshot-btn" onClick={() => dispatchForm({ type: "SET_SHOW_IMAGE_MANAGER", payload: true })}>
          Choose Image
        </button>
        {form.showImageManager && (
          <div className="author-form-image-manager">
            <ImageManager
              token={token}
              onSelect={img => {
                dispatchForm({ type: "UPDATE_FIELD", payload: { name: "HeadShotURL", value: img.url } });
                dispatchForm({ type: "SET_SHOW_IMAGE_MANAGER", payload: false });
              }}
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
      <ArticleList articles={form.Articles} onEdit={handleEditArticle} onAdd={handleAddArticle} />
      <h3>Books</h3>
      <BookList books={form.Books} onEdit={handleEditBook} onAdd={handleAddBook} />
      <h3>Social Links</h3>
      <SocialList socials={form.Socials} onEdit={handleEditSocial} onAdd={handleAddSocial} />
      <button type="submit" className="app-btn">Save Author</button>
      <button type="button" className="app-btn cancel" onClick={onCancel}>Cancel</button>
    </form>
  );
}
