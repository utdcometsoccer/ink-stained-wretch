import type { Language } from "../../types/Language";
import type { Dispatch } from "react";

export function handleLanguageSelect(dispatch: Dispatch<{ type: string; payload?: any }>) {
  return (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'UPDATE_STATE', payload: { selectedLanguage: e.target.value as Language } });
  };
}
