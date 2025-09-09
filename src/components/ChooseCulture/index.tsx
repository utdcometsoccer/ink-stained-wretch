import { CountdownIndicator } from "../CountdownIndicator";
import "./ChooseCulture.css";
import { LanguageDropdown, CountryDropdown } from '@idahoedokpayi/react-country-state-selector';
import { useChooseCultureLogic } from '../../hooks/useChooseCulture';


export const ChooseCulture = (props: any) => {
  const {
    localState,
    countdownRef,
    handleLanguageChange,
    handleCountryChange,
    handleSubmit,
    handleCancel,
  } = useChooseCultureLogic(props.state, props.dispatch);

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
                  culture={props.state.cultureInfo}
            />
          </div>
          <div className="choose-culture-dropdown-group">
                <CountryDropdown
                  selectedCountry={localState.country}
                  culture={props.state.cultureInfo}
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
    </div>
  );
}
