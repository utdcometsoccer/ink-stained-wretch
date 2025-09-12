import { type FC } from "react";
import { useGetLocalizedText } from "../../hooks/useGetLocalizedText";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { CountryDropdown, LanguageDropdown, type Language } from "@idahoedokpayi/react-country-state-selector";
import { ImageManager } from "../ImageManager/index";
import { ArticleList } from "../AuthorRegistration/ArticleList";
import { BookList } from "../BookList/index";
import { SocialList } from "../AuthorRegistration/SocialList";
import type { AuthorMainFormProps } from "./AuthorMainFormProps";
import { useTrackComponent } from "../../hooks/useTrackComponent";
import penguinLogo from '../../assets/penguin-vector.png';
import './AuthorMainForm.css';
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
    importAuthorFromPenguinRandomHouse,
    handleCancelClick,
    listUserImages,
    deleteImage,
}) => {
    const localized = useGetLocalizedText(cultureInfo ? cultureInfo.Culture :'en-us')?.AuthorMainForm || {
        legend: 'Author Information',
        authorName: 'Author Name:',
        language: 'Language:',
        country: 'Country:',
        email: 'Email:',
        welcomeText: 'Welcome Text:',
        aboutText: 'About Text:',
        headshotUrl: 'Headshot URL:',
        chooseImage: 'Choose Image',
        close: 'Close',
        copyrightText: 'Copyright Text:',
        topLevelDomain: 'Top Level Domain:',
        secondLevelDomain: 'Second Level Domain:',
        articles: 'Articles',
        books: 'Books',
        socialLinks: 'Social Links',
        importAuthor: 'Import Author From Open Library',
        importPenguinAuthor: 'Import Author From Penguin Random House',
        save: 'Save Author',
        cancel: 'Cancel',
    };
    useTrackComponent('AuthorMainForm', {
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
    });
    return (
        <form onSubmit={handleSubmit}>
            <fieldset className="author-form-fieldset">
                <legend>{localized.legend}</legend>
                <input name="id" value={form.id} readOnly hidden />
                <label>
                    {localized.authorName}
                    <input name="AuthorName" value={form.AuthorName} onChange={handleChange} />
                </label>
                <LanguageDropdown
                    culture={cultureInfo}
                    classNameSelect="input-fullwidth"
                    Label={localized.language}
                    selectedLanguage={form.LanguageName as Language}
                    onLanguageChange={handleLanguageChange}
                />
                <CountryDropdown
                    culture={cultureInfo}
                    classNameSelect="input-fullwidth"
                    selectedCountry={form.RegionName}
                    Label={localized.country}
                    onCountryChange={handleCountryChange}
                />
                <label>
                    {localized.email}
                    <input name="EmailAddress" value={form.EmailAddress} onChange={handleChange} />
                </label>
                <label>
                    {localized.welcomeText}
                    <textarea name="WelcomeText" value={form.WelcomeText} onChange={handleChange} />
                </label>
                <label>
                    {localized.aboutText}
                    <textarea name="AboutText" value={form.AboutText} onChange={handleChange} />
                </label>
                <label>
                    {localized.headshotUrl}
                    <div className="author-form-headshot-row">
                        <input name="HeadShotURL" value={form.HeadShotURL} onChange={handleChange} className="input-two-thirds-width" />
                        <button type="button" className="author-form-headshot-btn" onClick={() => dispatchForm({ type: "SET_SHOW_IMAGE_MANAGER", payload: true })}>
                            {localized.chooseImage}
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
                            <button type="button" className="author-form-image-manager-close" onClick={() => dispatchForm({ type: "SET_SHOW_IMAGE_MANAGER", payload: false })}>{localized.close}</button>
                        </div>
                    )}
                </label>
                <label>
                    {localized.copyrightText}
                    <input name="CopyrightText" value={form.CopyrightText} onChange={handleChange} />
                </label>
                <label>
                    {localized.topLevelDomain}
                    <input name="TopLevelDomain" value={form.TopLevelDomain} readOnly />
                </label>
                <label>
                    {localized.secondLevelDomain}
                    <input name="SecondLevelDomain" value={form.SecondLevelDomain} readOnly />
                </label>
                <h3>{localized.articles}</h3>
                <ArticleList articles={form.Articles} onEdit={handleEditArticle} onAdd={handleAddArticle} onDelete={handleDeleteArticle} />
                <h3>{localized.books}</h3>
                <BookList
                    books={form.Books}
                    onEdit={handleEditBook}
                    onAdd={handleAddBook}
                    onDelete={handleDeleteBook}
                    authorName={form.AuthorName}
                    importBook={importBook}
                    openLibraryAuthorKeys={form.OpenLibraryAuthorKeys}
                />
                <h3>{localized.socialLinks}</h3>
                <SocialList socials={form.Socials} onEdit={handleEditSocial} onAdd={handleAddSocial} onDelete={handleDeleteSocial} />
                <div className="author-form-btn-row">
                    <button type="button" className={`article-form-btn app-btn`} onClick={importAuthorFromPenguinRandomHouse}>
                        <img src={penguinLogo} alt="Penguin Random House Logo" className="penguin-logo" />
                        {localized.importPenguinAuthor}
                    </button>
                    <button type="button" className={`article-form-btn app-btn`} onClick={importAuthorFromOpenLibrary}>
                        <AccountBalanceIcon fontSize="small" />
                        {localized.importAuthor}
                    </button>
                    <button type="submit" className="app-btn">{localized.save}</button>
                    <button type="button" className="app-btn cancel" onClick={handleCancelClick}>{localized.cancel}</button>
                </div>
            </fieldset>
        </form>
    );
}
