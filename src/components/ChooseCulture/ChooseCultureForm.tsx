import type { ChooseCultureFormProps } from "./ChooseCultureFormProps";
import { handleCultureSubmit } from "./handleCultureSubmit";
import { handleLanguageSelect } from "./handleLanguageSelect";
import { handleRegionSelect } from "./handleRegionSelect";
import { languageNames } from "./languageNames";
import { regionNames } from "./regionNames";


export function ChooseCultureForm({ cultureInfo, dispatch }: ChooseCultureFormProps) {
  return (
    <div className="choose-culture-container">
      <div className="current-culture">
        <p>Current culture: <strong>{cultureInfo?.Culture ?? "Unknown"}</strong></p>
      </div>
      <form className="culture-form" onSubmit={e => {
        e.preventDefault();
           handleCultureSubmit(
             dispatch,
             cultureInfo
           );
      }}>
        <div className="form-group">
          <label htmlFor="language">Language</label>
          <select id="language" value={cultureInfo?.Language ?? ""} onChange={handleLanguageSelect(dispatch)}>
            <option value="" disabled>Select language</option>
            {(Object.entries(languageNames) as [string, string][]).map(([code, name]) => (
              <option key={code} value={code}>{name} ({code})</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="region">Region</label>
          <select id="region" value={cultureInfo?.Country ?? ""} onChange={handleRegionSelect(dispatch)}>
            <option value="" disabled>Select region</option>
            {(Object.entries(regionNames) as [string, string][]).map(([code, name]) => (
              <option key={code} value={code}>{name} ({code})</option>
            ))}
          </select>
        </div>
           <button
             className="submit-button"
             disabled={!cultureInfo?.Language || !cultureInfo?.Country}
           >
          Continue
        </button>
      </form>
    </div>
  );
}