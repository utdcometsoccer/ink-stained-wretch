import { useEffect, useReducer, useCallback } from 'react';
import { appReducer } from '../reducers/appReducer';
import { loadStateFromCookie } from '../services/loadStateFromCookie';
import { initializeAppInsights, trackEvent, trackException, trackPageView } from '../services/applicationInsights';
import { getDefaultLocale } from '../services/getDefaultLocale';
import { useRunOnce } from './useRunOnce';
import { getLocalizedText } from '../services/localization';

export function useAppLogic() {
  const [appState, dispatch] = useReducer(appReducer, loadStateFromCookie());
  const { loading, localizationData, localizationDataLoaded } = appState.state;

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
  useRunOnce(() => {
    async function fetchLocalizedText() {
      try {
        dispatch({ type: 'UPDATE_STATE', payload: { localizationDataLoaded: false } });
        dispatch({ type: 'UPDATE_STATE', payload: { loading: true } });
        const localizedText = await getLocalizedText(culture);
        const localized = localizedText || getDefaultLocale();
        dispatch({ type: 'UPDATE_STATE', payload: { localizationData: localized } });
        dispatch({ type: 'UPDATE_STATE', payload: { localizationDataLoaded: true } });
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : String(err) });
      } finally {
        dispatch({ type: 'UPDATE_STATE', payload: { loading: false } });
      }
    }
    localizationDataLoaded ? fetchLocalizedText() : () => console.log('Localization data already loaded');
  });  

  

  const handleReactError = useCallback((error: Error) => {
    trackException(error, 3);
    dispatch({ type: 'SET_ERROR', payload: error.message || 'A React component error occurred' });
  }, []);

  return {
    appState,
    dispatch,
    localized: localizationData || getDefaultLocale(),
    loading,
    handleReactError,
  } as const;
}
