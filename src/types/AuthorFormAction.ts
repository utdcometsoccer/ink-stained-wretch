import type { AuthorFormButtonState } from "./AuthorFormButtonState";
import type { AuthorForms } from "./AuthorForms";
import type { Domain } from "./Domain";
import type { AuthorDoc } from "./OpenLibrary";


export type AuthorFormAction = { type: "UPDATE_FIELD"; payload: { name: string; value: any; }; } |
{ type: "ADD_ARTICLE"; payload: any; } |
{ type: "ADD_BOOK"; payload: any; } |
{ type: "ADD_SOCIAL"; payload: any; } |
{ type: "SET_DOMAIN"; payload: Domain; } |
{ type: "SET_EDIT_TYPE"; payload: "article" | "book" | "social" | null; } |
{ type: "SET_EDIT_INDEX"; payload: number | null; } |
{ type: "SET_SHOW_IMAGE_MANAGER"; payload: boolean; } |
{ type: "SET_AUTHOR_DOCS"; payload: AuthorDoc[]; } |
{ type: "SHOW_AUTHOR_DOC_LIST"; } |
{ type: "HIDE_AUTHOR_DOC_LIST"; } |
{ type: "SELECT_AUTHOR_DOC"; payload: AuthorDoc; } |
{ type: "SHOW_AUTHOR_DOC_FORM"; } |
{ type: "HIDE_AUTHOR_DOC_FORM"; } |
{ type: "IMPORT_AUTHOR_DOC_KEYS"; payload: AuthorDoc[]; } |
{ type: "SAVE_SELECTED_AUTHOR_DOC"; } |
{ type: "SET_BUTTON_STATE"; payload: AuthorFormButtonState; } |
{ type: "SET_AUTHOR_FORM_STATE"; payload: AuthorForms; } |
{ type: "RESET_FORM"; };
