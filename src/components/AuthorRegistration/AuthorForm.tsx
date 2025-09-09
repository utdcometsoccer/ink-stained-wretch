import { CountryDropdown, cultureFromBrowser, LanguageDropdown, type Language } from "@idahoedokpayi/react-country-state-selector";
import type { FC } from "react";
import { useReducer } from "react";
import { authorFormReducer, initialAuthorFormState } from "../../reducers/authorFormReducer";
import AuthorDocList from "./AuthorDocList";
import { AuthorDocForm } from "./AuthorDocForm";
import { deleteImage, listUserImages } from '../../services/imageApi';
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
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { fetchOpenLibraryAuthors } from "../../services/openLibraryApi";


export const AuthorForm: FC<AuthorFormProps> = ({ appState, author, domain, onSave, onCancel }) => {
  const defaultAuthorName = `${appState.domainRegistration?.contactInformation?.firstName} ${appState.domainRegistration?.contactInformation?.lastName}`.trim() || '';
  const defaultCopyrightText = appState.domainRegistration?.contactInformation?.firstName ? `© ${new Date().getFullYear()} ${appState.domainRegistration.contactInformation.firstName} ${appState.domainRegistration.contactInformation.lastName}. All rights reserved.` : '';
  const { authToken, cultureInfo, domainRegistration } = appState;
  const token = authToken ?? '';
  const browserCulture = cultureFromBrowser()
  const language = cultureInfo?.Language || browserCulture.Language || "en";
  const country = cultureInfo?.Country || browserCulture.Country || "US";
  const emailAddress = domainRegistration?.contactInformation?.emailAddress || appState.userProfile?.emailAddress || '';
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
    LanguageName: language,
    RegionName: country,
    EmailAddress: emailAddress,
    authorDocs: [],
    showAuthorDocList: false,
    showAuthorDocForm: false,
    selectedAuthorDoc: null
  };
  // Delete handlers for each child type
  const handleDeleteArticle = (id: string) => {
    const updated = form.Articles.filter(a => a.id !== id);
    dispatchForm({ type: "UPDATE_FIELD", payload: { name: "Articles", value: updated } });
  };

  const handleDeleteBook = (id: string) => {
    const updated = form.Books.filter(b => b.id !== id);
    dispatchForm({ type: "UPDATE_FIELD", payload: { name: "Books", value: updated } });
  };

  const handleDeleteSocial = (id: string) => {
    const updated = form.Socials.filter(s => s.id !== id);
    dispatchForm({ type: "UPDATE_FIELD", payload: { name: "Socials", value: updated } });
  };
  // Cancel logic for each child type
  const cancelArticle = () => {
    if (
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
      form.editIndex === form.Socials.length - 1 &&
      form.Socials[form.editIndex].Name === "" &&
      form.Socials[form.editIndex].URL === ""
    ) {
      const updated = form.Socials.slice(0, -1);
      dispatchForm({ type: "UPDATE_FIELD", payload: { name: "Socials", value: updated } });
    }
  };

  const importAuthorFromOpenLibrary = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const searchResult = await fetchOpenLibraryAuthors(form.AuthorName);
      dispatchForm({ type: 'SET_AUTHOR_DOCS', payload: searchResult.docs });
      dispatchForm({ type: 'SHOW_AUTHOR_DOC_LIST' });
    } catch (error) {
      console.error('Failed to fetch OpenLibrary authors:', error);
    }
  }

  const [form, dispatchForm] = useReducer(authorFormReducer, initialState);


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
    onSave(form);
  };

  // Show AuthorDocForm if requested, otherwise show AuthorDocList if requested
  if (form.showAuthorDocForm && form.selectedAuthorDoc) {
    return (
      <AuthorDocForm
        initialAuthorDoc={form.selectedAuthorDoc}
        onSave={() => {
          dispatchForm({ type: "SAVE_SELECTED_AUTHOR_DOC" });
          dispatchForm({ type: "HIDE_AUTHOR_DOC_FORM" });
        }}
        onCancel={() => dispatchForm({ type: "HIDE_AUTHOR_DOC_FORM" })}
      />
    );
  }
  if (form.showAuthorDocList) {
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
          // Explicitly hide the author doc list so Author Form is visible
          dispatchForm({ type: "HIDE_AUTHOR_DOC_LIST" });
        }}
      />
    );
  }

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

  const handleLanguageChange = (val: Language) => dispatchForm({ type: "UPDATE_FIELD", payload: { name: "LanguageName", value: val } });
  const handleCountryChange = (val: string) => dispatchForm({ type: "UPDATE_FIELD", payload: { name: "RegionName", value: val } });
  // Main Author form
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
          <button type="button" className="app-btn cancel" onClick={onCancel}>Cancel</button>
        </div>
      </fieldset>
    </form>
  );
}
