import { CountryDropdown, LanguageDropdown, type Language } from '@idahoedokpayi/react-country-state-selector';
import type { FC } from "react";
import { useChooseCultureLogic } from '../../hooks/useChooseCulture';
import { useLocalizationContext } from "../../hooks/useLocalizationContext";
import { useTrackComponent } from '../../hooks/useTrackComponent';
import { CountdownIndicator } from "../CountdownIndicator";
import "./ChooseCulture.css";
import type { ChooseCultureProps } from "./ChooseCultureProps";


export const ChooseCulture: FC<ChooseCultureProps> = ({ state, dispatch }) => {
  useTrackComponent('ChooseCulture', { state, dispatch });
  const {
    localState,
    countdownRef,
    handleLanguageChange,
    handleCountryChange,
    handleSubmit,
    handleCancel,
    handleCookieConsentChange,
  } = useChooseCultureLogic(state, dispatch);
  const { useCookies } = state;
  const culture = state.cultureInfo?.Culture || 'en-us';
  const localized = useLocalizationContext().ChooseCulture;
  return (
    <div className="choose-culture-container">
      <CountdownIndicator
        countdown={localState.countdown}
        showRedirect={typeof localState.countdown === "number" && localState.countdown > 0}
        culture={culture}
        countdownRef={countdownRef}
      />
      <h1>{localized.title}</h1>
      <p>{localized.subtitle}</p>
      <form
        className="choose-culture-form"
        onSubmit={handleSubmit}
      >
        <fieldset className="choose-culture-fieldset">
          <legend className="choose-culture-legend">{localized.legend}</legend>
          <div className="choose-culture-dropdown-group">
            <LanguageDropdown
              selectedLanguage={localState.language as Language}
              onLanguageChange={handleLanguageChange}
              Label={localized.languageLabel}
              culture={state.cultureInfo}
            />
          </div>
          <div className="choose-culture-dropdown-group">
            <CountryDropdown
              selectedCountry={localState.country}
              culture={state.cultureInfo}
              Label={localized.countryLabel}
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
            {localized.continue}
          </button>
          <button
            type="button"
            className={`app-btn cancel`}
            onClick={handleCancel}
            disabled={typeof localState.countdown !== "number" || localState.countdown <= 0}
          >
            {localized.cancel}
          </button>
        </div>
      </form>
      <div className="choose-culture-cookies">
        <input type="checkbox" id="cookieConsent" name="cookieConsent" checked={useCookies} onChange={handleCookieConsentChange} />
        <label htmlFor="cookieConsent">{localized.cookieConsent}</label>
      </div>
      <div className="choose-culture-cookies-info">
        <p>
          {localized.cookiesInfo}
        </p>
      </div>
    </div>
  );
}
