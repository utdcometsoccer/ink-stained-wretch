import type { FC } from 'react';
import { useLocalizationContext } from '../hooks/useLocalizationContext';
import { useTrackComponent } from '../hooks/useTrackComponent';
import './ErrorPage.css';
import type { ErrorPageProps } from "./ErrorPageProps";

export const ErrorPage: FC<ErrorPageProps> = ({ state, dispatch, isDevelopment, culture = 'en-us' }) => {
  useTrackComponent('ErrorPage', { state, isDevelopment, culture });
  const { error } = state;
  const detailedError = typeof error === 'string' ? error : error?.message || 'No additional error information available.';
  const localization = useLocalizationContext();
  const localized = localization.ErrorPage;
  return (
    <div className="error-page">
  <h1>{localized.title}</h1>
      {isDevelopment() ? (
        <>
          <p>{localized.devMessage}</p>
          {state.error && (
            <div className="error-details">
              <h3>{localized.details}</h3>
              <pre>
                {detailedError}
              </pre>
            </div>
          )}
          <button 
            className="error-button"
            onClick={() => dispatch({ type: 'CLEAR_ERROR' })}
          >
            {localized.tryAgain}
          </button>
        </>
      ) : (
        <>
          <p>{localized.userMessage}</p>
          <button 
            className="error-button"
            onClick={() => dispatch({ type: 'CLEAR_ERROR' })}
          >
            {localized.return}
          </button>
        </>
      )}
    </div>
  );
};
