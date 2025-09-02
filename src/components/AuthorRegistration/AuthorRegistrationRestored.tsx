import { useEffect, useRef, useState } from "react";
import { validateEmail } from "../../services/validateEmail";
import type { Author } from "../../types/Author";
import type { AuthorRegistrationProps } from "./AuthorRegistrationProps";

export function AuthorRegistrationRestored({ state, dispatch }: AuthorRegistrationProps) {
    const COUNTDOWN_SECONDS = Number(import.meta.env.VITE_COUNTDOWN_SECONDS) || 10;
    const countdownRef = useRef<HTMLDivElement>(null);
    const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);

    useEffect(() => {
        if (countdownRef.current) {
            const percent = `${(COUNTDOWN_SECONDS - (state.countdown ?? 0)) * (100 / COUNTDOWN_SECONDS)}%`;
            countdownRef.current.style.setProperty('--countdown-width', percent);
        }
    }, [state.countdown, COUNTDOWN_SECONDS]);

    useEffect(() => {
        if (state.showRedirect && state.countdown !== null && (state.countdown ?? 0) > 0) {
            const timer = setTimeout(() => {
                dispatch({ type: 'UPDATE_STATE', payload: { countdown: (state.countdown ?? 1) - 1 } });
            }, 1000);
            return () => clearTimeout(timer);
        } else if (state.showRedirect && state.countdown === 0) {
            dispatch({ type: 'UPDATE_STATE', payload: { countdown: null } });
            dispatch({ type: 'SET_UI_STATE', payload: 'authorPage' });
        }
    }, [state.showRedirect, state.countdown, dispatch]);

    const authors: Author[] = Array.isArray(state.Authors) ? state.Authors : [];
    const authorInfo: Author =
        (selectedAuthorId && authors.find(a => a.id === selectedAuthorId)) ||
        state.authorInfo || {
            id: '',
            TopLevelDomain: '',
            SecondLevelDomain: '',
            LanguageName: state.cultureInfo ? (state.cultureInfo.Language || '') : '',
            RegionName: state.cultureInfo ? (state.cultureInfo.Country || '') : '',
            AuthorName: '',
            WelcomeText: '',
            AboutText: '',
            HeadShotURL: '',
            CopyrightText: '',
            EmailAddress: '',
            Articles: [],
            Books: [],
            Socials: [],
        };
    const authorError = state.authorError || null;

    // Validation error states
    const [articleError, setArticleError] = useState<string | null>(null);
    const [bookError, setBookError] = useState<string | null>(null);
    const [socialError, setSocialError] = useState<string | null>(null);
    const [authorFormError, setAuthorFormError] = useState<string | null>(null);

    // Local state for new items
    const [newArticle, setNewArticle] = useState({ Title: '', Description: '', URL: '', Cover: '' });
    const [newBook, setNewBook] = useState({ Title: '', Description: '', URL: '', Cover: '' });
    const [newSocial, setNewSocial] = useState({ Name: '', URL: '' });

    const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        dispatch({
            type: "UPDATE_AUTHOR_INFO",
            payload: {
                ...authorInfo,
                [name]: value,
            },
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!authorInfo.AuthorName.trim() || !authorInfo.EmailAddress.trim() || !authorInfo.LanguageName.trim() || !authorInfo.RegionName.trim()) {
            setAuthorFormError('Please fill out all required author information.');
            return;
        }
        if (!validateEmail(authorInfo.EmailAddress)) {
            setAuthorFormError('Please enter a valid email address.');
            return;
        }
        setAuthorFormError(null);
        dispatch({ type: "UPDATE_AUTHOR_ERROR", payload: null });
        const updatedAuthors: Author[] = Array.isArray(state.Authors)
            ? [...state.Authors.filter(a => a.id !== authorInfo.id), { ...authorInfo, id: authorInfo.id || crypto.randomUUID() }]
            : [{ ...authorInfo, id: authorInfo.id || crypto.randomUUID() }];
        dispatch({ type: "UPDATE_STATE", payload: { Authors: updatedAuthors, authorInfo: authorInfo } });
        dispatch({ type: 'UPDATE_STATE', payload: { showRedirect: true, countdown: COUNTDOWN_SECONDS } });
        setSelectedAuthorId(null);
    };

    // Add Article
    const handleAddArticle = () => {
        if (!newArticle.Title.trim()) {
            setArticleError('Title is required.');
            return;
        }
        setArticleError(null);
        const updatedArticles = [
            ...authorInfo.Articles,
            { ...newArticle, id: crypto.randomUUID() },
        ];
        dispatch({
            type: "UPDATE_AUTHOR_INFO",
            payload: { ...authorInfo, Articles: updatedArticles },
        });
        setNewArticle({ Title: '', Description: '', URL: '', Cover: '' });
    };
    const handleRemoveArticle = (id: string) => {
        const updatedArticles = authorInfo.Articles.filter(a => a.id !== id);
        dispatch({
            type: "UPDATE_AUTHOR_INFO",
            payload: { ...authorInfo, Articles: updatedArticles },
        });
    };

    // Add Book
    const handleAddBook = () => {
        if (!newBook.Title.trim()) {
            setBookError('Title is required.');
            return;
        }
        setBookError(null);
        const updatedBooks = [
            ...authorInfo.Books,
            { ...newBook, id: crypto.randomUUID() },
        ];
        dispatch({
            type: "UPDATE_AUTHOR_INFO",
            payload: { ...authorInfo, Books: updatedBooks },
        });
        setNewBook({ Title: '', Description: '', URL: '', Cover: '' });
    };
    const handleRemoveBook = (id: string) => {
        const updatedBooks = authorInfo.Books.filter(b => b.id !== id);
        dispatch({
            type: "UPDATE_AUTHOR_INFO",
            payload: { ...authorInfo, Books: updatedBooks },
        });
    };

    // Add Social
    const handleAddSocial = () => {
        if (!newSocial.Name.trim()) {
            setSocialError('Name is required.');
            return;
        }
        setSocialError(null);
        const updatedSocials = [
            ...authorInfo.Socials,
            { ...newSocial, id: crypto.randomUUID() },
        ];
        dispatch({
            type: "UPDATE_AUTHOR_INFO",
            payload: { ...authorInfo, Socials: updatedSocials },
        });
        setNewSocial({ Name: '', URL: '' });
    };
    const handleRemoveSocial = (id: string) => {
        const updatedSocials = authorInfo.Socials.filter(s => s.id !== id);
        dispatch({
            type: "UPDATE_AUTHOR_INFO",
            payload: { ...authorInfo, Socials: updatedSocials },
        });
    };

    // Delete Author
    const handleDeleteAuthor = (id: string) => {
        const updatedAuthors = authors.filter(a => a.id !== id);
        dispatch({ type: "UPDATE_STATE", payload: { Authors: updatedAuthors } });
        if (selectedAuthorId === id) setSelectedAuthorId(null);
    };

    return (
        <div>
            <h1>Author Registration</h1>
            <p>Enter your author information.</p>
            <div>
                <h2>Authors</h2>
                <ul>
                    {authors.map(author => (
                        <li key={author.id}>
                            <button type="button" onClick={() => setSelectedAuthorId(author.id)}>
                                {author.AuthorName} ({author.EmailAddress})
                            </button>
                            <button type="button" style={{ marginLeft: 8, color: 'red' }} onClick={() => handleDeleteAuthor(author.id)}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <form onSubmit={handleSubmit}>
                <fieldset className="author-fieldset">
                    <legend>Author Information</legend>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="AuthorName"
                            value={authorInfo.AuthorName}
                            onChange={handleAuthorChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Email Address:
                        <input
                            type="email"
                            name="EmailAddress"
                            value={authorInfo.EmailAddress}
                            onChange={handleAuthorChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Welcome Text:
                        <input
                            type="text"
                            name="WelcomeText"
                            value={authorInfo.WelcomeText}
                            onChange={handleAuthorChange}
                        />
                    </label>
                    <br />
                    <label>
                        About Text:
                        <input
                            type="text"
                            name="AboutText"
                            value={authorInfo.AboutText}
                            onChange={handleAuthorChange}
                        />
                    </label>
                    <br />
                    <label>
                        Headshot URL:
                        <input
                            type="text"
                            name="HeadShotURL"
                            value={authorInfo.HeadShotURL}
                            onChange={handleAuthorChange}
                        />
                    </label>
                    <br />
                    <label>
                        Copyright Text:
                        <input
                            type="text"
                            name="CopyrightText"
                            value={authorInfo.CopyrightText}
                            onChange={handleAuthorChange}
                        />
                    </label>
                    <br />
                    <label>
                        Language:
                        <input
                            type="text"
                            name="LanguageName"
                            value={authorInfo.LanguageName}
                            onChange={handleAuthorChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Region:
                        <input
                            type="text"
                            name="RegionName"
                            value={authorInfo.RegionName}
                            onChange={handleAuthorChange}
                            required
                        />
                    </label>
                </fieldset>
                {(authorError || authorFormError) && (
                    <div className="error-message">{authorError || authorFormError}</div>
                )}
                <button type="submit">{selectedAuthorId ? "Update Author" : "Add Author"}</button>
                <hr />
                <fieldset>
                    <legend>Articles</legend>
                    <ul>
                        {authorInfo.Articles.map(article => (
                            <li key={article.id}>
                                <strong>{article.Title}</strong> - {article.Description}
                                <button type="button" onClick={() => handleRemoveArticle(article.id)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                    <input
                        type="text"
                        placeholder="Title"
                        value={newArticle.Title}
                        onChange={e => setNewArticle(a => ({ ...a, Title: e.target.value }))}
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={newArticle.Description}
                        onChange={e => setNewArticle(a => ({ ...a, Description: e.target.value }))}
                    />
                    <input
                        type="text"
                        placeholder="URL"
                        value={newArticle.URL}
                        onChange={e => setNewArticle(a => ({ ...a, URL: e.target.value }))}
                    />
                    <input
                        type="text"
                        placeholder="Cover"
                        value={newArticle.Cover}
                        onChange={e => setNewArticle(a => ({ ...a, Cover: e.target.value }))}
                    />
                    <button type="button" onClick={handleAddArticle}>Add Article</button>
                    {articleError && <div className="error-message">{articleError}</div>}
                </fieldset>
                <fieldset>
                    <legend>Books</legend>
                    <ul>
                        {authorInfo.Books.map(book => (
                            <li key={book.id}>
                                <strong>{book.Title}</strong> - {book.Description}
                                <button type="button" onClick={() => handleRemoveBook(book.id)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                    <input
                        type="text"
                        placeholder="Title"
                        value={newBook.Title}
                        onChange={e => setNewBook(b => ({ ...b, Title: e.target.value }))}
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={newBook.Description}
                        onChange={e => setNewBook(b => ({ ...b, Description: e.target.value }))}
                    />
                    <input
                        type="text"
                        placeholder="URL"
                        value={newBook.URL}
                        onChange={e => setNewBook(b => ({ ...b, URL: e.target.value }))}
                    />
                    <input
                        type="text"
                        placeholder="Cover"
                        value={newBook.Cover}
                        onChange={e => setNewBook(b => ({ ...b, Cover: e.target.value }))}
                    />
                    <button type="button" onClick={handleAddBook}>Add Book</button>
                    {bookError && <div className="error-message">{bookError}</div>}
                </fieldset>
                <fieldset>
                    <legend>Socials</legend>
                    <ul>
                        {authorInfo.Socials.map(social => (
                            <li key={social.id}>
                                <strong>{social.Name}</strong> - {social.URL}
                                <button type="button" onClick={() => handleRemoveSocial(social.id)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                    <input
                        type="text"
                        placeholder="Name"
                        value={newSocial.Name}
                        onChange={e => setNewSocial(s => ({ ...s, Name: e.target.value }))}
                    />
                    <input
                        type="text"
                        placeholder="URL"
                        value={newSocial.URL}
                        onChange={e => setNewSocial(s => ({ ...s, URL: e.target.value }))}
                    />
                    <button type="button" onClick={handleAddSocial}>Add Social</button>
                    {socialError && <div className="error-message">{socialError}</div>}
                </fieldset>
            </form>
        </div>
    );
}
