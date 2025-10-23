import { CountryDropdown, LanguageDropdown, type Language } from '@idahoedokpayi/react-country-state-selector';
import type { FC } from "react";
import { useChooseCultureLogic } from '../../hooks/useChooseCulture';
import { useLocalizationContext } from "../../hooks/useLocalizationContext";
import { useTrackComponent } from '../../hooks/useTrackComponent';
import { useGetLanguageInformation } from '../../services/getLanguageInformation';
import { useGetCountryInformation } from '../../services/getCountryInformation';
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
  const { ChooseCulture: { title, subtitle, legend, languageLabel, countryLabel, continue: continueLabel, cancel, cookieConsent, cookiesInfo } } = useLocalizationContext();
  const { language, country, countdown, shouldShowCountdown, hasSubmitted } = localState;
  const getCountryInformation = useGetCountryInformation();
  
  // Get the language information function
  const getLanguageInformation = useGetLanguageInformation();
  
  // Cancel button should be enabled only when:
  // 1. Continue has been clicked (hasSubmitted)
  // 2. Countdown is active (shouldShowCountdown)
  // 3. Valid culture exists in global state
  // 4. Valid culture exists in local state
  const isCancelEnabled = shouldShowCountdown && 
                          hasSubmitted && 
                          !!state.cultureInfo && 
                          !!language && 
                          !!country;
  
  return (
    <>
      <CountdownIndicator
        countdown={countdown}
        showRedirect={shouldShowCountdown && typeof countdown === "number" && countdown > 0}
        countdownRef={countdownRef}
      />
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <form
        className="choose-culture-form"
        onSubmit={handleSubmit}
      >
        <fieldset className="choose-culture-fieldset">
          <legend className="choose-culture-legend">{legend}</legend>
          <div className="choose-culture-dropdown-group">
            <LanguageDropdown
              selectedLanguage={language as Language}
              onLanguageChange={handleLanguageChange}
              Label={languageLabel}
              culture={state.cultureInfo}
              getLanguageInformation={getLanguageInformation}
            />
          </div>
          <div className="choose-culture-dropdown-group">
            <CountryDropdown
              selectedCountry={country}
              culture={state.cultureInfo}
              Label={countryLabel}
              onCountryChange={handleCountryChange}
              getCountryInformation={getCountryInformation}
            />
          </div>
        </fieldset>
        <div className="choose-culture-btn-group">
          <button
            type="submit"
            className={`app-btn${shouldShowCountdown && typeof countdown === "number" && countdown > 0 ? " cancel" : ""}`}
            disabled={shouldShowCountdown && typeof countdown === "number" && countdown > 0}
          >
            {continueLabel}
          </button>
          <button
            type="button"
            className={`app-btn cancel`}
            onClick={handleCancel}
            disabled={!isCancelEnabled}
          >
            {cancel}
          </button>
        </div>
      </form>
      <div className="choose-culture-cookies">
        <input type="checkbox" id="cookieConsent" name="cookieConsent" checked={useCookies} onChange={handleCookieConsentChange} />
        <label htmlFor="cookieConsent">{cookieConsent}</label>
      </div>
      <div className="choose-culture-cookies-info">
        <p>
          {cookiesInfo}
        </p>
      </div>
    </>
  );
}
