import type { Language } from "../../types/Language";
import type { Region } from "../../types/Region";
import type { Culture } from "../../types/Culture";
import { useState, useEffect } from "react";
import { isValidCulture } from "../../utilities/isValidCulture";
import './ChooseCulture.css';
import type { ChooseCultureProps } from "./ChooseCultureProps";

import { languageNames } from "./languageNames";
import { regionNames } from "./regionNames";

export function ChooseCulture({ state, dispatch }: ChooseCultureProps) {
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);


  useEffect(() => {
    if (!isFirstVisit) return;
  // Only auto-detect if state.autoDetect is true (default true)
  if (typeof state.autoDetect === 'undefined' || state.autoDetect) {
      const browserLang = navigator.language || (navigator.languages && navigator.languages[0]) || 'en-US';
      const [lang, region] = browserLang.split('-');
      const culture = `${lang}-${region}` as Culture;

      if (isValidCulture(culture)) {
        dispatch({ type: 'UPDATE_STATE', payload: { culture } });
        setTimeout(() => {
          dispatch({ type: 'SET_UI_STATE', payload: 'createAccount' });
        }, 1000);
      } else {
        setIsFirstVisit(false);
      }
    } else {
      // If autoDetect is false, do not auto-detect, just show the form
      setIsFirstVisit(false);
    }
  }, [isFirstVisit, dispatch, state.autoDetect]);

  const handleLanguageSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value as Language);
  };

  const handleRegionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(e.target.value as Region);
  };

  const handleSubmit = () => {
    if (selectedLanguage && selectedRegion) {
      const culture = `${selectedLanguage}-${selectedRegion}` as Culture;

      if (isValidCulture(culture)) {
        dispatch({ type: 'UPDATE_STATE', payload: { culture } });
        dispatch({ type: 'SET_UI_STATE', payload: 'createAccount' });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Invalid culture combination selected' });
      }
    }
  };

  // If this is first visit and we're auto-detecting, show loading state
  if (isFirstVisit && !state.culture) {
    return (
      <div className="choose-culture-container">
        <div className="auto-detection">
          <h1>Welcome to Ink Stained Wretch</h1>
          <div className="detection-spinner">
            <div className="spinner"></div>
            <p>Detecting your language and region...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="choose-culture-container">
      <h1>Choose Your Language and Region</h1>
      <p>Select your preferred language and region for the best experience.</p>

      {state.culture && (
        <div className="choose-culture-container">
          <div className="current-culture">
            <p>Current culture: <strong>{state.culture}</strong></p>
          </div>
          <form className="culture-form" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
            <div className="form-group">
              <label htmlFor="language">Language</label>
              <select id="language" value={selectedLanguage ?? ""} onChange={handleLanguageSelect}>
                <option value="" disabled>Select language</option>
                {(Object.entries(languageNames) as [string, string][]).map(([code, name]) => (
                  <option key={code} value={code}>{name} ({code})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="region">Region</label>
              <select id="region" value={selectedRegion ?? ""} onChange={handleRegionSelect}>
                <option value="" disabled>Select region</option>
                {(Object.entries(regionNames) as [string, string][]).map(([code, name]) => (
                  <option key={code} value={code}>{name} ({code})</option>
                ))}
              </select>
            </div>
            <button className="submit-button" onClick={handleSubmit} disabled={!selectedLanguage || !selectedRegion}>
              Continue
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
