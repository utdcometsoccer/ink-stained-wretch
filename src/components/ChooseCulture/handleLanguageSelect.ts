import type { Language } from "../../types/Language";
import type { Dispatch } from "react";
import type { Action } from "../../reducers/appReducer";

export function handleLanguageSelect(dispatch: Dispatch<Action>) {
  return (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'UPDATE_STATE', payload: { selectedLanguage: e.target.value as Language } });
  };
}
