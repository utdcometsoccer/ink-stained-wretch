import { CountdownIndicator } from "../CountdownIndicator";
import "./ChooseCulture.css";
import { LanguageDropdown, CountryDropdown } from '@idahoedokpayi/react-country-state-selector';
import { useChooseCultureLogic } from '../../hooks/useChooseCulture';
import type { FC } from "react";
import { useEffect } from "react";
import { trackComponent } from "../../services/trackComponent";
import type { ChooseCultureProps } from "./ChooseCultureProps";


export const ChooseCulture: FC<ChooseCultureProps> = ({ state, dispatch }) => {
  useEffect(() => {
    trackComponent('ChooseCulture', { state });
  }, [state]);
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
        onSubmit={handleSubmit}
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
            className={`app-btn cancel`}
            onClick={handleCancel}
            disabled={typeof localState.countdown !== "number" || localState.countdown <= 0}
          >
            Cancel
          </button>
        </div>
      </form>
      <div className="choose-culture-cookies">
        <input type="checkbox" id="cookieConsent" name="cookieConsent" checked={useCookies} onChange={handleCookieConsentChange} />
        <label htmlFor="cookieConsent">I consent to the use of cookies for improving my experience.</label>
      </div>
      <div className="choose-culture-cookies-info">
        <p>
          We use cookies to store your language and region preferences as well as other settings, ensuring a personalized experience each time you visit our site. By consenting, you help us enhance your interaction with our platform.
        </p>
      </div>
    </div>
  );
}
