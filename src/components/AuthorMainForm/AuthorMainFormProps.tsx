import type { CultureInfo, Language } from "@idahoedokpayi/react-country-state-selector";
import type { Dispatch } from "react";
import type { AuthorFormAction } from "../../types/AuthorFormAction";
import type { AuthorFormUIState } from "../../types/AuthorFormUIState";
import type { Book } from "../../types/Book";

export interface AuthorMainFormProps {
    form: AuthorFormUIState;
    dispatchForm: Dispatch<AuthorFormAction>;
    token: string;
    cultureInfo?: CultureInfo;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleLanguageChange: (val: Language) => void;
    handleCountryChange: (val: string) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleEditArticle: (id: string) => void;
    handleAddArticle: () => void;
    handleDeleteArticle: (id: string) => void;
    handleEditBook: (id: string) => void;
    handleAddBook: () => void;
    handleDeleteBook: (id: string) => void;
    handleEditSocial: (id: string) => void;
    handleAddSocial: () => void;
    handleDeleteSocial: (id: string) => void;
    importBook: (newBook: Book) => void;
    importAuthorFromOpenLibrary: (e: React.MouseEvent<HTMLButtonElement>) => void;
    importAuthorFromPenguinRandomHouse: (e: React.MouseEvent<HTMLButtonElement>) => void;
    handleCancelClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    listUserImages: any;
    deleteImage: any;
    uploadImage: any;
}
