import { CountdownIndicator } from "../CountdownIndicator";
import "./ChooseCulture.css";
import { type FC, useEffect, useReducer, useRef } from "react";
import type { ChooseCultureProps } from "./ChooseCultureProps";
import { cultureFromBrowser, LanguageDropdown, CountryDropdown } from '@idahoedokpayi/react-country-state-selector';
import { chooseCultureReducer } from "../../reducers/appReducer/chooseCultureReducer";


export const ChooseCulture: FC<ChooseCultureProps> = ({ state, dispatch }) => {
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
          countdown: import.meta.env.VITE_COUNTDOWN_SECONDS ?? 10,
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

  return (
    <div className="choose-culture-container">
      <CountdownIndicator
        countdown={localState.countdown}
        showRedirect={typeof localState.countdown === "number" && localState.countdown > 0}
        text={`Redirecting in ${localState.countdown ?? 0} seconds...`}
        countdownRef={countdownRef}
      />
      <h1>Choose Your Language and Region</h1>
      <p>Select your preferred language and region for the best experience.</p>
      <form
        className="choose-culture-form"
        onSubmit={e => {
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
        }}
      >
        <fieldset className="choose-culture-fieldset">
          <legend className="choose-culture-legend">Select Language and Country</legend>
          <div className="choose-culture-dropdown-group">
            <LanguageDropdown
              selectedLanguage={localState.language as any}
              onLanguageChange={handleLanguageChange}
              Label="Language: "
              culture={state.cultureInfo}
            />
          </div>
          <div className="choose-culture-dropdown-group">
            <CountryDropdown
              selectedCountry={localState.country}
              culture={state.cultureInfo}
              Label="Country:"
              onCountryChange={handleCountryChange}
            />
          </div>
        </fieldset>
        <div className="choose-culture-btn-group">
          <button
            type="submit"
            className={`app-btn${typeof localState.countdown === "number" && localState.countdown > 0 ? " cancel" : ""}`}
            disabled={typeof localState.countdown === "number" && localState.countdown > 0}
          >
            Continue
          </button>
          <button
            type="button"
            className="app-btn cancel"
            onClick={() => localDispatch({ type: "CANCEL_COUNTDOWN" })}
            disabled={typeof localState.countdown !== "number" || localState.countdown <= 0}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
