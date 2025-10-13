import { useEffect, useReducer, useRef, type Dispatch, type FormEvent } from "react";
import type { State } from "../types/State";
import { chooseCultureReducer } from "../reducers/chooseCultureReducer";
import type { Action } from "../types/Action";
import { getBrowserCultureWithFallback } from "../services/getBrowserCultureWithFallback";
import { getLocalizedText } from "../services/localization";
import { getDefaultLocale } from "../services/getDefaultLocale";


export function useChooseCultureLogic(state: State, dispatch: Dispatch<Action>) {
  const browserCulture = getBrowserCultureWithFallback();
  const [localState, localDispatch] = useReducer(
    chooseCultureReducer,
    {
      language: state.cultureInfo?.Language ?? browserCulture.Language,
      country: state.cultureInfo?.Country ?? browserCulture.Country,
      countdown: undefined,
    }
  );
  const countdownRef = useRef<HTMLDivElement>(null);

  // Helper function to update localization data when culture changes
  const updateLocalizationData = async (language: string, country: string, culture: string) => {
    try {
      // Update global state immediately
      dispatch({
        type: "UPDATE_STATE",
        payload: {
          cultureInfo: {
            Language: language,
            Country: country,
            Culture: culture,
          },
        },
      });
      // Set loading state
      dispatch({
        type: 'UPDATE_STATE',
        payload: {
          localizationDataLoaded: false,
          loading: true
        }
      });

      const localizedText = await getLocalizedText(culture);
      const localized = localizedText || getDefaultLocale();

      // Update localization data and clear loading state
      dispatch({
        type: 'UPDATE_STATE',
        payload: {
          localizationData: localized,
          localizationDataLoaded: true,
          loading: false
        }
      });
    } catch (err) {
      console.error('Failed to load localization data:', err);
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : String(err) });
      dispatch({ type: 'UPDATE_STATE', payload: { loading: false } });
    }
  };

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
    // Update local state
    localDispatch({ type: "SET_LANGUAGE", payload: selected });

    const newCulture = `${selected}-${localState.country}`.toLowerCase();


    // Update localization data for the new culture
    updateLocalizationData(selected, localState.country, newCulture);
  };

  const handleCountryChange = (selected: string) => {
    localDispatch({ type: "SET_COUNTRY", payload: selected });

    const newCulture = `${localState.language}-${selected}`.toLowerCase();

    // Update localization data for the new culture
    updateLocalizationData(localState.language, selected, newCulture);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newCulture = `${localState.language}-${localState.country}`.toLowerCase();

    // Update localization data for the new culture
    updateLocalizationData(localState.language, localState.country, newCulture);

    localDispatch({ type: "SET_COUNTDOWN", payload: 10 });
    localDispatch({ type: "SHOW_COUNTDOWN" });
  };

  const handleCancel = () => {
    localDispatch({ type: "CANCEL_COUNTDOWN" });
    localDispatch({ type: "RESET_STATE" });
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
