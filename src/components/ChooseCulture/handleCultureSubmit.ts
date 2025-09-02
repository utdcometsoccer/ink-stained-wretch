import type { Language } from "../../types/Language";
import type { Region } from "../../types/Region";
import type { Culture } from "../../types/Culture";
import type { Dispatch } from "react";
import type { LoginAction } from "../../types/LoginAction";
import { isValidCulture } from "../../services/isValidCulture";

export function handleCultureSubmit(
  selectedLanguage: Language | null,
  selectedRegion: Region | null,
  dispatch: Dispatch<LoginAction>
) {
  if (selectedLanguage) {
    const region = selectedRegion ?? 'US';
    const culture = `${selectedLanguage}-${region}` as Culture;
    if (isValidCulture(culture)) {
      dispatch({ type: 'UPDATE_STATE', payload: { culture } });
      dispatch({ type: 'SET_UI_STATE', payload: 'createAccount' });
    } else {
      dispatch({ type: 'SET_ERROR', payload: 'Invalid culture combination selected' });
    }
  }
}
