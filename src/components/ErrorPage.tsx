import type { FC } from 'react';
import { useEffect } from 'react';
import { trackComponent } from "../services/trackComponent";
import './ErrorPage.css';
import type { ErrorPageProps } from "./ErrorPageProps";

export const ErrorPage: FC<ErrorPageProps> = ({ state, dispatch, isDevelopment }) => {
  useEffect(() => {
    trackComponent('ErrorPage', { state, isDevelopment });
  }, [state, isDevelopment]);
  const { error } = state;
  const detailedError = typeof error === 'string' ? error : error?.message || 'No additional error information available.';
  return (
    <div className="error-page">
      <h1>Error</h1>
      {isDevelopment() ? (
        <>
          <p>Something went wrong during development.</p>
          {state.error && (
            <div className="error-details">
              <h3>Detailed Error Information:</h3>
              <pre>
                {detailedError}
              </pre>
            </div>
          )}
          <button 
            className="error-button"
            onClick={() => dispatch({ type: 'CLEAR_ERROR' })}
          >
            Try Again
          </button>
        </>
      ) : (
        <>
          <p>We're sorry, but something went wrong. Please try again later.</p>
          <button 
            className="error-button"
            onClick={() => dispatch({ type: 'CLEAR_ERROR' })}
          >
            Return to App
          </button>
        </>
      )}
    </div>
  );
};
