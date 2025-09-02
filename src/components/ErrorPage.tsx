import './ErrorPage.css';
import type { ErrorPageProps } from "./ErrorPageProps";

export function ErrorPage({ state, dispatch }: ErrorPageProps) {
  const isDevelopment = import.meta.env.MODE === 'development';
  
  return (
    <div className="error-page">
      <h1>Error</h1>
      {isDevelopment ? (
        <>
          <p>Something went wrong during development.</p>
          {state.error && (
            <div className="error-details">
              <h3>Detailed Error Information:</h3>
              <pre>
                {state.error}
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
}
