import { handleCultureSubmit } from "./handleCultureSubmit";
import { handleLanguageSelect } from "./handleLanguageSelect";
import { handleRegionSelect } from "./handleRegionSelect";
import { languageNames } from "./languageNames";
import { regionNames } from "./regionNames";
import type { Dispatch } from "react";

interface ChooseCultureFormProps {
  culture: string;
  selectedLanguage?: string;
  selectedRegion?: string;
  dispatch: Dispatch<{ type: string; payload?: any }>;
}

export function ChooseCultureForm({ culture, selectedLanguage, selectedRegion, dispatch }: ChooseCultureFormProps) {
  return (
    <div className="choose-culture-container">
      <div className="current-culture">
        <p>Current culture: <strong>{culture}</strong></p>
      </div>
      <form className="culture-form" onSubmit={e => {
        e.preventDefault();
        handleCultureSubmit(
          selectedLanguage as import('../../types/Language').Language | null,
          selectedRegion as import('../../types/Region').Region | null,
          dispatch
        );
      }}>
        <div className="form-group">
          <label htmlFor="language">Language</label>
          <select id="language" value={selectedLanguage ?? ""} onChange={handleLanguageSelect(dispatch)}>
            <option value="" disabled>Select language</option>
            {(Object.entries(languageNames) as [string, string][]).map(([code, name]) => (
              <option key={code} value={code}>{name} ({code})</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="region">Region</label>
          <select id="region" value={selectedRegion ?? ""} onChange={handleRegionSelect(dispatch)}>
            <option value="" disabled>Select region</option>
            {(Object.entries(regionNames) as [string, string][]).map(([code, name]) => (
              <option key={code} value={code}>{name} ({code})</option>
            ))}
          </select>
        </div>
        <button
          className="submit-button"
          onClick={() => handleCultureSubmit(
            selectedLanguage as import('../../types/Language').Language | null,
            selectedRegion as import('../../types/Region').Region | null,
            dispatch
          )}
          disabled={!selectedLanguage || !selectedRegion}
        >
          Continue
        </button>
      </form>
    </div>
  );
}