import { useState } from "react";
import type { FC } from "react";
import type { Author } from "../../types/Author";
import type { Article } from "../../types/Article";
import type { Book } from "../../types/Book";
import type { Social } from "../../types/Social";
import { ArticleList } from "./ArticleList";
import { BookList } from "./BookList";
import { SocialList } from "./SocialList";
import { ArticleForm } from "./ArticleForm";
import { BookForm } from "./BookForm";
import { SocialForm } from "./SocialForm";

interface AuthorFormProps {
  author: Author;
  onSave: (author: Author) => void;
  onCancel: () => void;
}

export const AuthorForm: FC<AuthorFormProps> = ({ author, onSave, onCancel }) => {
  const [form, setForm] = useState<Author>(author);
  const [editType, setEditType] = useState<"article" | "book" | "social" | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

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
    const newArticles = [...form.Articles];
    if (editIndex !== null) newArticles[editIndex] = article;
    setForm({ ...form, Articles: newArticles });
    setEditType(null); setEditIndex(null);
  };
  const handleSaveBook = (book: Book) => {
    const newBooks = [...form.Books];
    if (editIndex !== null) newBooks[editIndex] = book;
    setForm({ ...form, Books: newBooks });
    setEditType(null); setEditIndex(null);
  };
  const handleSaveSocial = (social: Social) => {
    const newSocials = [...form.Socials];
    if (editIndex !== null) newSocials[editIndex] = social;
    setForm({ ...form, Socials: newSocials });
    setEditType(null); setEditIndex(null);
  };

  // Add handlers
  const handleAddArticle = () => {
    const newArticle: Article = { id: crypto.randomUUID(), Title: "", Date: "", Publication: "", URL: "" };
    setForm({ ...form, Articles: [...form.Articles, newArticle] });
    setEditType("article"); setEditIndex(form.Articles.length);
  };
  const handleAddBook = () => {
    const newBook: Book = { id: crypto.randomUUID(), Title: "", Description: "", URL: "", Cover: "" };
    setForm({ ...form, Books: [...form.Books, newBook] });
    setEditType("book"); setEditIndex(form.Books.length);
  };
  const handleAddSocial = () => {
    const newSocial: Social = { id: crypto.randomUUID(), Name: "", URL: "" };
    setForm({ ...form, Socials: [...form.Socials, newSocial] });
    setEditType("social"); setEditIndex(form.Socials.length);
  };

  // Cancel child edit
  const handleCancelChild = () => { setEditType(null); setEditIndex(null); };

  // Main form change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    return <BookForm book={form.Books[editIndex]} onSave={handleSaveBook} onCancel={handleCancelChild} />;
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
        <input name="LanguageName" value={form.LanguageName} onChange={handleChange} />
      </label>
      <label>
        Region:
        <input name="RegionName" value={form.RegionName} onChange={handleChange} />
      </label>
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
      </label>
      <label>
        Copyright Text:
        <input name="CopyrightText" value={form.CopyrightText} onChange={handleChange} />
      </label>
      <label>
        Top Level Domain:
        <input name="TopLevelDomain" value={form.TopLevelDomain} onChange={handleChange} />
      </label>
      <label>
        Second Level Domain:
        <input name="SecondLevelDomain" value={form.SecondLevelDomain} onChange={handleChange} />
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
