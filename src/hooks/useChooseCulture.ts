import { useEffect, useReducer, useRef, type Dispatch, type FormEvent } from "react";
import { cultureFromBrowser } from '@idahoedokpayi/react-country-state-selector';
import type { State } from "../types/State";
import { chooseCultureReducer } from "../reducers/chooseCultureReducer";
import type { Action } from "../types/Action";


export function useChooseCultureLogic(state: State, dispatch: Dispatch<Action>) {
  const browserCulture = cultureFromBrowser();
  const [localState, localDispatch] = useReducer(
    chooseCultureReducer,
    {
      language: state.cultureInfo?.Language ?? browserCulture.Language,
      country: state.cultureInfo?.Country ?? browserCulture.Country,
      countdown: undefined,
    }
  );
  const countdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.cultureInfo && !localState.countdown) {
      localDispatch({
        type: "SYNC_FROM_PROPS",
        payload: {
          language: state.cultureInfo.Language,
          country: state.cultureInfo.Country,
          countdown: Number(import.meta.env.VITE_COUNTDOWN_SECONDS) || 10,
        },
      });
    }
  }, [state.cultureInfo, localState.countdown]);

  useEffect(() => {
    if (typeof localState.countdown === "number" && localState.countdown > 0) {
      const timer = setTimeout(() => localDispatch({ type: "SET_COUNTDOWN", payload: (localState.countdown ?? 1) - 1 }), 1000);
      return () => clearTimeout(timer);
    } else if (localState.countdown === 0) {
      dispatch({ type: "SET_UI_STATE", payload: "login" });
    }
  }, [localState.countdown, dispatch]);

  const handleLanguageChange = (selected: string) => {
    localDispatch({ type: "SET_LANGUAGE", payload: selected });
  };

  const handleCountryChange = (selected: string) => {
    localDispatch({ type: "SET_COUNTRY", payload: selected });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({
      type: "UPDATE_STATE",
      payload: {
        cultureInfo: {
          Language: localState.language,
          Country: localState.country,
          Culture: `${localState.language}-${localState.country}`,
        },
      },
    });
    localDispatch({ type: "SET_COUNTDOWN", payload: 10 });
  };

  const handleCancel = () => {
    localDispatch({ type: "CANCEL_COUNTDOWN" });
  };

  // Handler for cookie consent checkbox
  function handleCookieConsentChange(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch({ type: "UPDATE_USE_COOKIES", payload: e.target.checked });
  }

  return {
    localState,
    countdownRef,
    handleLanguageChange,
    handleCountryChange,
    handleSubmit,
    handleCancel,
    handleCookieConsentChange,
  };
}
