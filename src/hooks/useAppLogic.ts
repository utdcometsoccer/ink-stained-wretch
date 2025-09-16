import { useEffect, useReducer, useCallback } from 'react';
import { appReducer } from '../reducers/appReducer';
import { loadStateFromCookie } from '../services/loadStateFromCookie';
import { initializeAppInsights, trackEvent, trackException, trackPageView } from '../services/applicationInsights';
import { useGetLocalizedText } from './useGetLocalizedText';
import { getDefaultLocale } from '../services/getDefaultLocale';

export function useAppLogic() {
  const [appState, dispatch] = useReducer(appReducer, loadStateFromCookie());

  // Initialize Application Insights once
  useEffect(() => {
    initializeAppInsights();
    trackEvent('App_Initialized', {
      initialState: appState.currentUIState,
      timestamp: new Date().toISOString(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track UI state changes
  useEffect(() => {
    trackPageView(`${appState.currentUIState}`, window.location.href);
    trackEvent('UI_State_Changed', {
      newState: appState.currentUIState,
      timestamp: new Date().toISOString(),
    });
  }, [appState.currentUIState]);

  // Global error handlers
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const error = new Error(event.error?.message || 'An unexpected error occurred');
      trackException(error, 3);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = new Error(event.reason?.message || 'An unhandled promise rejection occurred');
      trackException(error, 3);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Localization
  const culture = appState.state.cultureInfo?.Culture || 'en-us';
  const { localizedText, loading, error } = useGetLocalizedText(culture);
  const localized = localizedText || getDefaultLocale();

  // Propagate localization errors
  useEffect(() => {
    if (error) {
      trackException(error instanceof Error ? error : new Error(String(error)), 3);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : String(error) });
    }
  }, [error]);

  // Stripe integration is handled at the App component level

  const handleReactError = useCallback((error: Error) => {
    trackException(error, 3);
    dispatch({ type: 'SET_ERROR', payload: error.message || 'A React component error occurred' });
  }, []);

  return {
    appState,
    dispatch,
    localized,
    loading,
    handleReactError,
  } as const;
}
