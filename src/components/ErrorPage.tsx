import type { FC } from 'react';
import { useGetLocalizedText } from '../hooks/useGetLocalizedText';
import { useTrackComponent } from '../hooks/useTrackComponent';
import './ErrorPage.css';
import type { ErrorPageProps } from "./ErrorPageProps";

export const ErrorPage: FC<ErrorPageProps> = ({ state, dispatch, isDevelopment, culture = 'en-us' }) => {
  useTrackComponent('ErrorPage', { state, isDevelopment, culture });
  const { error } = state;
  const detailedError = typeof error === 'string' ? error : error?.message || 'No additional error information available.';
  const localized = useGetLocalizedText(culture)?.ErrorPage;
  return (
    <div className="error-page">
      <h1>{localized?.title ?? 'Error'}</h1>
      {isDevelopment() ? (
        <>
          <p>{localized?.devMessage ?? 'Something went wrong during development.'}</p>
          {state.error && (
            <div className="error-details">
              <h3>{localized?.details ?? 'Detailed Error Information:'}</h3>
              <pre>
                {detailedError}
              </pre>
            </div>
          )}
          <button 
            className="error-button"
            onClick={() => dispatch({ type: 'CLEAR_ERROR' })}
          >
            {localized?.tryAgain ?? 'Try Again'}
          </button>
        </>
      ) : (
        <>
          <p>{localized?.userMessage ?? "We're sorry, but something went wrong. Please try again later."}</p>
          <button 
            className="error-button"
            onClick={() => dispatch({ type: 'CLEAR_ERROR' })}
          >
            {localized?.return ?? 'Return to App'}
          </button>
        </>
      )}
    </div>
  );
};
