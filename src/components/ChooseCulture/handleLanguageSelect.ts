import type { Language } from "../../types/Language";
import type { Dispatch } from "react";
import type { LoginAction } from "../../types/LoginAction";

export function handleLanguageSelect(dispatch: Dispatch<LoginAction>) {
  return (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'UPDATE_STATE', payload: { selectedLanguage: e.target.value as Language } });
  };
}
