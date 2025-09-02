import type { Culture } from "../../types/Culture";
import type { State } from "../../types/State";
import type { Dispatch } from "react";
import type { LoginAction } from "../../types/LoginAction";
import { isValidCulture } from "../../services/isValidCulture";

export function autoDetectCulture(  
  state: State,
  dispatch: Dispatch<LoginAction>
) {
  if (state.isFirstVisitCulture === false) return;
  if (typeof state.autoDetect === 'undefined' || state.autoDetect) {
    const browserLang = navigator.language || (navigator.languages && navigator.languages[0]) || 'en-US';
    const [lang, regionRaw] = browserLang.split('-');
    const region = regionRaw ?? 'US';
    const culture = `${lang}-${region}` as Culture;
    if (isValidCulture(culture)) {
      dispatch({ type: 'UPDATE_STATE', payload: { culture, isFirstVisit: false } });
      setTimeout(() => {
        dispatch({ type: 'SET_UI_STATE', payload: 'login' });
      }, 1000);
    } else {
      dispatch({ type: 'UPDATE_STATE', payload: { isFirstVisit: false } });
    }
  } else {
    dispatch({ type: 'UPDATE_STATE', payload: { isFirstVisit: false } });
  }
}
