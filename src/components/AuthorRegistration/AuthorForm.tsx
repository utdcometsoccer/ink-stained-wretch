import { CountryDropdown, CultureInfo, type Culture } from "@idahoedokpayi/react-country-state-selector";
import type { FC } from "react";
import { useReducer, useState } from "react";
import { authorFormReducer, initialAuthorFormState } from "../../reducers/authorFormReducer";
import type { Article } from "../../types/Article";
import type { Book } from "../../types/Book";
import type { Social } from "../../types/Social";
import { ImageManager } from "../ImageManager";
import { LanguageDropdown } from "../LanguageDropdown";
import { ArticleForm } from "./ArticleForm";
import { ArticleList } from "./ArticleList";
import "./AuthorForm.css";
import type { AuthorFormProps } from "./AuthorFormProps";
import { BookForm } from "./BookForm";
import { BookList } from "./BookList";
import { SocialForm } from "./SocialForm";
import { SocialList } from "./SocialList";


export const AuthorForm: FC<AuthorFormProps> = ({ author, language, token, domain, onSave, onCancel }) => {
  // If domain is provided, update TopLevelDomain and SecondLevelDomain in initial state
  const initialState = domain
    ? {
        ...author ?? initialAuthorFormState,
        LanguageName: language,
        TopLevelDomain: domain.topLevelDomain || "",
        SecondLevelDomain: domain.secondLevelDomain || ""
      }
    : author ?? initialAuthorFormState;
  const [form, dispatchForm] = useReducer(authorFormReducer, initialState);
  const [editType, setEditType] = useState<"article" | "book" | "social" | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showImageManager, setShowImageManager] = useState(false);

  // Handlers for editing child objects
  const handleEditArticle = (id: string) => {
    const idx = form.Articles.findIndex(a => a.id === id);
    if (idx !== -1) {
      setEditType("article");
      setEditIndex(idx);
    }
  };
  const handleEditBook = (id: string) => {
    const idx = form.Books.findIndex(b => b.id === id);
    if (idx !== -1) {
      setEditType("book");
      setEditIndex(idx);
    }
  };
  const handleEditSocial = (id: string) => {
    const idx = form.Socials.findIndex(s => s.id === id);
    if (idx !== -1) {
      setEditType("social");
      setEditIndex(idx);
    }
  };

  // Handlers for saving child objects
  const handleSaveArticle = (article: Article) => {
    if (editIndex !== null) {
      const updated = form.Articles.map((a, i) => i === editIndex ? article : a);
      dispatchForm({ type: "UPDATE_FIELD", payload: { name: "Articles", value: updated } });
    }
    setEditType(null); setEditIndex(null);
  };
  const handleSaveBook = (book: Book) => {
    if (editIndex !== null) {
      const updated = form.Books.map((b, i) => i === editIndex ? book : b);
      dispatchForm({ type: "UPDATE_FIELD", payload: { name: "Books", value: updated } });
    }
    setEditType(null); setEditIndex(null);
  };
  const handleSaveSocial = (social: Social) => {
    if (editIndex !== null) {
      const updated = form.Socials.map((s, i) => i === editIndex ? social : s);
      dispatchForm({ type: "UPDATE_FIELD", payload: { name: "Socials", value: updated } });
    }
    setEditType(null); setEditIndex(null);
  };

  // Add handlers
  const handleAddArticle = () => {
    const newArticle: Article = { id: crypto.randomUUID(), Title: "", Date: "", Publication: "", URL: "" };
    dispatchForm({ type: "UPDATE_FIELD", payload: { name: "Articles", value: [...form.Articles, newArticle] } });
    setEditType("article"); setEditIndex(form.Articles.length);
  };
  const handleAddBook = () => {
    const newBook: Book = { id: crypto.randomUUID(), Title: "", Description: "", URL: "", Cover: "" };
    dispatchForm({ type: "UPDATE_FIELD", payload: { name: "Books", value: [...form.Books, newBook] } });
    setEditType("book"); setEditIndex(form.Books.length);
  };
  const handleAddSocial = () => {
    const newSocial: Social = { id: crypto.randomUUID(), Name: "", URL: "" };
    dispatchForm({ type: "UPDATE_FIELD", payload: { name: "Socials", value: [...form.Socials, newSocial] } });
    setEditType("social"); setEditIndex(form.Socials.length);
  };

  // Cancel child edit
  const handleCancelChild = () => { setEditType(null); setEditIndex(null); };

  // Main form change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatchForm({ type: "UPDATE_FIELD", payload: { name: e.target.name, value: e.target.value } });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(form);
  };

  // Render only child form if editing
  if (editType === "article" && editIndex !== null) {
    return <ArticleForm article={form.Articles[editIndex]} onSave={handleSaveArticle} onCancel={handleCancelChild} />;
  }
  if (editType === "book" && editIndex !== null) {
    return <BookForm token={token} book={form.Books[editIndex]} onSave={handleSaveBook} onCancel={handleCancelChild} />;
  }
  if (editType === "social" && editIndex !== null) {
    return <SocialForm social={form.Socials[editIndex]} onSave={handleSaveSocial} onCancel={handleCancelChild} />;
  }

  // Main Author form
  return (
    <form onSubmit={handleSubmit}>
      <input name="id" value={form.id} readOnly hidden />
      <label>
        Author Name:
        <input name="AuthorName" value={form.AuthorName} onChange={handleChange} />
      </label>
      <label>
        Language:
        <LanguageDropdown
          name="LanguageName"
          value={form.LanguageName}
          onChange={e => dispatchForm({ type: "UPDATE_FIELD", payload: { name: "LanguageName", value: e.target.value } })}
          required
        />
      </label>
      <CountryDropdown
        culture={new CultureInfo(`${form.LanguageName || "en"}-${form.RegionName || "US"}` as Culture)}
        selectedCountry={form.RegionName}
        Label="Country: "
        onCountryChange={(val: string) => dispatchForm({ type: "UPDATE_FIELD", payload: { name: "RegionName", value: val } })}
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
        <input name="HeadShotURL" value={form.HeadShotURL} onChange={handleChange} />
        <button type="button" className="author-form-headshot-btn" onClick={() => setShowImageManager(true)}>
          Choose Image
        </button>
        {showImageManager && (
          <div className="author-form-image-manager">
            <ImageManager
              token={token}
              onSelect={img => {
                dispatchForm({ type: "UPDATE_FIELD", payload: { name: "HeadShotURL", value: img.url } });
                setShowImageManager(false);
              }}
            />
            <button type="button" className="author-form-image-manager-close" onClick={() => setShowImageManager(false)}>Close</button>
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
      <button type="submit">Save Author</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
}
